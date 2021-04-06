
const path = require('path')

const isDev = require("electron-is-dev");

const { BrowserWindow, app } = require("electron");


let logoPath = `${path.join(__dirname, "../img/1-4. logo-icon.png")}`

/*
if (process.platform == 'darwin') {

  logoPath = `${path.join(__dirname, "../img/1-4. logo-icon.png")}`
  //console.log(isDev,fs.existsSync(`${path.join(__dirname, "../img/1-4. logo-icon.png")}`))
}
*/

let mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,

  },
  width: 900,
  height: 730,
  icon: logoPath,


});

const loadPath = process.platform === 'win32' ?
  `file://${path.join(__dirname, "./index.html")}` :
  `${path.join(__dirname, "./index.html")}`;


const loadDevPath =   `${path.join(__dirname, "./index.html")}`


if(process.platform === "win32"){
  mainWindow.loadURL(
    isDev
      ? loadDevPath
      :
      loadPath
  );
}else{
  mainWindow.loadFile(
    isDev
      ? loadDevPath
      :
      loadPath
  );
}



mainWindow.on('focus', () => {
  new_messages = require(`${path.join(__dirname, "./newMessages")}`)
  new_messages = [];
  console.log(new_messages);
  app.setBadgeCount(new_messages.length);
})

mainWindow.on('closed', function () {
  mainWindow = null;
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin')
    app.quit();
})





mainWindow.removeMenu()



module.exports = mainWindow;

