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

  process.onStdout(function (data, artisanError) {
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

nova.commands.register("laravel-artisan.guy", (workspace) => {
  runLaravelCommand({
    command: "make:model boog",
    successMessage: "Task completed successfully!",
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
