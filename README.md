**Laravel Artisan** allows you to run artisan tasks from Nova's command palette.

<!--
🎈 It can also be helpful to include a screenshot or GIF showing your extension in action:
-->

![](https://raw.githubusercontent.com/TeriyakiBomb/nova-artisan/main/screen.gif)

## Requirements

Laravel Artisan requires a working Laravel project and artisan (obvs).
The extension also assumes that laravel is at the root of your Nova project.
There's currently no external dependencies as this extension simply runs shell commands.

## Usage

<!--
🎈 If users will interact with your extension manually, describe those options:
-->

To run Laravel Artisan:

- Select the **Editor → Laravel Artisan** menu item; or
- Open the command palette and type `Laravel Artisan` followed by the command you'd like to run. This extension supports single-fire commands like Cache clearing and also commands that need a name, like creating models and controllers. It also allows additional arguments like `--seed`

Currently supported commands are:

- Cache config
- Clear config cache
- Clear cache
- Forget cache
- Seed database
- Wipe database
- Migrate
- Migrate fresh
- Migrate refresh
- Migrate reset
- Migrate rollback
- Prune models
- Create notifications migration

and **all make commands**

With more to come in subsequent releases

### Configuration

<!--
🎈 If your extension offers global- or workspace-scoped preferences, consider pointing users toward those settings. For example:
-->

To configure global preferences, open **Extensions → Extension Library** then select Laravel Artisan's **Preferences** tab. From here you can specify your preferred shell and enable/disable command success messages.

<!-- You can also configure preferences on a per-project basis in **Project → Project Settings...** -->

### Contribution and feedback

I'll be adding more commands and maybe some extra functionality soon, if there's anything you'd like to see or find any bugs, feel free to open an issue on GitHub.
