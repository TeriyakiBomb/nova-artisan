function runLaravelCommandWithInput(options) {
  let { message, placeholder, command, successMessage } = options;

  let inputOptions = {
    placeholder: placeholder,
  };
  nova.workspace.showInputPalette(message, inputOptions, function (result) {
    if (result) {
      command += " " + result;
      executeCommand(command, successMessage);
    }
  });
}

function runLaravelCommand(options) {
  let { command, successMessage } = options;
  executeCommand(command, successMessage);
}

function executeCommand(command, successMessage) {
  let fullCommand = "php artisan " + command;

  let options = {
    args: ["-c", fullCommand],
    shell: true,
    cwd: nova.workspace.path,
  };

  let process = new Process("/bin/sh", options);
  var artisanError = false;

  process.onStdout(function (data) {
    console.log("Running " + data);
    if (data.includes("ERROR")) {
      console.error("Process finished with errors");
      nova.workspace.showErrorMessage("⚠️ " + data.trim());
      artisanError = true;
      //console.log(artisanError);
      return;
    }
  });

  process.onStderr(function (data) {
    console.error("Error: " + data);
  });

  process.onDidExit(function (status) {
    console.log("Process exited with status: " + status);
    console.log(artisanError);
    if (status == 0 && !artisanError) {
      nova.workspace.showInformativeMessage(successMessage);
    } else {
      console.error("Process finished with non-zero status");
      return;
    }
  });

  process.start();
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
  runLaravelCommand({
    command: "db:wipe ",
    successMessage: "🧻 Database wiped",
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

const makeCommand = [
  "make:cast",
  "make:channel",
  "make:command",
  "make:component",
  "make:controller",
  "make:event",
  "make:exception",
  "make:factory",
  "make:job",
  "make:listener",
  "make:mail",
  "make:middleware",
  "make:migration",
  "make:model",
  "make:notification",
  "make:observer",
  "make:policy",
  "make:provider",
  "make:request",
  "make:resource",
  "make:rule",
  "make:scope",
  "make:seeder",
  "make:test",
  "make:view",
];

makeCommand.forEach((command) => {
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

  const message = `What should this ${strippedCommandName} be named?`;
  const successMessage = `💎 Successfully created ${strippedCommandName}`;

  nova.commands.register(`laravel-artisan.${formattedCommand}`, (options) => {
    runLaravelCommandWithInput({
      message: message,
      placeholder: "Name",
      command: command,
      successMessage: successMessage,
    });
  });
});
