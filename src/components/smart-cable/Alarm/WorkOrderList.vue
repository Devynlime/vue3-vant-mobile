<template>
    <div class="alarm-data-list">
        <transition-group name="list" tag="div">
            <div class="alarmMsg alarmMsg-ambienttemperature" v-for="item in groupAlarmMessage" :key="item.ast_id">
                <el-descriptions style="width:100%;" title="烟雾报警" :column="2" size="small">
                    <template #title>
                        <span style="font-weight: bolder;">{{ getAlertType(item.alarmType) }}</span>
                    </template>
                    <template #extra>
                        <el-button link type="primary" @click="confirmWorkorder(item)">确认工单</el-button>
                    </template>
                    <el-descriptions-item label="时间" :span="1">{{ item.updateTime.substr(0, 10)
                        }}</el-descriptions-item>
                    <el-descriptions-item label="工井" :span="1">{{ item.manholeName }}</el-descriptions-item>
                    <el-descriptions-item label="数据">
                        <el-tag type="danger" size="small" effect="dark">{{ getFormatValue(item.alarmType, item.valmax)
                            }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="次数">
                        <el-tag size="small" @click="showAlarmListDlg(item)">{{ item.amcount }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="信息:" :span="2" label-class-name="custom-label">
                        <el-tag type="danger" size="small">{{ item.message }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item v-if="item.maintOrgName" label="维护单位:" :span="2" label-class-name="custom-label">
                        <el-tag type="default" size="small">{{ item.maintOrgName }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="地址:" :span="2">
                        <el-button type="primary" link @click="goParentMapPosition(item)"
                            style="max-width: 230px;text-wrap: wrap;">
                            {{ item.position }}
                        </el-button>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <div style="height: 50px;"></div>
        </transition-group>
        <el-dialog :title="workorderTitle" v-model="dialogVisible" style="height: 450px;width: 600px;"
            :draggable="`true`" @close="cancel">
            <el-descriptions class="margin-top" :column="2" :size="size" border>
                <el-descriptions-item width="100px;">
                    <template #label>
                        <div style="display: flex;flex-direction: row;">
                            <el-icon style="align-items: center;">
                                <Clock />
                            </el-icon>
                            <span style="align-self: center;margin-left: 4px;margin-top: 2px;">时间</span>
                        </div>
                    </template>
                    {{ currentWorkorder.updateTime.substr(0, 10) }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div style="display: flex;flex-direction: row;">
                            <el-icon style="align-items: center;">
                                <RefreshLeft />
                            </el-icon>
                            <span style="align-self: center;margin-left: 4px;margin-top: 2px;">次数</span>
                        </div>
                    </template>
                    {{ currentWorkorder.amcount }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div style="display: flex;flex-direction: row;">
                            <el-icon style="align-items: center;">
                                <HelpFilled />
                            </el-icon>
                            <span style="align-self: center;margin-left: 4px;margin-top: 2px;">工井</span>
                        </div>
                    </template>
                    {{ currentWorkorder.manholeName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div style="display: flex;flex-direction: row;">
                            <el-icon style="align-items: center;">
                                <tickets />
                            </el-icon>
                            <span style="align-self: center;margin-left: 4px;margin-top: 2px;">数值</span>
                        </div>
                    </template>
                    {{ currentWorkorder.valmax }}
                </el-descriptions-item>
                <el-descriptions-item span="2">
                    <template #label>
                        <div style="display: flex;flex-direction: row;">
                            <el-icon style="align-items: center;">
                                <Bell />
                            </el-icon>
                            <span style="align-self: center;margin-left: 4px;margin-top: 2px;">告警信息</span>
                        </div>
                    </template>
                    {{ currentWorkorder.message }}
                </el-descriptions-item>
                <el-descriptions-item span="2">
                    <template #label>
                        <div style="display: flex;flex-direction: row;">
                            <el-icon style="align-items: center;">
                                <location />
                            </el-icon>
                            <span style="align-self: center;margin-left: 4px;margin-top: 2px;">地址</span>
                        </div>
                    </template>
                    {{ currentWorkorder.position }}
                </el-descriptions-item>
            </el-descriptions>
            <el-form :model="form" label-width="auto" style="margin-top:10px;" :label-position="'top'">
                <el-form-item label="告警确认信息">
                    <el-input v-model="form.confirmMessage" type="textarea" rows="8" resize="none" show-word-limit
                        maxlength="256" />
                </el-form-item>
                <el-form-item>
                    <div style="display: flex;flex-direction: row;justify-content:space-between;width: 100%;">
                        <el-select v-model="form.deviceStatus" style="width: 240px;">
                            <el-option label="告警信息" value="normal" />
                            <el-option label="错误误报" value="error" />
                        </el-select>
                        <div>
                            <el-button type="primary" @click="onSubmit" :loading="isloading">确 认</el-button>
                            <el-button @click="cancelSubmit">取 消</el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { getGroupAlarmMessage } from "@/api/alarmMessage"
import { workOrderUpdate } from '@/api/work-order'
import { onMounted, ref, reactive } from "vue";
import { ElMessage } from 'element-plus'
import {
    Location,
    Bell,
    Tickets,
    User,
    Clock,
    RefreshLeft,
    HelpFilled
} from '@element-plus/icons-vue'
const emit = defineEmits(['AlarmListDlg', 'goMapPosition'])


const dialogVisible = ref(false)
const cancel = () => {
    dialogVisible.value = false
}

const workorderTitle = ref('工单确认')
const currentWorkorder = ref(null)
const confirmWorkorder = (item) => {
    currentWorkorder.value = item
    console.log(currentWorkorder.value)
    workorderTitle.value = getAlertType(item.alarmType) + ' ｜ 工单确认'
    dialogVisible.value = true
}

const form = reactive({
    deviceStatus: 'normal',
    id: '',
    alarmType: '',
    confirmMessage: '',
})

const isloading = ref(false)
const onSubmit = () => {
    if (form.confirmMessage.length < 10) {
        ElMessage({
            message: '请输入一定量的确认信息',
            type: 'warning',
        })
        return
    }
    isloading.value = true
    form.id = currentWorkorder.value.id
    form.alarmType = deleteNum(currentWorkorder.value.alarmType)
    console.log(form)
    workOrderUpdate(form).then(res => {
        isloading.value = false
        console.log(res)
        if (res.data === 2) {
            ElMessage({
                message: '工单确认成功。',
                type: 'success',
            })
            getWorkOrderList()
            dialogVisible.value = false
        } else if (res.data === -1) {
            ElMessage({
                message: res.msg,
                type: 'warning',
            })
            dialogVisible.value = false
        } else {
            ElMessage({
                message: '工单确认异常',
                type: 'warning',
            })
            dialogVisible.value = false
        }
        form.confirmMessage = ''
    })
}

const cancelSubmit = () => {
    dialogVisible.value = false
}

const showAlarmListDlg = (item) => {
    emit('AlarmListDlg', item)
}

const goParentMapPosition = (item) => {
    console.log("goParentMapPosition>>>>", item)
    emit('goMapPosition', { flydata: { center: [item.longitude, item.latitude], zoom: 16 }, title: item.manholeName, id: item.id })
}

const deleteNum = (str) => {
    let reg = /[0-9]+/g;
    let str1 = str.replace(reg, "");
    return str1;
}

const getFormatValue = (alarmType, val) => {
    console.log(alarmType, val)
    alarmType = deleteNum(alarmType)
    let value = ""
    switch (alarmType) {
        case 'ambienttemperature':
            value = val / 100 + " ℃"
            break;
        case 'BatteryVoltage':
            value = val / 1000 + " V"
            break;
        case 'cablehead':
            value = val > 0 ? '触发' : '正常'
            break;
        case 'cablehead_tem':
            value = val / 100 + " ℃"
            break;
        case 'manholecover':
            value = val === 1 ? '开启' : '正常'
            break;
        case 'signalg':
            value = val
            break;
        case 'smokedetector':
            value = val === 1 ? '触发' : '正常'
            break;
        case 'waterlevel':
            value = val === 1 ? '触发' : '正常'
            break;
        case 'waterlevelvalue':
            value = val + " PA"
            break;
    }
    return value
}

const getAlertType = (alarmType) => {
    var alarm_type_name = "告警信息"
    alarmType = deleteNum(alarmType)
    switch (alarmType) {
        case 'ambienttemperature':
            alarm_type_name = "环境温度告警"
            break;
        case 'BatteryVoltage':
            alarm_type_name = "电池低电压告警"
            break;
        case 'cablehead':
            alarm_type_name = "电缆震动感告警"
            break;
        case 'cablehead_tem':
            alarm_type_name = "电缆头温度告警"
            break;
        case 'manholecover':
            alarm_type_name = "电缆井井盖开启"
            break;
        case 'signalg':
            alarm_type_name = "感知设备4G无信号"
            break;
        case 'smokedetector':
            alarm_type_name = "烟感告警"
            break;
        case 'waterlevel':
            alarm_type_name = "水浸告警"
            break;
        case 'waterlevelvalue':
            alarm_type_name = "大气压告警"
            break;
    }
    return alarm_type_name;
}

const groupAlarmMessage = ref([])
onMounted(() => {
    getWorkOrderList()
})

const getWorkOrderList = () => {
    getGroupAlarmMessage(-3).then(res => {
        console.log("groupAlarmMessage:",res)
        groupAlarmMessage.value = res.rows
    })
}

</script>

<style scoped>
.custom-label {
    font-weight: bold;
    color: #409EFF;
}

.alarm-data-list {
    height: calc(100% - 20px);
    overflow-y: auto;
    overflow-x: hidden;
}

.alarmMsg {
    cursor: pointer;
    margin-top: 6px;
    border-radius: 3px;
    padding: 4px 6px 4px 6px;
    display: flex;
    direction: row;
    justify-content: space-between;
}

.alarmMsg-ambienttemperature {
    background-color: #eee;
    color: white;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: normal;
    line-height: 6px;
    text-align: left;
}

:deep(.el-descriptions__body) {
    background-color: var(--el-fill-color-blank);
    padding: 8px 2px 2px 2px;
}

:deep(.el-descriptions--small .el-descriptions__header) {
    margin-bottom: 4px;
}

:deep(.el-dialog__headerbtn) {
    position: absolute;
    top: 2px;
    right: 0;
    padding: 0;
    width: 32px;
    height: 32px;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: var(--el-message-close-size, 16px);
}

:deep(.el-dialog) {
    --el-dialog-width: 50%;
    --el-dialog-margin-top: 15vh;
    --el-dialog-bg-color: var(--el-bg-color);
    --el-dialog-box-shadow: var(--el-box-shadow);
    --el-dialog-title-font-size: var(--el-font-size-large);
    --el-dialog-content-font-size: 14px;
    --el-dialog-font-line-height: var(--el-font-line-height-primary);
    --el-dialog-padding-primary: 16px;
    --el-dialog-border-radius: var(--el-border-radius-small);
    background: var(--el-dialog-bg-color);
    border-radius: var(--el-dialog-border-radius);
    box-shadow: var(--el-dialog-box-shadow);
    box-sizing: border-box;
    margin: var(--el-dialog-margin-top, 15vh) auto 50px;
    overflow-wrap: break-word;
    padding: 6px 10px 14px 10px;
    position: relative;
    width: var(--el-dialog-width, 50%);
}

:deep(.el-dialog__header) {
    padding-bottom: 3px;
    border-bottom: 1px solid #ccc;
}

:deep(.el-dialog__body) {
    color: var(--el-text-color-regular);
    font-size: var(--el-dialog-content-font-size);
    padding: 5px;
}
</style>