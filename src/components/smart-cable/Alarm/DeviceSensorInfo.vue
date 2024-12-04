<template>
    <div class="device-sensor-info">
        <div class="title">设备传感器情况</div>
        <div class="sensor-content">
            <!-- 顶部状态栏 -->
            <div class="status-bar">
                <div class="status-item">
                    <span class="number">188</span>
                    <img src="/assets/images/sensor.png" class="icon" />
                </div>
                <div class="status-item">
                    <span class="number">0</span>
                    <img src="/assets/images/online.png" class="icon" />
                </div>
                <div class="status-item">
                    <span class="number">188</span>
                    <img src="/assets/images/offline.png" class="icon" />
                </div>
            </div>

            <!-- 传感器数据 -->
            <div class="sensor-grid">
                <!-- 第一行 -->
                <div class="sensor-row">
                    <div class="sensor-item" @click="gotoManholeDeviceData('cablehead_tem',0)">
                        <div class="label">电缆温度</div>
                        <div class="value">
                            <span class="normal">184</span>/<span class="error">0</span>
                        </div>
                    </div>
                    <div class="sensor-item" @click="gotoManholeDeviceData('ambienttemperature',0)">
                        <div class="label">环境温度</div>
                        <div class="value">
                            <span class="normal">188</span>/<span class="error">0</span>
                        </div>
                    </div>
                    <div class="sensor-item" @click="gotoManholeDeviceData('cablehead',0)">
                        <div class="label">电缆震动</div>
                        <div class="value">
                            <span class="normal">357</span>/<span class="error">0</span>
                        </div>
                    </div>
                </div>

                <!-- 第二行 -->
                <div class="sensor-row">
                    <div class="sensor-item">
                        <div class="label">设备信号</div>
                        <div class="value">
                            <span class="normal">188</span>/<span class="error">0</span>
                        </div>
                    </div>
                    <div class="sensor-item">
                        <div class="label">烟感报警</div>
                        <div class="value">
                            <span class="normal">188</span>/<span class="error">0</span>
                        </div>
                    </div>
                    <div class="sensor-item">
                        <div class="label">水浸检测</div>
                        <div class="value">
                            <span class="normal">188</span>/<span class="error">0</span>
                        </div>
                    </div>
                </div>

                <!-- 第三行 -->
                <div class="sensor-row">
                    <div class="sensor-item">
                        <div class="label">大气压强</div>
                        <div class="value">
                            <span class="normal">188</span>/<span class="error">0</span>
                        </div>
                    </div>
                    <div class="sensor-item">
                        <div class="label">井盖状态</div>
                        <div class="value">
                            <span class="normal">188</span>/<span class="error">0</span>
                        </div>
                    </div>
                    <div class="sensor-item">
                        <div class="label">电池状态</div>
                        <div class="value">
                            <span class="normal">188</span>/<span class="error">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getManholeDeviceInfoStatistic } from "@/api/astus-dataapi"
import useEWMStore from '@/stores/modules/earlyWarningManagement'
import { useRouter } from 'vue-router'

const router = useRouter()
const eWMStore = useEWMStore()
const statisticJson = ref({})

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
.device-sensor-info {
    background: var(--el-bg-color);
    padding: 12px;
    border-radius: 4px;
    color: var(--el-text-color-primary);
}

.title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color);
    padding-bottom: 6px;
}

.status-bar {
    display: flex;
    justify-content: space-around;
    margin-bottom: 12px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.number {
    font-size: 18px;
    font-weight: bold;
    text-decoration: underline;
    color: var(--el-text-color-primary);
}

.icon {
    width: 20px;
    height: 20px;
    filter: var(--el-icon-filter); /* 深色模式下自动调整图标颜色 */
}

.sensor-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sensor-row {
    display: flex;
    justify-content: space-between;
}

.sensor-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.sensor-item:hover {
    background-color: var(--el-fill-color-light);
}

.label {
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
    font-size: 12px;
}

.value {
    font-size: 14px;
}

.normal {
    color: #0066FF;
    text-decoration: underline;
    font-weight: bold;
}

.error {
    color: #FF0000;
    font-weight: bold;
}

/* 深色模式特定样式 */
:root[data-theme='dark'] .device-sensor-info {
    background: var(--el-bg-color-overlay);
}

:root[data-theme='dark'] .icon {
    filter: brightness(0.8) invert(1);
}

:root[data-theme='dark'] .normal {
    color: #409EFF;
}

:root[data-theme='dark'] .error {
    color: #F56C6C;
}
</style>