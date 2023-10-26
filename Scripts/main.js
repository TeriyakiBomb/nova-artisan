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

  process.onStdout(function (line) {
    console.log("Running " + line);
    console.log(nova.workspace.path);
  });

  process.onStderr(function (line) {
    console.error("Error: " + line);
  });

  process.onDidExit(function (status) {
    console.log("Process exited with status: " + status);

    if (status == 0) {
      nova.workspace.showInformativeMessage(successMessage);
    } else if (status != 0) {
      console.error("process finished with non-zero status");
      nova.workspace.showErrorMessage("Error: " + line);
      return;
    }
  });

  process.start();
}

nova.commands.register("laravel-artisan.guy", (workspace) => {
  runLaravelCommand({
    command: "make:model boot",
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
