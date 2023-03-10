import {
  createSlice,
  ListenerEffectAPI,
  PayloadAction,
  ThunkDispatch,
} from '@reduxjs/toolkit'
import type { AppStartListening } from '../../app/store'
import { Toast } from './toast.interface'

interface ToastsState {
  toasts: Toast[]
}

export const toastsSlice = createSlice({
  name: 'toasts',
  initialState: { toasts: [] } as ToastsState,
  reducers: {
    showToast(state, action: PayloadAction<Toast>) {
      const id = Date.now().toString()
      state.toasts.push({ ...action.payload, id })
    },
    hideToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const addToastAutoHideListeners = (
  startListening: AppStartListening,
) => {
  startListening({
    actionCreator: showToast,
    effect: async (action, listenerApi) => {
      const toasts = getCurrentToasts(listenerApi)
      for (const toast of toasts) {
        hideToastAfterTimeout(listenerApi, toast)
      }
    },
  })
}

const getCurrentToasts = (
  listenerAPI: ListenerEffectAPI<any, ThunkDispatch<any, any, any>, any>,
): Toast[] => {
  const state = listenerAPI.getState()
  return state.toast.toasts
}

const hideToastAfterTimeout = (
  listenerAPI: ListenerEffectAPI<any, ThunkDispatch<any, any, any>, any>,
  toast: Toast,
) => {
  const { dispatch } = listenerAPI
  const { id } = toast

  setTimeout(() => {
    dispatch(hideToast(id as string))
  }, 2500)
}

export const { showToast, hideToast } = toastsSlice.actions
export default toastsSlice.reducer
