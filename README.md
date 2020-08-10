# Itztli

In Nahuatl, *itztli* is the term for Obsidian.

This repository contains the theme, tools and plugins that I develop for my use with [Obsidian](https://obsidian.md/).

## [Volcano](https://github.com/kognise/volcano) plugins

After setting up Volcano and cloning this repository use:

```bash
cd volcano_plugins
npm install
npm run build

```

The plugins must be in `~/volcano/plugins` as mentioned [here](https://github.com/kognise/volcano). Make sure you symlink using the path where you cloned this repo.

```bash
mkdir -p ~/volcano/plugins
ln -s ~/your/path/here/itztli-md/volcano_plugins/build/todo-toggler.js ~/volcano/plugins/
```

### Fuzzy dates

Create date links using natural language processing using [chrono](https://github.com/wanasit/chrono) and some custom parsing.
To create a date link, select the text you want to change (e.g. `today`), and use the `NLP date` command. You can use the shortcut (default `CTRL + Y`) or the command palette (`Ctrl + P`).

![fuzzy-dates](https://user-images.githubusercontent.com/5426039/89716767-1d768700-d9b0-11ea-99cf-b3bb6846a872.gif)

You can try with any of the standard dates, i.e. today, tomorrow, in 3 weeks, in 5 months, etc.
The only behaviours I changed were the following:

| Write | Date |
| ----- | ---- |
|   next week    | next Monday      |
|   next [month]    |  1st of next month     |
|   mid [month]   | 15th of the month      |
|   end of [month]    |  last day of the month     |

If a date is not recognized, the link won't be created.

### To-do toggle

Use the `CTRL + M` hotkey to toggle the status of the selected to-do or the line the cursor is in.

![toggle-todos](https://user-images.githubusercontent.com/5426039/89807985-b1278f00-db39-11ea-9cc1-7fc26fab6fd8.gif)
