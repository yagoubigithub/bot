const {app} =  require("electron")

const  path  = require ("path");
const appFolder = path.dirname(process.execPath);
const updateExe = path.resolve(appFolder, "..", "Update.exe");
const exeName = path.basename(process.execPath);


//test if the app lunched by the system (auto-lunch) or the user 
function WasOpenedAtLogin() {
 
  try {
    if (process.platform == "darwin") {
      let loginSettings = app.getLoginItemSettings();
      return loginSettings.wasOpenedAtLogin;
    }
    
    return app.commandLine.hasSwitch("hidden");
  } catch {
    return false;
  }
}

//set the app to lunch after the user turn on his computer

function launchAtStartup() {
  if (process.platform === "darwin") {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true
    });
  } else {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: updateExe,
      args: [
        "--processStart",
        `"${exeName}"`,
        "--process-start-args",
        `"--hidden"`
      ]
    });
  }
}

  module.exports = launchAtStartup

  module.exports = WasOpenedAtLogin