import curses
import json
import os
import sys
import textwrap
import time
import urllib.request
import urllib.error

class TUI:
    def __init__(self, stdscr, config):
        self.stdscr = stdscr
        self.config = config

        # State
        self.mode = "chat" # chat, genome_sequencer, neural_weaver
        self.input_string = ""
        self.output_lines = [self.config["status_messages"]["active"]]
        self.command_history = []
        self.history_index = -1
        self.ai_enabled = True

        # Genome Sequencer State
        self.genome_path = []
        self.genome_view = {}
        self.genome_keys = []
        self.genome_selection_index = 0

        # API Key
        self.api_key = os.getenv(self.config["runtime"]["api"]["auth"]["env_var"])
        if not self.api_key:
            self.output_lines.append(f"ERROR: API key env var '{self.config['runtime']['api']['auth']['env_var']}' not set.")
            self.ai_enabled = False

        # Curses Setup
        curses.curs_set(1)
        self.stdscr.nodelay(1)
        self.stdscr.timeout(100)

        # Colors
        curses.start_color()
        curses.init_pair(1, curses.COLOR_CYAN, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_WHITE, curses.COLOR_BLACK)
        curses.init_pair(3, curses.COLOR_GREEN, curses.COLOR_BLACK)
        curses.init_pair(4, curses.COLOR_RED, curses.COLOR_BLACK)

        self.height, self.width = self.stdscr.getmaxyx()
        self.create_panes()

    def create_panes(self):
        """Create the curses window panes."""
        state_width = self.width // 3
        output_width = self.width - state_width
        input_height = 3

        self.state_win = curses.newwin(self.height - input_height - 1, state_width, 1, 0)
        self.output_win = curses.newwin(self.height - input_height - 1, output_width, 1, state_width)
        self.input_win = curses.newwin(input_height, self.width, self.height - input_height, 0)

    def draw_state_pane(self):
        """Draws the default state pane with Golem config."""
        self.state_win.clear()
        self.state_win.box()
        self.state_win.addstr(0, 2, " Golem State ", curses.color_pair(3))

        config_str = json.dumps(self.config['entity'], indent=2)
        config_lines = config_str.split('\n')

        y = 1
        for line in config_lines:
            if y < self.state_win.getmaxyx()[0] - 1:
                self.state_win.addstr(y, 2, line[:self.state_win.getmaxyx()[1]-4], curses.color_pair(2))
                y += 1
        self.state_win.refresh()

    def draw_genome_pane(self):
        """Draws the interactive Genome Sequencer pane."""
        self.state_win.clear()
        self.state_win.box()
        path_str = " / ".join(["config"] + [str(p) for p in self.genome_path])
        self.state_win.addstr(0, 2, f" Genome Sequencer: /{path_str} ", curses.color_pair(3))

        for i, key in enumerate(self.genome_keys):
            if i + 1 >= self.state_win.getmaxyx()[0] - 1:
                break

            display_str = f"{key}"
            if i == self.genome_selection_index:
                self.state_win.addstr(i + 1, 2, display_str, curses.color_pair(1) | curses.A_REVERSE)
            else:
                self.state_win.addstr(i + 1, 2, display_str, curses.color_pair(2))

        self.state_win.refresh()

    def draw_output_pane(self):
        """Draw the output pane with system messages."""
        self.output_win.clear()
        self.output_win.box()
        self.output_win.addstr(0, 2, " System Output ", curses.color_pair(3))

        max_lines = self.output_win.getmaxyx()[0] - 2

        # In genome mode, show details of selected item
        if self.mode == "genome_sequencer" and self.genome_keys:
            selected_key_str = self.genome_keys[self.genome_selection_index]
            selected_key = int(selected_key_str[1:-1]) if selected_key_str.startswith('[') else selected_key_str
            selected_value = self.genome_view[selected_key]
            detail_str = json.dumps(selected_value, indent=2)
            lines_to_draw = detail_str.split('\n')
        else:
            lines_to_draw = self.output_lines

        start_line = max(0, len(lines_to_draw) - max_lines)
        for i, line in enumerate(lines_to_draw[start_line:]):
            wrapped_lines = textwrap.wrap(line, self.output_win.getmaxyx()[1]-4)
            for wline in wrapped_lines:
                if i + 1 < self.output_win.getmaxyx()[0] -1:
                    self.output_win.addstr(i + 1, 2, wline, curses.color_pair(2))
                    i += 1


        self.output_win.refresh()

    def draw_input_pane(self):
        """Draw the input pane and the current user input."""
        self.input_win.clear()
        self.input_win.box()

        if self.mode == "chat":
            self.input_win.addstr(0, 2, " Command Input (Ctrl+C to exit)", curses.color_pair(3))
            prompt = self.config["interaction"]["input_symbol"]
            self.input_win.addstr(1, 2, prompt + self.input_string, curses.color_pair(1))
            self.input_win.move(1, 2 + len(prompt) + len(self.input_string))
        elif self.mode == "genome_sequencer":
            self.input_win.addstr(0, 2, " Genome Sequencer Controls ", curses.color_pair(3))
            self.input_win.addstr(1, 2, "↑/↓: Navigate, Enter: Select, Backspace: Back, q: Exit to Chat", curses.color_pair(1))
        elif self.mode == "neural_weaver":
            self.input_win.addstr(0, 2, " Neural Weaver ", curses.color_pair(3))
            self.input_win.addstr(1, 2, "Under Construction. Press 'q' to exit to Chat.", curses.color_pair(1))

        self.input_win.refresh()

    def call_ai(self, prompt):
        if not self.ai_enabled:
            self.output_lines.append("AI is disabled. API key not found.")
            return

        payload = {
            "model": self.config["runtime"]["api"]["model"],
            "messages": [{"role": "user", "content": prompt}],
            "stream": self.config["runtime"]["stream"]
        }
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        data = json.dumps(payload).encode('utf-8')

        req = urllib.request.Request(self.config["runtime"]["api"]["url"], data=data, headers=headers, method='POST')

        self.output_lines.append(self.config["interaction"]["output_symbol"])
        self.draw_output_pane()

        try:
            with urllib.request.urlopen(req) as resp:
                for line in resp:
                    decoded_line = line.decode("utf-8").strip()
                    if decoded_line.startswith("data:"):
                        decoded_line = decoded_line[5:].strip()
                    if decoded_line == "[DONE]":
                        break
                    if not decoded_line:
                        continue
                    try:
                        data = json.loads(decoded_line)
                        if "choices" in data and len(data["choices"]) > 0:
                            delta = data["choices"][0]["delta"].get("content", "")
                            if delta:
                                self.output_lines[-1] += delta
                                self.draw_output_pane()
                    except json.JSONDecodeError:
                        continue # Ignore non-JSON lines
        except urllib.error.URLError as e:
            self.output_lines.append(f"API Error: {e}")


    def update_genome_view(self):
        """Updates the view for the genome sequencer based on the current path."""
        current_level = self.config
        for key in self.genome_path:
            current_level = current_level[key]
        self.genome_view = current_level

        if isinstance(self.genome_view, dict):
            self.genome_keys = list(self.genome_view.keys())
        elif isinstance(self.genome_view, list):
            self.genome_keys = [f"[{i}]" for i in range(len(self.genome_view))]
        else:
            self.genome_keys = []

        self.genome_selection_index = 0

    def handle_genome_input(self, key):
        """Handle input for the Genome Sequencer mode."""
        if key == ord('q'):
            self.mode = "chat"
            self.output_lines.append("Exited Genome Sequencer.")
        elif key == curses.KEY_UP:
            self.genome_selection_index = max(0, self.genome_selection_index - 1)
        elif key == curses.KEY_DOWN:
            if self.genome_keys:
                self.genome_selection_index = min(len(self.genome_keys) - 1, self.genome_selection_index + 1)
        elif key in [curses.KEY_ENTER, 10, 13]:
            if self.genome_keys:
                selected_key_str = self.genome_keys[self.genome_selection_index]
                selected_key = int(selected_key_str[1:-1]) if selected_key_str.startswith('[') else selected_key_str

                if isinstance(self.genome_view[selected_key], (dict, list)):
                    self.genome_path.append(selected_key)
                    self.update_genome_view()
        elif key in [curses.KEY_BACKSPACE, 127]:
            if self.genome_path:
                self.genome_path.pop()
                self.update_genome_view()
        return True

    def handle_chat_input(self, key):
        """Handle input for the default chat mode."""
        if key in [curses.KEY_ENTER, 10, 13]:
            if self.input_string:
                cmd = self.input_string
                self.command_history.append(self.input_string)
                self.history_index = len(self.command_history)
                self.output_lines.append(self.config["interaction"]["input_symbol"] + self.input_string)
                self.input_string = ""

                if cmd.lower() in self.config["interaction"]["exit_command"]: return False
                elif cmd.lower() == "/genome":
                    self.mode = "genome_sequencer"
                    self.genome_path = []
                    self.update_genome_view()
                    self.output_lines.append("Entered Genome Sequencer.")
                elif cmd.lower() == "/weaver":
                    self.mode = "neural_weaver"
                    self.output_lines.append("Entered Neural Weaver.")
                else:
                    self.call_ai(cmd)
        elif key in [curses.KEY_BACKSPACE, 127]: self.input_string = self.input_string[:-1]
        elif key == curses.KEY_UP:
            if self.command_history and self.history_index > 0:
                self.history_index -= 1; self.input_string = self.command_history[self.history_index]
        elif key == curses.KEY_DOWN:
            if self.command_history and self.history_index < len(self.command_history) - 1:
                self.history_index += 1; self.input_string = self.command_history[self.history_index]
            else:
                self.history_index = len(self.command_history); self.input_string = ""
        elif key != -1 and 32 <= key <= 126: self.input_string += chr(key)
        return True

    def run(self):
        """Main TUI loop."""
        try:
            while True:
                if self.mode == "genome_sequencer": self.draw_genome_pane()
                else: self.draw_state_pane()
                self.draw_output_pane()
                self.draw_input_pane()

                key = self.stdscr.getch()
                if self.mode == "chat":
                    if not self.handle_chat_input(key): break
                elif self.mode == "genome_sequencer":
                    if not self.handle_genome_input(key): break
                elif self.mode == "neural_weaver":
                    if key == ord('q'): self.mode = "chat"; self.output_lines.append("Exited Neural Weaver.")
        except KeyboardInterrupt:
            pass # Exit gracefully

        self.output_lines.append(self.config["status_messages"]["closed"])
        self.draw_output_pane()
        time.sleep(1)

def main(stdscr):
    with open("config.json") as f:
        config = json.load(f)
    TUI(stdscr, config).run()

if __name__ == "__main__":
    try:
        curses.wrapper(main)
    except FileNotFoundError:
        print("Error: config.json not found.")
        sys.exit(1)
    except json.JSONDecodeError:
        print("Error: config.json is not valid JSON.")
        sys.exit(1)
    except curses.error as e:
        print(f"Curses Error: {e}")
        print("Your terminal may not be large enough or may lack capabilities to run this application.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)