import inquirer from 'inquirer';
import { exec } from 'node:child_process';

const questions = [
  {
    type: 'list',
    name: 'installationChoice',
    message: 'Welcome to Vixeny!, Which template would you like?',
    choices: ['pug'],
  },
  {
    type: 'input',
    name: 'projectName',
    message: 'What is the name of your project?',
    validate: (input) => {
      // Check if the name is either 'bin' or 'templas'
      if (input === 'bin' || input === 'templas') {
        return 'Project name cannot be "bin" or "templas". Please choose a different name.';
      }
      // Check if the input is not empty
      if (input.trim().length === 0) {
        return 'Project name cannot be empty.';
      }
      return true;
    },
  },
];



inquirer.prompt(questions).then((answers) => {
  // Your previous answers handling here
  const projectName = answers.projectName;
  const isVanilla = answers.installationChoice === 'vanilla';

  // Initialize a new npm project
  console.log(`Creating project ${projectName}...`);
  exec(`mkdir ${projectName} && cd ${projectName} && npm init -y`, (initError) => {
    if (initError) {
      console.error(`Failed to initialize the project: ${initError}`);
      return;
    }
    let npmInstallCmd = '';
    if(typeof Bun == 'object'){
     npmInstallCmd += `bun add vixeny chokidar@^3.6.0 --dev`;
    if (!isVanilla) {
      npmInstallCmd += ` && bun add vixeny-perspective`;
    }
  }

    if(npmInstallCmd !== ''){
    // Execute npm install command
    exec(npmInstallCmd, { cwd: `./${projectName}` }, (installError) => {
      if (installError) {
        console.error(`Failed to install dependencies: ${installError}`);
        return;
      }
    });
  }

  console.log('have fun')
  });
});

