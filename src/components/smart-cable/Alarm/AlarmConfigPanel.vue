<template>
  <div class="alarm-config-container">
    <!-- 传感器卡片网格 -->
    <div class="sensor-grid">
      <!-- 烟感状态 -->
      <div class="sensor-card" @click="handleEditDiscrete('smokedetector')">
        <div class="sensor-icon">
          <smokedetectorIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">烟感状态</div>
      </div>

      <!-- 设备信号 -->
      <div class="sensor-card" @click="handleEditAnalog('signal4g')">
        <div class="sensor-icon">
          <onlineIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">设备信号</div>
      </div>

      <!-- 环境温度 -->
      <div class="sensor-card" @click="handleEditAnalog('ambienttemperature')">
        <div class="sensor-icon">
          <AtmosphereIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">环境温度</div>
      </div>

      <!-- 电缆震动 -->
      <div class="sensor-card" @click="handleEditAnalog('cablehead')">
        <div class="sensor-icon">
          <vibrateIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">电缆震动</div>
      </div>

      <!-- 电缆温度 -->
      <div class="sensor-card" @click="handleEditAnalog('cablehead_tem')">
        <div class="sensor-icon">
          <cableheadTempIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">电缆温度</div>
      </div>

      <!-- 水浸监测 -->
      <div class="sensor-card" @click="handleEditDiscrete('waterlevel')">
        <div class="sensor-icon">
          <waterImmersionIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">水浸监测</div>
      </div>

      <!-- 大气压强 -->
      <div class="sensor-card" @click="handleEditAnalog('waterlevelvalue')">
        <div class="sensor-icon">
          <temperatureIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">大气压强</div>
      </div>

      <!-- 井盖状态 -->
      <div class="sensor-card" @click="handleEditDiscrete('manholecover')">
        <div class="sensor-icon">
          <manholecoverIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">井盖状态</div>
      </div>

      <!-- 电池状态 -->
      <div class="sensor-card" @click="handleEditAnalog('BatteryVoltage')">
        <div class="sensor-icon">
          <batteryIcon :iconwidth="32" :iconheight="32" :iconcolor="'#0000ff'" />
        </div>
        <div class="sensor-name">电池状态</div>
      </div>

      <!-- 红外监测 -->
      <div class="sensor-card" @click="handleEditAnalog('infrared')">
        <div class="sensor-icon">
          <infraredMonitoringIcon />
        </div>
        <div class="sensor-name">红外监测</div>
      </div>
    </div>

    

    <!-- 配置弹窗 -->
    <div class="dialog-container">
      <AlarmAnalogConfig 
        :isVisible="isAlarmAnalogConfigVisible" 
        @close="closeAlarmAnalogConfig" 
        :title="sensorName"
        :sensorType="selectedSensorType"
      />
      <AlarmDiscreteConfig 
        :isVisible="isAlarmDiscreteConfigVisible" 
        @close="closeAlarmDiscreteConfig" 
        :title="sensorName"
        :sensorType="selectedSensorType"
      />
    </div>
  </div>
</template>

<style scoped>
.alarm-config-container {
  padding: 16px;
  background: #f5f7fa;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
}

.sensor-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.sensor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.15);
}

.sensor-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f5ff;
  border-radius: 50%;
}

.sensor-name {
  font-size: 14px;
  color: #333;
  text-align: center;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .sensor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .alarm-config-container {
    padding: 12px;
  }
  
  .sensor-card {
    padding: 12px;
  }
}

.dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  pointer-events: none;
}

.dialog-container > * {
  pointer-events: auto;
}
</style>

<script setup>
import {ref} from 'vue'
import AlarmAnalogConfig from './AlarmAnalogConfig.vue';
import AlarmDiscreteConfig from './AlarmDiscreteConfig.vue';
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
} from '@/components/smart-cable/icon';

const sensorName = ref('')
const selectedSensorType = ref('')
const isAlarmAnalogConfigVisible = ref(false)
const isAlarmDiscreteConfigVisible = ref(false)

const closeAlarmAnalogConfig = () => {
  isAlarmAnalogConfigVisible.value = false
}

const closeAlarmDiscreteConfig = () => {
  isAlarmDiscreteConfigVisible.value = false
}

const handleEditDiscrete = (sensor) => {
  selectedSensorType.value = sensor
  sensorName.value = sensor
  isAlarmDiscreteConfigVisible.value = true
}

const handleEditAnalog = (sensor) => {
  selectedSensorType.value = sensor
  sensorName.value = sensor
  isAlarmAnalogConfigVisible.value = true
}
</script>