#!/usr/bin/env python3
import os, json, requests, sys

# --- Load the JSON spec from a file ---
if len(sys.argv) > 1:
    config_path = sys.argv[1]
else:
    config_path = 'config.json'

with open(config_path, 'r') as f:
    config = json.load(f)

# --- Boot sequence ---
print(config["status_messages"]["active"])

API_KEY = os.getenv(config["runtime"]["api"]["auth"]["env_var"])
if not API_KEY:
    sys.exit("No API key found in environment variable.")

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
            try:
                # The response from the API is a JSON string, but it's prefixed with "data: "
                # We need to remove that prefix before parsing.
                decoded_line = line.decode("utf-8")
                if decoded_line.startswith("data: "):
                    json_str = decoded_line[len("data: "):]
                    if json_str.strip() == "[DONE]":
                        continue
                    data = json.loads(json_str)
                    if "choices" in data and len(data["choices"]) > 0:
                        delta = data["choices"][0]["delta"].get("content","")
                        if delta:
                            output += delta
                            print(config["interaction"]["output_symbol"], delta, end="", flush=True)
            except json.JSONDecodeError:
                # Sometimes the stream sends empty lines or other non-JSON data, so we just ignore them.
                continue
    print()
    return output

# --- Interactive loop ---
while True:
    try:
        user_in = input(config["interaction"]["input_symbol"])
        if user_in.lower() in config["interaction"]["exit_command"]:
            print(config["status_messages"]["closed"])
            break
        call_ai(user_in)
    except KeyboardInterrupt:
        print(config["status_messages"]["forced_closed"])
        break
    except Exception as e:
        print(config["status_messages"]["error"], str(e))