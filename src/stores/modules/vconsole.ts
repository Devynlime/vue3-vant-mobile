import { defineStore } from 'pinia'

export const useVConsoleStore = defineStore('vconsole', {
  state: () => ({
    enabled: localStorage.getItem('vConsole-enabled') === 'true',
  }),
  actions: {
    toggleVConsole(checked: boolean) {
      this.enabled = checked
      localStorage.setItem('vConsole-enabled', checked ? 'true' : 'false')
      // 需要刷新页面以应用新设置
      window.location.reload()
    },
  },
})
