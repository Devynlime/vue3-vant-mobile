<template>
    <div style="margin-top: 8px;">
        <el-row>
            <el-col :span="8">
                <el-statistic :value="statisticJson.installed" @click="gotoManholeDeviceData('ambienttemperature',0)" >
                    <template #suffix>
                        <el-image src="/smart-cable-v2/assets/images/sensor.png" style="width:20px;height: 18px;" />
                    </template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic :value="statisticJson.installed-statisticJson.offLineCount" @click="gotoManholeDeviceData('ambienttemperature',1)" >
                    <template #suffix>
                        <el-image src="/smart-cable-v2/assets/images/online.png" style="width:20px;height: 18px;" />
                    </template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic :value="statisticJson.offLineCount" @click="gotoManholeDeviceData('ambienttemperature',-1)" >
                    <template #suffix>
                        <el-image src="/smart-cable-v2/assets/images/offline.png" style="width:20px;height: 18px;" />
                    </template>
                </el-statistic>
            </el-col>
        </el-row>
        <el-row></el-row>
        <el-row>
            <el-col :span="8">
                <el-statistic title="电缆温度" :value="184" :value-style="valueStyle"  @click="gotoManholeDeviceData('cablehead_tem',0)" >
                    <template #suffix>/<span style="color:red;">0</span></template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic title="环境温度" :value="statisticJson.installed" :value-style="valueStyle" @click="gotoManholeDeviceData('ambienttemperature',0)" >
                    <template #suffix>/<span style="color:red;">{{statisticJson.ambienttemperature_error}}</span></template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic title="电缆震动" :value="statisticJson.cablesnum" :value-style="valueStyle" @click="gotoManholeDeviceData('cablehead',0)" >
                    <template #suffix>/<span style="color:red;">0</span></template>
                </el-statistic>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-statistic title="设备信号" :value="statisticJson.installed" :value-style="valueStyle" @click="gotoManholeDeviceData('signal4g',0)" >
                    <template #suffix>/<span style="color:red;">{{statisticJson.signal4g_error}}</span></template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic title="烟感报警" :value="statisticJson.installed" :value-style="valueStyle" @click="gotoManholeDeviceData('smokedetector',0)" >
                    <template #suffix>/<span style="color:red;">0</span></template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic title="水浸检测" :value="statisticJson.installed" :value-style="valueStyle" @click="gotoManholeDeviceData('waterlevel',0)" >
                    <template #suffix>/<span style="color:red;">0</span></template>
                </el-statistic>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-statistic title="大气压强" :value="statisticJson.installed" :value-style="valueStyle" @click="gotoManholeDeviceData('waterlevelvalue',0)" >
                    <template #suffix>/<span style="color:red;">{{statisticJson.waterlevelvalue_error}}</span></template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic title="井盖状态" :value="statisticJson.installed" :value-style="valueStyle" @click="gotoManholeDeviceData('manholecover',0)" >
                    <template #suffix>/<span style="color:red;">0</span></template>
                </el-statistic>
            </el-col>
            <el-col :span="8">
                <el-statistic title="电池状态" :value="statisticJson.installed" :value-style="valueStyle" @click="gotoManholeDeviceData('BatteryVoltage',0)" >
                    <template #suffix>/<span style="color:red;">{{ statisticJson.BatteryVoltage_error }}</span></template>
                </el-statistic>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import {getManholeDeviceInfoStatistic } from "@/api/astus-dataapi"
import useEWMStore from '@/stores/modules/earlyWarningManagement'
import settingManageStore from '@/stores/modules/settingManage'
import { useRouter } from 'vue-router'


const router = useRouter();
const eWMStore = useEWMStore()
const smStore = settingManageStore()

const valueStyle = ref({
    color: 'blue',
    fontSize: '16px',
    fontWeight: 'bold'
})
const statisticJson = ref({
    BatteryVoltage_error: 0,
    ambienttemperature_error: 0,
    cablesnum: 0,
    installed: 0,
    offLineCount: 0,
    offlineCable: 0,
    signal4g_error: 0,
    waterlevelvalue_error: 0
})
onMounted(() => {
    getManholeDeviceInfoStatistic().then(res => {
        statisticJson.value = res.data
    })
})
const gotoManholeDeviceData = (sensor,offline) =>{
    eWMStore.setSensorType(sensor)
    eWMStore.setLastHour(56)
    eWMStore.setOffline(offline)
    smStore.setPath("SensorDeviceManage")
    smStore.setKey("3-1")
    router.push({
        name: "settingManageIndex"
    })
}
</script>
<style scoped>
.el-col {
    text-align: center;
}

:deep(.el-row) {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin-bottom: 8px;
}

:deep(.el-statistic__head) {
    color: var(--el-statistic-title-color);
    font-size: var(--el-statistic-title-font-size);
    font-weight: var(--el-statistic-title-font-weight);
    line-height: 20px;
    margin-bottom: 0px;
}

:deep(.el-statistic__content ) {
    color: var(--el-statistic-content-color);
    font-size: 1rem;
    /* font-weight: var(--el-statistic-content-font-weight); */
    line-height: 14px;
}

:deep(.el-statistic__content .el-statistic__number){
    text-decoration: underline;
    cursor: pointer;
}

:deep(.el-statistic__content .el-statistic__suffix) {
    display: inline-block;
    margin-left: 4px;
    text-decoration: underline;
    cursor: pointer;
}
</style>