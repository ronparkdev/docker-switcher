import path from 'path'

import { nativeImage, Tray } from 'electron'
import sharp from 'sharp'

const TRAY_ICON_WHITE = 'images/tray_icon_white.png'

let globalTray: Tray | undefined

const init = async (): Promise<void> => {
  const trayIcon = await sharp(path.join(__dirname, TRAY_ICON_WHITE))
    .resize(20)
    .toBuffer()
    .then((buffer) => nativeImage.createFromBuffer(buffer))

  const tray = new Tray(trayIcon)
  tray.setToolTip('Hello World')
  tray.setTitle('hello')

  globalTray = tray
}

const setTitle = (title: string): void => {
  globalTray?.setTitle(title)
}

export const TrayService = { init, setTitle }
