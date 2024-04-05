const SHELL_PATH_KEY = "laravel-artisan.shell.path";
const SILENCE_NOTIFICATIONS = "laravel-artisan.silence.notifications";

const artisanMakeCommands = require("./artisanMakeCommands.js");

function runLaravelCommand(options) {
  let { command, successMessage } = options;
  executeCommand(command, successMessage);
}

function runLaravelCommandWithWarning(options) {
  let { command, successMessage, warningMessage } = options;

  nova.workspace.showActionPanel(
    warningMessage,
    {
      buttons: ["Proceed", "Cancel"],
    },
    (selectedIndex) => {
      if (selectedIndex === 0) {
        // Proceed button index
        executeCommand(command, successMessage);
      }
    }
  );
}

function runLaravelCommandWithInput(options) {
  let { message, placeholder, command, successMessage, errorMessage } = options;

  let inputOptions = {
    placeholder: placeholder,
  };

  const safeString = /^[a-zA-Z]+(\s-\w+)?$/; //Only letters and hyphens

  nova.workspace.showInputPalette(message, inputOptions, (result) => {
    if (result && safeString.test(result)) {
      command += " " + result;
      executeCommand(command, successMessage);
    } else {
      showNotification("🚫 Invalid input.", errorMessage);
      console.log(errorMessage);
    }
  });
}

function executeCommand(command, successMessage) {
  let fullCommand = "php artisan " + command;

  let options = {
    args: ["-c", fullCommand],
    shell: true,
    cwd: nova.workspace.path,
  };
  const shell = nova.config.get(SHELL_PATH_KEY);
  let process = new Process(shell, options);
  let artisanError = false;
  let stdOutRunCount = 0;
  let stdoutOutput = "";

  process.onStdout((data) => {
    if (data.includes("ERROR")) {
      console.error("Process finished with errors");
      nova.workspace.showErrorMessage(`⚠️ ${data.trim()}`);
      artisanError = true;
      return;
    } else if (stdOutRunCount === 0) {
      console.log(`🏃‍♀️ Running ${fullCommand}`);
      stdOutRunCount++;
    }

    stdoutOutput += data.trim() + "\n"; // Append each trimmed line to the stdoutOutput variable
  });

  process.onStderr((data) => {
    console.error(`⚠️ Error: ${data.trim()}`);
  });

  process.onDidExit((status) => {
    const notificationsOn = nova.config.get(SILENCE_NOTIFICATIONS);
    console.log(`👍 Process exited with status: ${status}`);

    if (status === 0 && !artisanError && !notificationsOn) {
      showNotification(successMessage, `Successfully ran ${fullCommand}`);
    } else if (status !== 0) {
      console.error(`⚠️ Process finished with non-zero status - ${status}`);
    }
  });

  process.start();
}

function showNotification(title, body) {
  let notification = new NotificationRequest("LaravelArtisan-notification");

  notification.title = title;
  notification.body = body;

  nova.notifications.add(notification);
}

////////////////////////////////////////////////////////////////////////

// Config

nova.commands.register("laravel-artisan.configCache", (options) => {
  runLaravelCommand({
    command: "config:cache",
    successMessage: "💿 Config cache created",
  });
});
nova.commands.register("laravel-artisan.configClear", (options) => {
  runLaravelCommand({
    command: "config:clear",
    successMessage: "🗑️ Config cache removed",
  });
});

// Cache

nova.commands.register("laravel-artisan.cacheClear", (options) => {
  runLaravelCommand({
    command: "cache:clear",
    successMessage: "♻️ Cache cleared",
  });
});
nova.commands.register("laravel-artisan.cacheForget", (options) => {
  runLaravelCommand({
    command: "cache:forget",
    successMessage: "❓ Cache forgotten",
  });
});

// Database

nova.commands.register("laravel-artisan.dbSeed", (options) => {
  runLaravelCommand({
    command: "db:seed",
    successMessage: "🌱 Database seeded",
  });
});
nova.commands.register("laravel-artisan.dbWipe", (options) => {
  const command = "db:wipe";
  const successMessage = "🧻 Database wiped";
  const warningMessage =
    "⚠️ Are you sure you want to wipe the database? This action cannot be undone.";

  runLaravelCommandWithWarning({
    command: command,
    successMessage: successMessage,
    warningMessage: warningMessage,
    errorMessage: "❌ Error occurred while wiping the database.",
  });
});

// Migrate

nova.commands.register("laravel-artisan.migrate", (options) => {
  runLaravelCommand({
    command: "migrate",
    successMessage: "🛫 Migrated!",
  });
});
nova.commands.register("laravel-artisan.migrateFresh", (options) => {
  runLaravelCommand({
    command: "migrate:fresh",
    successMessage: "🛫 DB cleared and migrated",
  });
});
nova.commands.register("laravel-artisan.migrateRefresh", (options) => {
  runLaravelCommand({
    command: "migrate:refresh",
    successMessage: "🛬🛫 DB refreshed",
  });
});
nova.commands.register("laravel-artisan.migrateReset", (options) => {
  runLaravelCommand({
    command: "migrate:reset",
    successMessage: "🛬 DB reset",
  });
});
nova.commands.register("laravel-artisan.migrateRollback", (options) => {
  runLaravelCommand({
    command: "migrate:rollback",
    successMessage: "🛬 DB rolled back",
  });
});
nova.commands.register("laravel-artisan.modelPrune", (options) => {
  runLaravelCommand({
    command: "model:prune",
    successMessage: "✂️ Pruned unnecessary models",
  });
});
nova.commands.register("laravel-artisan.notificationsTable", (options) => {
  runLaravelCommand({
    command: "notifications:table",
    successMessage: "📢 Created notifications migration",
  });
});

Object.entries(artisanMakeCommands).forEach(
  ([command, { message, errorMessage }]) => {
    const formattedCommand = command
      .split(":")
      .map((word, index) => {
        if (index === 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");

    const strippedCommandName = formattedCommand
      .replace("make", "")
      .toLowerCase();

    const successMessage = `💎 Created ${strippedCommandName}`;

    nova.commands.register(`laravel-artisan.${formattedCommand}`, (options) => {
      runLaravelCommandWithInput({
        message: message,
        placeholder: "Name",
        command: command,
        successMessage: successMessage,
        errorMessage: errorMessage,
      });
    });
  }
);

nova.commands.register("laravel-artisan.publishAllConfigs", (options) => {
  runLaravelCommand({
    command: "config:publish",
    successMessage: "⚙️ All config files published",
  });
});

nova.commands.register("laravel-artisan.publishConfig", (workspace) => {
  const fileDirectory = nova.workspace.path + "/config";
  const listDirectory = nova.fs
    .listdir(fileDirectory)
    .filter((file) => file !== ".DS_Store");
  let options = "";

  function configToPublish(file) {
    const fileName = file.endsWith(".php") ? file.slice(0, -4) : file;
    const commandName = `publish:config ${fileName}`;
    runLaravelCommand({
      command: commandName,
      successMessage: `⚙️ Config ${fileName} published`,
    });
  }

  nova.workspace.showChoicePalette(listDirectory, options, configToPublish);
});

const laravelDirs = [
  "/app/Http/Controllers",
  "/app/Http/Middleware",
  "/app/Http/Providers",
  "/app/Models",
  "/database/factories",
  "/database/migrations",
  "/database/seeders",
];

laravelDirs.forEach((dir) => {
  const dirName = dir
    .split("/")
    .pop()
    .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  const commandName = `laravel-artisan.open${dirName}`;

  nova.commands.register(commandName, (workspace) => {
    const fileDirectory = nova.workspace.path + dir + "/";
    const listDirectory = nova.fs
      .listdir(fileDirectory)
      .filter((file) => file !== ".DS_Store");
    let options = "";

    function openThisFile(file) {
      nova.workspace.openFile(fileDirectory + file);
      //console.log(fileDirectory);
    }

    workspace.showChoicePalette(listDirectory, options, openThisFile);
  });
});

const resourceDirs = {
  inertia: [
    "/resources/js/Pages/",
    "/resources/js/Components/",
    "/resources/js/Layouts/",
  ],
  livewire: ["/resources/views/livewire/", "/app/Livewire/"],
  blade: ["/resources/views/", "/resources/views/components"],
};

function registerBrowseCommands(commandType, directories) {
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getFormattedDirectoryName = (directory, commandType) => {
    if (commandType === "livewire") {
      return directory === "/app/Livewire/" ? "Components" : "Views";
    }
    return directory
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  };

  const createCommandName = (commandBaseName, directoryName, prefix) =>
    `laravel-artisan.${prefix}${commandBaseName}${directoryName}`;

  const openDirectory = async (workspace, directory) => {
    let files = [];

    async function collectFiles(directory) {
      const list = await nova.fs.listdir(directory);
      for (const item of list) {
        if (![".DS_Store", ".gitignore", ".gitkeep"].includes(item)) {
          const fullPath = nova.path.join(directory, item);
          const stat = await nova.fs.stat(fullPath);
          if (stat.isDirectory()) {
            await collectFiles(fullPath);
          } else {
            files.push(item);
          }
        }
      }
    }

    await collectFiles(directory);
    files.sort();

    workspace.showChoicePalette(files, {}, async (choice) => {
      nova.workspace.openFile(nova.path.join(directory, choice));
    });
  };

  const browseDirectory = async (workspace, directory) => {
    const files = [];
    const dirs = [];

    const list = await nova.fs.listdir(directory);
    for (const item of list) {
      if (![".DS_Store", ".gitignore", ".gitkeep"].includes(item)) {
        const fullPath = nova.path.join(directory, item);
        const stat = await nova.fs.stat(fullPath);
        if (stat.isDirectory()) {
          dirs.push({ name: item + "/", fullPath: fullPath });
        } else {
          files.push(item);
        }
      }
    }

    const sortedOptions = [...files, ...dirs.map((dir) => dir.name)].sort();

    workspace.showChoicePalette(sortedOptions, {}, async (choice) => {
      const selectedFile = files.find((file) => file === choice);
      const selectedDir = dirs.find((dir) => dir.name === choice);
      if (selectedFile) {
        nova.workspace.openFile(nova.path.join(directory, selectedFile));
      } else if (selectedDir) {
        await browseDirectory(workspace, selectedDir.fullPath);
      }
    });
  };

  directories.forEach((directory) => {
    const directoryName = getFormattedDirectoryName(directory, commandType);
    const commandBaseName = capitalizeFirstLetter(commandType);
    const openCommandName = createCommandName(
      commandBaseName,
      directoryName,
      "open"
    );
    const browseCommandName = createCommandName(
      commandBaseName,
      directoryName,
      "browse"
    );

    nova.commands.register(openCommandName, async (workspace) => {
      const fileDirectory = nova.path.join(nova.workspace.path, directory);
      openDirectory(workspace, fileDirectory);
    });

    nova.commands.register(browseCommandName, async (workspace) => {
      const fileDirectory = nova.path.join(nova.workspace.path, directory);
      browseDirectory(workspace, fileDirectory);
    });
  });
}

Object.entries(resourceDirs).forEach(([commandType, subDirectories]) => {
  registerBrowseCommands(commandType, subDirectories);
});
