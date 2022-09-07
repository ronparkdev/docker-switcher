/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import ElectronStore from 'electron-store'
const store = new ElectronStore()

type ChangeListener = () => void

let _gChangeListener: ChangeListener | null = null

export const Store = {
  isActivated: () => store.get('a', false) as boolean,
  setActivated: (activated: boolean) => {
    store.set('a', activated)
    _gChangeListener?.()
  },
  getDeactivateDate: () => {
    const dateString = store.get('dd', '') as string
    return dateString ? new Date(dateString) : null
  },
  setDeactivateDate: (date: Date | null) => {
    store.set('dd', date?.toISOString() ?? '')
    _gChangeListener?.()
  },
  getMoveIntervalMinutes: () => store.get('mim', 10) as number,
  setMoveIntervalMinutes: (waitingTime: number) => {
    store.set('mim', waitingTime)
    _gChangeListener?.()
  },
  setChangeListener: (listener: ChangeListener) => {
    _gChangeListener = listener
  },
}
