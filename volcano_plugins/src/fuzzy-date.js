import * as chrono from 'chrono-node';

var getLastDayOfMonth = function(y,m){
  return  new Date(y, m, 0).getDate();
};

var nextDate = new RegExp(/next\s(w+)/, "gi");

const custom = chrono.casual.clone();

custom.parsers.push({
    pattern: () => { return /\bChristmas\b/i },
    extract: (context, match) => {
        return {
            day: 25, month: 12
        }
    }
});


class FuzzyDatePlugin {
  constructor(FuzzyDateSettings) {

    this.id = 'fuzzy-date';
    this.name = 'Fuzzy date substitution';
    this.description = 'Substitute dates using Natural Language Processing';
    this.defaultOn = false;

    this.app = null;
    this.instance = null;
    this.options = {};
    this.FuzzyDateSettings = FuzzyDateSettings;
  }

  init(app, instance) {
    this.app = app;
    this.instance = instance;

    
    this.instance.registerGlobalCommand({
			id: 'nlp-date',
			name: 'NLP date',
      callback: () => this.onTrigger(),
      hotkeys: [
        {
          modifiers: ["Mod"],
          key: "y",
        },
      ]
    });

    this.instance.registerSettingTab(new this.FuzzyDateSettings(app, instance, this));
  }

  getDateString(selectedText){
    var nextDateMatch = selectedText.match(/next\s([\w]+)/i);
    var lastDayOfMatch = selectedText.match(/(last day of|end of)\s*([^\n\r]*)/i);
    var midOf = selectedText.match(/mid\s([\w]+)/i);

    if (nextDateMatch && nextDateMatch[1] === "week"){
      return custom.parseDate("next monday", new Date(), {forwardDate: true});
    }
    else if (nextDateMatch && nextDateMatch[1] === "month"){
      var thisMonth = custom.parseDate("this month", new Date(), {forwardDate: true});
      return custom.parseDate(selectedText, thisMonth, {forwardDate: true});
    }
    else if (nextDateMatch && nextDateMatch[1] === "year"){
      var thisYear = custom.parseDate("this year", new Date(), {forwardDate: true});
      return custom.parseDate(selectedText, thisYear, {forwardDate: true});
    }
    else if (lastDayOfMatch){
      var tempDate = custom.parse(lastDayOfMatch[2]);
      var year = tempDate[0].start.get("year"),
        month = tempDate[0].start.get("month");
      var lastDay = getLastDayOfMonth(year, month);
      return custom.parseDate(`${year}-${month}-${lastDay}`, new Date(), {forwardDate: true});
    }
    else if (midOf){
      return custom.parseDate(`${midOf[1]} 15th`, new Date(), {forwardDate: true});
    }
    else {
    return custom.parseDate(selectedText, new Date(), {forwardDate: true}); 

    }

  }

  onTrigger() {
    var selectedText = this.app.workspace.activeLeaf.view.sourceMode.cmEditor.getSelection();

    var date = this.getDateString(selectedText);
    
    if (date){
      var isodate = date.toISOString().substring(0, 10);
      this.app.workspace.activeLeaf.view.sourceMode.cmEditor.replaceSelection(`[[${isodate}]]`);
    }
  }

  async onEnable() {

    const options = await this.instance.loadData();
    this.options = options || {};
  }

}

module.exports = ({ SettingTab }) => {
  class FuzzyDateSettings extends SettingTab {
    constructor(app, instance, plugin) {
      super(app, instance);
      this.plugin = plugin;
    }

    display() {
      super.display();
      this.containerEl.empty();
      
      const firstDaySetting = this.addTextSetting(
        'Week starts on:',
        'The day of the week to use as a start for "next week".',
        'Default: Monday'
      );

      if (this.plugin.options.firstday) firstDaySetting.setValue(this.plugin.options.firstday);
      firstDaySetting.onChange(() => {
        this.plugin.options.firstday = firstDaySetting.getValue().trim();
        this.pluginInstance.saveData(this.plugin.options);
      })
    }
  }

  return new FuzzyDatePlugin(FuzzyDateSettings);
}