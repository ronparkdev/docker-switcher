import { app } from 'electron'

import { DockerService } from '@services/docker'
import { TrayService } from '@services/tray'

app.on('ready', () => {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  void TrayService.init()

  void DockerService.getContainers().then((containers) => console.log(containers))

  void DockerService.stopAllByImageName('jp-smartstore-nginx-image')
})
