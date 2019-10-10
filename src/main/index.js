// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, dialog, clipboard } from 'electron'
import path from 'path'
import fs from 'fs'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
    // titleBarStyle: 'hidden'
    // frame: false
  })

  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL('http://localhost:8111')
  } else {
    mainWindow.loadURL(formatUrl({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.on('select-path', (event, arg) => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    }).then(res => {
      if (!res.canceled) {
        event.reply('select-path-response', res.filePaths)
      }
    }).catch(err => {
      console.log(err)
    })
  })

  ipcMain.on('read-file', (event, arg) => {
    fs.readFile(arg, { encoding: 'utf8' }, (err, data) => {
      if (err) throw err
      let reg = /.+(-load \S+)"/i
      if (reg.test(data)) {
        let loadStr = RegExp.$1
        clipboard.writeText(loadStr)
        event.reply('read-file-end', loadStr)
      }
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
