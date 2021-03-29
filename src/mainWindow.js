
const path =  require('path')
const isDev = require("electron-is-dev");

const { BrowserWindow, app } = require("electron");





let mainWindow = new BrowserWindow({
   // show :false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      
    },
   width : 900,
   height : 730,
   resizable :false,
   frame : false,
  icon: `${path.join(__dirname, "../img/1-4. logo-icon.png")}`
});

mainWindow.loadURL(
  isDev
      ? "index.html"
      :
  `file://${path.join(__dirname, "./index.html")}`
);


mainWindow.on('focus', () => {
  new_messages = require("./newMessages");
  new_messages = [];
  console.log(new_messages);
  app.setBadgeCount(new_messages.length);
})

  mainWindow.on('closed', function() {
    mainWindow = null;
});

app.on('window-all-closed', function() {
  if(process.platform != 'darwin')
      app.quit();
})

 
 

  

  mainWindow.on('close', ()=>{
    app.quit()
  })
module.exports = mainWindow;

