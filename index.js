const taskz = require("taskz");
const fs = require("fs");
const readline = require("readline");

var commandLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const userInput = (commandLine) => {
  commandLine.question("Enter absolute path: ", (p) => {
    if (fs.existsSync(p)) {
      commandLine.question("Enter project name: ", async (name) => {
        await taskRunner(p, name);
        commandLine.close();
      });
    } else {
      console.log("unkown path");
      userInput(commandLine);
    }
  });
};
function taskRunner(path, name) {
  let projectName = name ? name : "my-app";
  console.log(projectName);
  let tasks = [
    {
      text: "creating new react project",
      stopOnError: true,
      task: () => sh(`cd ${path} & npx create-react-app ${projectName}`),
    },
    {
      text: "installing scripts",
      stopOnError: true,
      task: () => sh(`cd ${path} & npm install react-scripts@latest`),
    },
    {
      text: "installing prettifier",
      stopOnError: true,
      task: () =>
        sh(
          `cd ${path}/${projectName} & npm install --save-dev --save-exact prettier`
        ),
    },
    {
      text: "installing sass",
      stopOnError: true,
      task: () => sh(` cd ${path}/${projectName} & npm install sass`),
    },
    {
      text: "setup prettifier configuration",
      stopOnError: true,
      task: () => {
        // json data
        var jsonData = `{
        "semi": true,
        "singleQuote": true,
        "trailingComma": "es5",
        "arrowParens": "avoid",
        "endOfLine": "lf"
        }`;
        // parse json
        var jsonObj = JSON.parse(jsonData);

        // stringify JSON Object
        var jsonContent = JSON.stringify(jsonObj);

        fs.writeFile(
          `${path}/${projectName}/.prettierrc.json`,
          jsonContent,
          "utf8",
          function (err) {
            if (err) {
              console.log(
                "An error occured while writing JSON Object to File."
              );
              return console.log(err);
            }

            // /console.log("JSON file has been saved.");
          }
        );
      },
    },
    {
      text: "finishing...",
      stopOnError: true,
      task: () =>
        setTimeout(() => {
          const message = ` 
            *****************************************************************
                               Setup has been finished                        
                    1- Enter 'npm start' in project's root.              
                    2- Enter 'npx prettifier --write .' for prettifying.
            ***************************************************************** `;
          console.log(message);
        }, 500),
    },
  ];
  taskz(tasks).run();
}

async function sh(cmd) {
  var process = require("child_process");

  return new Promise(function (resolve, reject) {
    process.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

userInput(commandLine);
