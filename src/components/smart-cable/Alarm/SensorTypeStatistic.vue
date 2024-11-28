<template>
  <div class="sensor-stats">
    <div class="stats-grid">
      <template v-for="(data, key) in sensorConfig" :key="key">
        <div class="stat-item" @click="gotoAlarmData(key)" v-if="alarmStatistic[key] || data.forceShow">
          <div class="stat-icon">
            <component :is="data.icon" :width="24" :height="24" :color="data.color"/>
          </div>
          <div class="stat-info">
            <div class="stat-label">{{ data.label }}</div>
            <div class="stat-value">
              <span class="total">{{ alarmStatistic[key]?.count || 0 }}</span>
              <span class="divider">/</span>
              <span class="confirmed">{{ alarmStatistic[key]?.confirmCount || 0 }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAlarmStatistic } from '@/api/alarmMessage'
// 导入图标
import { 
  AtmosphereIcon, 
  manholecoverIcon, 
  batteryIcon, 
  smokedetectorIcon, 
  onlineIcon, 
  temperatureIcon, 
  vibrateIcon, 
  cableheadTempIcon, 
  waterImmersionIcon,
  infraredMonitoringIcon 
} from '@/components/smart-cable/icon'

const router = useRouter()
const alarmStatistic = ref({})

// 传感器配置
const sensorConfig = {
  smokedetector: {
    label: '烟感状态',
    icon: smokedetectorIcon,
    color: '#ff976a'
  },
  signal4g: {
    label: '设备信号',
    icon: onlineIcon,
    color: '#7232dd'
  },
  ambienttemperature: {
    label: '环境温度',
    icon: temperatureIcon,
    color: '#ff8917'
  },
  cablehead: {
    label: '电缆震动',
    icon: vibrateIcon,
    color: '#2f86f6'
  },
  cablehead_tem: {
    label: '电缆温度',
    icon: cableheadTempIcon,
    color: '#ff4d4f'
  },
  waterlevel: {
    label: '水浸检测',
    icon: waterImmersionIcon,
    color: '#1989fa'
  },
  waterlevelvalue: {
    label: '大气压强',
    icon: AtmosphereIcon,
    color: '#ff8917'
  },
  manholecover: {
    label: '井盖状态',
    icon: manholecoverIcon,
    color: '#07c160'
  },
  BatteryVoltage: {
    label: '电池状态',
    icon: batteryIcon,
    color: '#ee0a24'
  },
  infrared: {
    label: '红外监测',
    icon: infraredMonitoringIcon,
    color: '#9254de',
    // 由于没有实际数据，强制显示
    forceShow: true
  }
}

// 获取告警统计数据
const fetchAlarmStatistic = async () => {
  try {
    const res = await getAlarmStatistic()
    alarmStatistic.value = res.data
  } catch (error) {
    console.error('获取告警统计失败:', error)
  }
}

// 跳转到告警数据页面
const gotoAlarmData = (type) => {
  router.push({
    name: 'AlarmSearch',
    query: { type }
  })
}

onMounted(() => {
  fetchAlarmStatistic()
})
</script>

<style scoped>
.sensor-stats {
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
  gap: 8px;
}

.stat-item {
  background: #f8f8f8;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-item:active {
  opacity: 0.7;
}

.stat-icon {
  margin-bottom: 2px;
}

.stat-info {
  width: 100%;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #646566;
  margin-bottom: 2px;
  white-space: nowrap;
}

.stat-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 13px;
}

.total {
  font-weight: bold;
  color: #323233;
}

.divider {
  color: #969799;
  margin: 0 1px;
}

.confirmed {
  color: #ff976a;
  font-size: 12px;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .stat-item {
    background: #2c2c2e;
  }
  
  .stat-label {
    color: #969799;
  }
  
  .total {
    color: #fff;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 320px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 6px;
  }

  .stat-item {
    padding: 6px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .stat-value {
    font-size: 12px;
  }
  
  .stat-icon {
    transform: scale(0.8);
  }

  .confirmed {
    font-size: 11px;
  }
}
</style>
