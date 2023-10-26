function runLaravelCommandWithInput(args, placeholder, message, prompt) {
  let options = {
    placeholder: placeholder,
    prompt: prompt,
  };
  nova.workspace.showInputPalette(
    message,
    options,
    function (result) {
      if (result) {
        args += ' ' + result;
        executeCommand(args);
      }
    }
  );
}

function runLaravelCommandWithoutInput(args) {
  executeCommand(args);
}

function executeCommand(args) {
  let options = {
    args: ['-c', 'php artisan ' + args],
    shell: true,
    cwd: nova.workspace.path
  };

  let process = new Process("/bin/sh", options);

  process.onStdout(function (line) {
    console.log("Running " + line);
    //console.log(nova.workspace.path);
  });

  process.onStderr(function (line) {
    console.error("Error: " + line);
  });

  process.onDidExit(function (status) {
    console.log("Process exited with status: " + status);
  });

  process.start();
}

nova.commands.register("laravel-artisan.guy", (workspace) => {
  runLaravelCommandWithoutInput('make:model boot');
});

nova.commands.register("laravel-artisan.makeModel", (workspace) => {
  runLaravelCommandWithInput('make:model', 'Name', 'Enter a name for the model');
});