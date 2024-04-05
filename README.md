**Laravel Artisan** allows you to run artisan tasks from Nova's command palette and open commonly used files directories quickly.

<!--
🎈 It can also be helpful to include a screenshot or GIF showing your extension in action:
-->

![](https://raw.githubusercontent.com/TeriyakiBomb/nova-artisan/main/Images/screen.gif)

## Requirements

Laravel Artisan requires a working Laravel project and artisan (obvs).
The extension also assumes that laravel is at the root of your Nova project.
There's currently no external dependencies as this extension simply runs shell commands.

## Usage

<!--
🎈 If users will interact with your extension manually, describe those options:
-->

### Running Laravel Artisan commands:

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

With more to come in subsequent releases.

### Quickly open common directories

Need to go to a Controller and wanna use the command palette. Ok, so you type your controller name into the open quickly palette and you get a list including with a bunch of similarly named files and spend a few seconds tapping through the list to find what you what you want and find it really annoying? Oh, that doesn't annoy you? Well it annoys me, so I've added commands to list commonly accessed directories, saving you a few taps.

![](https://raw.githubusercontent.com/TeriyakiBomb/nova-artisan/main/Images/openDir.gif)

Currently opens:

- Views (For blade, Vue, React and livewire)
- Components
- Livewire components
- Layouts (Vue/React)
- Controllers
- Middlewares
- Providers
- Models
- Factories
- Migrations
- Seeders

I recommend mapping these to keyboard shortcuts to navigate your Laravel project even faster.

**Navigating views, components and layouts**

Since these directories have subdirectories, there are two methods for navigating them `Open` and `Browse`

`Open` will return a list of all files for quick filtering
`Browse` returns files in the root of the directory and lists subdirectories that you manually navigate into.

### Configuration

<!--
🎈 If your extension offers global- or workspace-scoped preferences, consider pointing users toward those settings. For example:
-->

To configure global preferences, open **Extensions → Extension Library** then select Laravel Artisan's **Preferences** tab. From here you can specify your preferred shell and enable/disable command success messages.

<!-- You can also configure preferences on a per-project basis in **Project → Project Settings...** -->

### Contribution and feedback

I'll be adding more commands and maybe some extra functionality soon, if there's anything you'd like to see or find any bugs, feel free to open an issue on GitHub.
