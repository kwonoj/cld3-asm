import { app, BrowserView, BrowserWindow } from 'electron';

let mainWindow: Electron.BrowserWindow | null = null;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  });

  mainWindow.loadURL(`file://${__dirname}/${process.env.ENTRY}.html`);

  if (process.env.ENTRY === 'browserView') {
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        preload: require.resolve('./browserView-preload')
      }
    });
    mainWindow.setBrowserView(view);
    view.setBounds({ x: 0, y: 80, width: 1024, height: 768 });
    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL('http://html.com/tags/textarea/#Code_Example');
    setTimeout(() => {
      view.webContents.openDevTools();
    }, 2000);
  }
});
