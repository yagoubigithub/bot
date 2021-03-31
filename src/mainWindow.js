
const path =  require('path')
const fs = require("fs");
const isDev = require("electron-is-dev");

const { BrowserWindow, app } = require("electron");





let mainWindow = new BrowserWindow({
    show :false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      
    },
   width : 900,
   height : 730,
   resizable :false,
   //frame : false,
   icon: isDev
    ? `${path.join(__dirname, "../img/1-4. logo-icon.png")}`
    : `${path.join(__dirname, "./img/1-4. logo-icon.png")}`,
});

const loadPath = process.platform === 'win32' ?  `file://${path.join(__dirname, "./index.html")}` :
`${path.join(__dirname, "./index.html")}`;
mainWindow.loadURL(
  isDev
      ? `${path.join(__dirname, "./index.html")}`
      :
  loadPath
);


mainWindow.on('focus', () => {
  new_messages =  require(`${path.join(__dirname,"./newMessages" )}`)
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

 
if (
  !fs.existsSync(isDev ? "start.txt" : path.join(__dirname, "../../start.txt"))
) {
  mainWindow.show();
  try {
    fs.writeFileSync(
      isDev ? "start.txt" : path.join(__dirname, "../../start.txt"),
      new Date().getTime().toString(),
      "utf-8"
    );
  } catch (e) {
    
  }
} else {
  mainWindow.hide();
}


  

  mainWindow.on('close', ()=>{
    app.quit()
  })
module.exports = mainWindow;

