const path =  require('path')
const isDev = require("electron-is-dev");
const {BrowserWindow} = require("electron");



let notificationWindow = new BrowserWindow({
    show :false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    alwaysOnTop : true,
   skipTaskbar: true,
  resizable :false,
    height : 200,
   width : 400,
   frame : false,
  icon: `${path.join(__dirname, "../img/1-4. logo-icon.png")}`
  });

  try {
    // and load the index.html of the app.
    notificationWindow.loadFile(
      isDev
      ? "notification.html"
      :
    `file://${path.join(__dirname, "./notification.html")}`
     );
  } catch (e) {
    console.log("Exception caught in 'createWindow': " + e.message);
  }
  

 
 
  notificationWindow.webContents.on("did-fail-load", function(e) {
    console.log("did-fail-load",e);


  })
 /*
  isDev
  ? "notification.html"
  :
`file://${path.join(__dirname, "./notification.html")}`
 */


module.exports = notificationWindow;

