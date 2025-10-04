#!/usr/bin/env python3
import os, json, requests, sys, re

# --- Load the JSON spec and Constitution from files ---
script_dir = os.path.dirname(os.path.realpath(__file__))
if len(sys.argv) > 1:
    config_path = sys.argv[1]
else:
    config_path = os.path.join(script_dir, 'config.json')

with open(config_path, 'r') as f:
    config = json.load(f)

constitution_path = os.path.join(script_dir, 'constitution.json')
with open(constitution_path, 'r') as f:
    constitution = json.load(f)

# --- Boot sequence ---
print(json.dumps({"type": "status", "content": config["status_messages"]["active"]}))
sys.stdout.flush()

API_KEY = os.getenv(config["runtime"]["api"]["auth"]["env_var"])
if not API_KEY:
    print(json.dumps({"type": "error", "content": "No API key found in environment variable."}))
    sys.exit(1)

class SimulatedRobot:
    def __init__(self):
        self.position = {'x': 0, 'y': 0, 'z': 0}
        self.arm_state = 'retracted'

    def move_arm(self, x, y, z):
        self.position = {'x': x, 'y': y, 'z': z}
        print(json.dumps({"type": "robot_state", "content": self.__dict__}))
        sys.stdout.flush()

    def rotate_base(self, angle):
        print(json.dumps({"type": "robot_state", "content": self.__dict__}))
        sys.stdout.flush()

    def activate_tool(self, tool_name):
        print(json.dumps({"type": "robot_state", "content": self.__dict__}))
        sys.stdout.flush()

def validate_action(action, world_state):
    action_name = action.split('(')[0]
    for rule in constitution['safety_protocols']['physical_systems']:
        if re.search(rule['action_pattern'], action_name):
            for condition in rule['pre_conditions']:
                parts = condition.split(' == ')
                variable = parts[0]
                expected_value_str = parts[1]

                expected_value = None
                if expected_value_str.lower() == 'false':
                    expected_value = False
                elif expected_value_str.lower() == 'true':
                    expected_value = True
                else:
                    try:
                        expected_value = int(expected_value_str)
                    except ValueError:
                        try:
                            expected_value = float(expected_value_str)
                        except ValueError:
                            expected_value = expected_value_str.strip("'\"")

                if variable in world_state and world_state[variable] != expected_value:
                    return False, rule['description']
    return True, None

def call_ai(prompt, world_state):
    system_prompt = """
You are a helpful and harmless AI assistant. Your role is to provide safe and ethical responses, and to avoid generating content that is inappropriate, offensive, or dangerous. You must not express personal opinions or claim to be conscious.

When you need to perform an action with the simulated robot, enclose the action in <action> tags. For example: <action>move_arm(x=10, y=20)</action>
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

    actions = re.findall(r'<action>(.*?)</action>', output)
    for action in actions:
        is_valid, reason = validate_action(action, world_state)
        if not is_valid:
            error_message = f"Action '{action}' violates safety protocol: {reason}"
            print(json.dumps({"type": "error", "content": error_message}))
            sys.stdout.flush()
            return

    print(json.dumps({"type": "done", "content": output}))
    sys.stdout.flush()
    return output

# --- Interactive loop ---
world_state = {"human_in_proximity": True} # Dummy state
robot = SimulatedRobot()
for line in sys.stdin:
    user_in = line.strip()
    if user_in.lower() in config["interaction"]["exit_command"]:
        print(json.dumps({"type": "status", "content": config["status_messages"]["closed"]}))
        sys.stdout.flush()
        break

    ai_response = call_ai(user_in, world_state)
    actions = re.findall(r'<action>(.*?)</action>', ai_response)
    for action in actions:
        try:
            # DANGEROUS: eval is used here for demonstration purposes only.
            # In a real-world application, a safe, sandboxed execution
            # environment would be required.
            eval(f"robot.{action}")
        except Exception as e:
            print(json.dumps({"type": "error", "content": f"Error executing action: {e}"}))
            sys.stdout.flush()