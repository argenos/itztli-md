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
        id: 'toggle-todo2',
        name: 'Toggle to-dos',
        callback: () => this.onTrigger(),
        hotkeys: [{
          modifiers: ["Mod"],
          key: "m",
        }]
      });

      this.instance.registerGlobalCommand({
        id: 'toggle-bullet-number',
        name: 'Toggle line to bulleted or numbered lists',
        callback: () => this.toggleLists(),
        hotkeys: [{
          modifiers: ["Mod", "Shift"],
          key: "m",
        }]
      });

      this.instance.registerGlobalCommand({
        id: 'toggle-block-quote',
        name: 'Toggle line to block quote',
        callback: () => this.toggleBlockQuote(),
        hotkeys: [{
          modifiers: ["Mod"],
          key: "<",
        }]
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
      var cursor = editor.getCursor();

      outputString = this.getSelectedText(editor);
      var selectionLen = outputString.length;
      matchedGroups = editor.getSelection().matchAll(/(^\s*)(-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d+\.\s|^)([^\n\r]*)/gmi);

      for (let a of matchedGroups) {
        if (a[0].length === 0) {
          continue;
        }
        var origString = a[0];
        var start = this.replaceTodoElement(a[2]);
        outputString = outputString.replace(origString, a[1] + start + a[3]);
      }

      editor.replaceSelection(outputString);

      // Keep cursor in the same place
      var cursorOffset = cursor.ch + outputString.length - selectionLen;
      editor.setCursor({
        line: cursor.line,
        ch: cursorOffset
      });

    }

    getSelectedText(editor) {

      if (editor.somethingSelected()) {
        // Toggle to-dos under the selection
        return editor.getSelection();

      } else {
        // Toggle the todo in the line
        var lineNr = editor.getCursor().line;
        var contents = editor.getDoc().getLine(lineNr);
        editor.getDoc().setSelection({
          line: lineNr,
          ch: 0
        }, {
          line: lineNr,
          ch: contents.length
        });
        return editor.getSelection();
      }
    }

    toggleLists() {
      var editor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
      var outputString = "";
      var matchedGroups;
      var cursor = editor.getCursor();

      outputString = this.getSelectedText(editor);
      var selectionLen = outputString.length;
      matchedGroups = editor.getSelection().matchAll(/(^\s*)(-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d+\.\s|^)([^\n\r]*)/gmi);

      for (let a of matchedGroups) {
        if (a[0].length === 0) {
          continue;
        }
        var origString = a[0];
        var start = this.replaceListElement(a[2]);
        outputString = outputString.replace(origString, a[1] + start + a[3]);
      }
      editor.replaceSelection(outputString);

      // Keep cursor in the same place
      var cursorOffset = cursor.ch + outputString.length - selectionLen;
      editor.setCursor({
        line: cursor.line,
        ch: cursorOffset
      });

    }

    toggleBlockQuote() {
      var editor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
      var outputString = "";
      var matchedGroups;
      var cursor = editor.getCursor();

      outputString = this.getSelectedText(editor);
      var selectionLen = outputString.length;
      // matchedGroups = editor.getSelection().matchAll(/(^\s*)(-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d+\.\s|>\s|^)([^\n\r]*)/gmi);
      matchedGroups = editor.getSelection().matchAll(/(^\s*)(>\s|^)([^\n\r]*)/gmi);

      for (let a of matchedGroups) {
        if (a[0].length === 0) {
          continue;
        }
        var origString = a[0];
        var start = this.replaceBlockQuote(a[2]);
        outputString = outputString.replace(origString, a[1] + start + a[3]);
      }
      editor.replaceSelection(outputString);

      // Keep cursor in the same place
      var cursorOffset = cursor.ch + outputString.length - selectionLen;
      editor.setCursor({
        line: cursor.line,
        ch: cursorOffset
      });

    }

    replaceListElement(startText) {
      if (startText === "- ") {
        return "1. ";
      } else if (startText === "") {
        return "- ";
      } else if (startText === "1. ") {
        return "";
      } else {
        return "- ";
      }
    }

    replaceBlockQuote(startText) {
      if (startText === "> ") {
        return "";
      } else if (startText === "") {
        return "> ";
      } else {
        return "> ";
      }
    }

    replaceTodoElement(startText) {
      if (startText === "- [ ] ") {
        return "- [x] ";
      } else if (startText === "- [x] ") {
        return "- ";
      } else {
        return "- [ ] ";
      }
    }


  }

  return new TodoTogglerPlugin();
};