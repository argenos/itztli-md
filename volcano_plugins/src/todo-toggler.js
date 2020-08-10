var checkmarkRegex = /(-\s\[ \]|-\s\[x\])/ig;


var mapObj = {
    "- [ ]": "- [x]",
    "- [x]": "",

    },
    re = new RegExp(Object.keys(mapObj).join("|"), "gi");

module.exports = () => {

  class TodoTogglerPlugin {
    constructor() {
      this.id = 'todo-toggler';
      this.name = 'Todo toggler plugin';
      this.description = 'Toggle to-dos with a hot key.';

      this.app = null;
      this.instance = null;
      this.options = {};
    }

    init(app, instance) {
      this.app = app;
      this.instance = instance;

      this.instance.registerGlobalCommand({
        id: 'toggle-todo',
        name: 'Toggle to-dos',
        callback: () => this.onTrigger(),
        hotkeys: [
          {
            modifiers: ["Mod"],
            key: "m",
          }
        ]
      });

      // this.instance.registerSettingTab(new TodoTogglerSettings(app, instance, this))
    }

    async onEnable() {
			const options = await this.instance.loadData();
			this.options = options || {};
		}

    onTrigger() {
        var editor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
        var outputString = "";
        var matchedGroups;
        var selectedText;
        var cursor = editor.getCursor();

        if (editor.somethingSelected()){
            console.log("Selected stuff");
            // Toggle todos under the selection
            selectedText = editor.getSelection();
            outputString = selectedText;
            matchedGroups = editor.getSelection().matchAll(/(-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d\.\s|^)([^\n\r]*)/gmi)

        }
        else {
            console.log("Handling line");
            // Toggle the todo in the line
            var lineNr = editor.getCursor().line;
            var contents = editor.getDoc().getLine(lineNr);
            editor.getDoc().setSelection({line: lineNr, ch: 0}, {line: lineNr, ch: contents.length});
            selectedText = editor.getSelection();
            outputString = selectedText;
            matchedGroups = editor.getSelection().matchAll(/(-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d\.\s|^)([^\n\r]*)/gmi)
        }
            for (let a of matchedGroups){
                console.log(a);
                if (a[0].length === 0) {
                    continue;
                }
                var origString = a[0];
                var start = this.replaceStart(a[1]);
                outputString = outputString.replace(origString, start + a[2]);
            }

            console.log(outputString);
            editor.replaceSelection(outputString);
            editor.setCursor({line: cursor.line, ch: 0});
    
    }

    replaceStart(startText){
        if (startText === "- [ ] "){
            return "- [x] ";
        }
        else if (startText === "- [x] "){
            return "";
        }
        else {
            return "- [ ] ";
        }
    }
  }

  return new TodoTogglerPlugin();
};