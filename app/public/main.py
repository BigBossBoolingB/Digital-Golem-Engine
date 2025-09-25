#!/usr/bin/env python3
import os, json, requests, sys, select

# --- Load the JSON spec from a file ---
if len(sys.argv) > 1:
    config_path = sys.argv[1]
else:
    config_path = 'config.json'

with open(config_path, 'r') as f:
    config = json.load(f)

# --- Boot sequence ---
print(json.dumps({"type": "status", "content": config["status_messages"]["active"]}))
sys.stdout.flush()

API_KEY = os.getenv(config["runtime"]["api"]["auth"]["env_var"])
if not API_KEY:
    print(json.dumps({"type": "error", "content": "No API key found in environment variable."}))
    sys.exit(1)

def call_ai(prompt):
    system_prompt = """
You are a helpful and harmless AI assistant. Your role is to provide safe and ethical responses, and to avoid generating content that is inappropriate, offensive, or dangerous. You must not express personal opinions or claim to be conscious.
"""
    payload = {
        "model": config["runtime"]["api"]["model"],
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "stream": config["runtime"]["stream"]
    }
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    resp = requests.post(config["runtime"]["api"]["url"], headers=headers, json=payload, stream=True)

    output = ""
    for line in resp.iter_lines():
        if line:
            decoded_line = line.decode("utf-8")
            if decoded_line.startswith("data: "):
                json_str = decoded_line[len("data: "):]
                if json_str.strip() == "[DONE]":
                    break
                try:
                    data = json.loads(json_str)
                    if "choices" in data and len(data["choices"]) > 0:
                        delta = data["choices"][0]["delta"].get("content","")
                        if delta:
                            output += delta
                            print(json.dumps({"type": "delta", "content": delta}))
                            sys.stdout.flush()
                except json.JSONDecodeError:
                    continue
    print(json.dumps({"type": "done", "content": output}))
    sys.stdout.flush()
    return output

# --- Interactive loop ---
for line in sys.stdin:
    user_in = line.strip()
    if user_in.lower() in config["interaction"]["exit_command"]:
        print(json.dumps({"type": "status", "content": config["status_messages"]["closed"]}))
        sys.stdout.flush()
        break
    call_ai(user_in)