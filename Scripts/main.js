exports.activate = function () {
  // Do work when the extension is activated
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
};

nova.commands.register("laravel-artisan.guy", (workspace) => {
  let options = {
    args: ['-c', 'php artisan make:model boot'],
    shell: true,
    cwd: nova.workspace.path
  };

  let process = new Process("/bin/sh", options);

  process.onStdout(function (line) {
    console.log("Running " + line);
    console.log(nova.workspace.path)
  });

  process.onStderr(function (line) {
    console.error("Error: " + line);
  });

  process.onDidExit(function (status) {
    console.log("Process exited with status: " + status);
  });

  process.start();
});

nova.commands.register("laravel-artisan.makeModel", (workspace) => {
  var options = {
    placeholder: "Name",
    prompt: "Run",
  };
  nova.workspace.showInputPalette(
    "Enter a name for the model",
    options,
    function (result) {
      if (result) {
        let options = {
          args: ['-c', 'php artisan make:model ' + result],
          shell: true,
          cwd: nova.workspace.path
        };

        let process = new Process("/bin/sh", options);

        process.onStdout(function (line) {
          console.log(result);
          console.log("Running " + line);
          console.log(nova.workspace.path);
        });

        process.onStderr(function (line) {
          console.error("Error: " + line);
        });

        process.onDidExit(function (status) {
          console.log("Process exited with status: " + status);
        });

        process.start();
      }
    }
  );
});
