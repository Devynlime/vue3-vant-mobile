import { defineStore } from 'pinia'

const useEWMStore = defineStore(
    'early-warning-management',
    {
      state: () => ({
        manholes: [],
        sensorType: '',
        lastHour: -1,
        deviceId: [],
        offline: 0
      }),
      actions: {
        async addManhole(val) {
          this.manholes.push(val)
        },
        async setManhole(val){
            this.manholes = []
            this.manholes.push(val)
        },
        async setOffline(val) {
          this.offline = val
        },
        async setSensorType(val) {
          this.sensorType = val
        },
        async setLastHour(val) {
          this.lastHour = val
        },
        async setDeviceId(val) {
          this.deviceId = []
          this.deviceId.push(val)
        }
      }
    }
)

export default useEWMStore
