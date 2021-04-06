// アプリケーション作成用のモジュールを読み込み
const { app, Tray, ipcMain ,Menu} = require("electron");

const isDev = require("electron-is-dev");
const path = require("path");


const launchAtStartup = require("./autoLaunch")
const  WasOpenedAtLogin= require("./autoLaunch")


// メインウィンドウ
let mainWindow, tray, notificationWindow;
try {

function createWindow() {
  
  // メインウィンドウを作成します
  mainWindow =   require(`${path.join(__dirname,"./mainWindow" )}`)
 
 
  notificationWindow =  require(`${path.join(__dirname,"./notificationWindow" )}`)

  if(!isDev){
    
   
    launchAtStartup()
    
    if(WasOpenedAtLogin()){
      mainWindow.hide()
    }
    
    

    
  }

  let forceQuit = false



  mainWindow.on('close', (e) => {
    if (!forceQuit) {
      e.preventDefault()
      mainWindow.hide()
      return
  
    }
    app.quit()
  })

 

  //set the icon tray for windows and mac
  //for mac should have 2 icons one 16x16 and other 32X32

  const iconName =
    process.platform === "win32" ? "windows-icon.png" : "iconTemplate.png";
    const iconPath  = path.join(__dirname, `../img/${iconName}`);

  //initial the tray
  tray = new Tray(iconPath);

  //get the tray position in the screen
  const { x, y } = tray.getBounds();
 
  //console.log(x,y)

  //get the width and the height of the mainWindow
  const { width, height } = notificationWindow.getBounds();

  //set the new position of the mainwindow
  //by default mainwindow will show in the center of the screen
  //we want to show the screen in the  corner of the screen

  const yPosition = process.platform === "darwin" ? y : y - height;
  notificationWindow.setBounds({
    x: x - width / 2,
    y: yPosition,
    width,
    height,
  });

 

  //this toolTip is for when you hover the tray icon will show the title
  //I just take the title from index.html
  tray.setToolTip("MENTERサポートチャット");

  //this click event for tray icon
  //if the mainwindow open we will hide it if no we will show it
  tray.on("click", () => {
    
    //notificationWindow.show()
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
  tray.on("right-click", () => {
    const template = [
      {
        label: 'Show main window',
        click: () => { mainWindow.show() }
      },
      { type: 'separator' },
      { label: 'Quit', click: () => {forceQuit = true;  app.quit() ;}}
    ]
    const contextMenu = Menu.buildFromTemplate(template)
    tray.setContextMenu(contextMenu)
  });



  // メインウィンドウに表示するURLを指定します
  // （今回はmain.jsと同じディレクトリのindex.html）
  //mainWindow.loadFile("index.html");

  // // デベロッパーツールの起動
  //mainWindow.webContents.openDevTools();
  /*
  mainWindow.webContents.on('devtools-opened', () => {
    //デベロッパツールを閉じる。
		mainWindow.webContents.closeDevTools();
	});
  */

  // メインウィンドウが閉じられたときの処理
  mainWindow.on("closed", () => {
    mainWindow = null;
    notificationWindow = null
  });
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  //  初期化が完了した時の処理
  app.on("ready", createWindow);
}
// 全てのウィンドウが閉じたときの処理
app.on("window-all-closed", () => {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on("activate", () => {
  // メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    createWindow();

  }else
  mainWindow.show()

});

// when the user recive a message event handler
ipcMain.on("new_message", (event, value) => {

  if (!mainWindow.isVisible() || mainWindow.isMinimized()) {
    if (notificationWindow) {
      //app.setBadgeCount(5);
      notificationWindow.webContents.send("new_message", { data: value });
      notificationWindow.show();
    }
  }
});

ipcMain.on("hide-window", (event, value) => {
  if (mainWindow) {
    if(process.platform == "darwin"){
      mainWindow.minimize()
    }else
    mainWindow.hide();
  }
});

//minimize-window
ipcMain.on("minimize-window", (event, value) => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on("hide-notification-window", (event, value) => {
  if (notificationWindow) {
    notificationWindow.hide();
  }
});

//show-main-window
ipcMain.on("show-main-window", (event, value) => {
  if (mainWindow) {
    notificationWindow.hide();
    mainWindow.show();
  }
});
} catch (error) {
  
    console.log(error)

 
      
  }
  