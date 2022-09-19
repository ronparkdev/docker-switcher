import { app } from 'electron'

import { TrayService } from '@services/tray'

app.on('ready', () => {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  void TrayService.init()
})
