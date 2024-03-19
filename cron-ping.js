var cron = require("node-cron");
const { exec } = require("child_process");

function runScript(scriptName) {
  exec(`node ${scriptName}`, (error, stdout, stderr) => {
    if (error || stderr)
      console.error(`Ошибка при выполнении скрипта ${scriptName}`);
    else console.log(`Скрипт ${scriptName} выполнен: ${stdout}`);
  });
}

const scripts = ["products-generate.js", "toXML.js"];
scripts.forEach((scriptName) => {
  cron.schedule("*/30 * * * *", () => runScript(scriptName));
});
