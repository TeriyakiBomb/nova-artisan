function runLaravelCommandWithInput(options) {
  let { message, placeholder, command, successMessage } = options;

  let inputOptions = {
    placeholder: placeholder,
    prompt: "Run",
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

nova.commands.register("laravel-artisan.configCache", (workspace) => {
  runLaravelCommand({
    command: "config:cache",
    successMessage: "💿 Config cache created",
  });
});
nova.commands.register("laravel-artisan.configClear", (workspace) => {
  runLaravelCommand({
    command: "config:clear",
    successMessage: "🗑️ Config cache removed",
  });
});

// Cache

nova.commands.register("laravel-artisan.cacheClear", (workspace) => {
  runLaravelCommand({
    command: "cache:clear",
    successMessage: "♻️ Cache cleared",
  });
});
nova.commands.register("laravel-artisan.cacheForget", (workspace) => {
  runLaravelCommand({
    command: "cache:forget",
    successMessage: "❓ Cache forgotten",
  });
});

// Database

nova.commands.register("laravel-artisan.dbSeed", (workspace) => {
  runLaravelCommand({
    command: "db:seed",
    successMessage: "🌱 Database seeded",
  });
});
nova.commands.register("laravel-artisan.dbWipe", (workspace) => {
  runLaravelCommand({
    command: "db:wipe ",
    successMessage: "🧻 Database wiped",
  });
});

// Migrate

nova.commands.register("laravel-artisan.migrate", (workspace) => {
  runLaravelCommand({
    command: "migrate",
    successMessage: "🛫 Migrated!",
  });
});
nova.commands.register("laravel-artisan.migrateFresh", (workspace) => {
  runLaravelCommand({
    command: "migrate:fresh",
    successMessage: "🛫 DB cleared and migrated",
  });
});

nova.commands.register("laravel-artisan.makeModel", (workspace) => {
  runLaravelCommandWithInput({
    message: "Enter a name for the model",
    placeholder: "Name",
    command: "make:model",
    successMessage: "Model created successfully!",
  });
});
