import { defineStore } from 'pinia'

const settingManageStore = defineStore(
    'setting-manage',
    {
      state: () => ({
        path: undefined,
        key: undefined,
      }),
      actions: {
        async setPath(val){
            this.path = val
        },
        async setKey(val) {
          this.key = val
        }
      }
    }
)

export default settingManageStore