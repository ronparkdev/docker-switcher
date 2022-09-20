import { Tray } from 'electron'

const TRAY_ICON_WHITE = 'build/images/tray_icon_white_s20.png'

let globalTray: Tray | undefined

const init = async (): Promise<void> => {
  console.log(process.cwd())

  const tray = new Tray(TRAY_ICON_WHITE)
  tray.setToolTip('Hello World')
  tray.setTitle('hello')

  globalTray = tray
}

const setTitle = (title: string): void => {
  globalTray?.setTitle(title)
}

export const TrayService = { init, setTitle }
