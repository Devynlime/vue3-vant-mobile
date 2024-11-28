<template>
    <div style="padding:4px;display: flex;justify-content:space-around;flex-wrap: wrap;">
        <div>
            <el-button @click="handleEditDiscrete('smokedetector')">
                <template #icon>
                    <smokedetectorIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                烟感状态</el-button>
            <el-button @click="handleEditAnalog('signal4g')">
                <template #icon>
                    <onlineIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`"/>
                </template>
                设备信号</el-button>
        </div>
        <div style="margin-top: 6px;">
            <el-button @click="handleEditAnalog('ambienttemperature')">
                <template #icon>
                    <AtmosphereIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                环境温度</el-button>
            <el-button @click="handleEditAnalog('cablehead')">
                <template #icon>
                    <vibrateIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                电缆震动</el-button>
        </div>
        <div style="margin-top: 6px;">
            <el-button @click="handleEditAnalog('cablehead_tem')">
                <template #icon>
                    <cableheadTempIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                电缆温度</el-button>
            <el-button @click="handleEditDiscrete('waterlevel')">
                <template #icon>
                    <waterImmersionIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                水浸监测</el-button>
        </div>
        <div style="margin-top: 6px;">
            <el-button @click="handleEditAnalog('waterlevelvalue')">
                <template #icon>
                    <temperatureIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                大气压强</el-button>
            <el-button @click="handleEditDiscrete('manholecover')">
                <template #icon>
                    <manholecoverIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                井盖状态</el-button>
        </div>
        <div style="margin-top: 6px;">
            <el-button @click="handleEditAnalog('BatteryVoltage')">
                <template #icon>
                    <batteryIcon :iconwidth="128" :iconheight="128" :iconcolor="`#0000ff`" />
                </template>
                电池状态</el-button>
            <el-button @click="handleEditAnalog('infrared')">
                <template #icon>
                    <infraredMonitoringIcon />
                </template>
                红外监测</el-button>
        </div>
    </div>
    <AlarmAnalogConfig :isVisible="isAlarmAnalogConfigVisible" @close="closeAlarmAnalogConfig" :title="sensorName"
    :sensorType="selectedSensorType"></AlarmAnalogConfig>
    <AlarmDiscreteConfig :isVisible="isAlarmDiscreteConfigVisible" @close="closeAlarmDiscreteConfig" :title="sensorName"
    :sensorType="selectedSensorType"></AlarmDiscreteConfig>
</template>
<script setup>
import {ref} from 'vue'
import AlarmAnalogConfig from './AlarmAnalogConfig.vue';
import AlarmDiscreteConfig from './AlarmDiscreteConfig.vue';
import { AtmosphereIcon, manholecoverIcon, batteryIcon, smokedetectorIcon, onlineIcon, temperatureIcon, vibrateIcon, cableheadTempIcon, waterImmersionIcon,infraredMonitoringIcon } from '@/components/smart-cable/icon';

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