// アプリケーション作成用のモジュールを読み込み
const { app, BrowserWindow, Tray, ipcMain ,Menu} = require("electron");
const Alert = require("electron-alert");
const AutoLaunch = require("auto-launch");
const isDev = require("electron-is-dev");
const path = require("path");

// メインウィンドウ
let mainWindow, tray, notificationWindow;
try {

function createWindow() {
  // メインウィンドウを作成します
  mainWindow =   require(`${path.join(__dirname,"./mainWindow" )}`)
  /*
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    //frame : false,
   // transparent:true,
    width: 420, height: 600,
    icon: `${path.join(__dirname, "../img/1-4. logo-icon.png")}`
  });
*/
  notificationWindow =  require(`${path.join(__dirname,"./notificationWindow" )}`)

  let autoLaunch = new AutoLaunch({
    name: "Bot",
    path:
      process.platform === "win32"
        ? app.getPath("exe")
        : "/Applications/Bot.app",
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
  });

  //set the icon tray for windows and mac
  //for mac should have 2 icons one 16x16 and other 32X32

  const iconName =
    process.platform === "win32" ? "windows-icon.png" : "iconTemplate.png";
    const iconPath = isDev ? path.join(__dirname, `../img/${iconName}`) : path.join(__dirname, `./img/${iconName}`);

  //initial the tray
  tray = new Tray(iconPath);

  //get the tray position in the screen
  const { x, y } = tray.getBounds();

  //get the width and the height of the mainWindow
  const { width, height } = notificationWindow.getBounds();

  //set the new position of the mainwindow
  //by default mainwindow will show in the center of the screen
  //we want to show the screen in the  corner of the screen

  const yPosition = process.platform !== "win32" ? y : y - height;
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
      { label: 'Quit', click: () => {app.quit(); }}
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
  }
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
  

  let alert = new Alert();
  
  let swalOptions = {
    title: "error",
    text:   error,
    type: "warning",
    showCancelButton: true
  };
  
  alert.fireFrameless(swalOptions, null, true, false);
      
  }
  