<template>
    <el-dialog 
        :title="genTitle() + '告警设置'" 
        v-model="dialogVisible"
        :close-on-click-modal="false" 
        :append-to-body="true"
        class="alarm-analog-dialog"
        :destroy-on-close="true"
        width="400px"
    >
        <el-form :rules="formRules" :model="formData" label-position="top" ref="analogForm">
            <el-form-item label="数据上限" prop="upperLimit">
                <div class="input-with-unit">
                    <el-input v-model="uppperLimitShow" type="number" />
                    <span class="unit-text">{{ getUnit() }}</span>
                </div>
            </el-form-item>

            <el-form-item label="上限越限告警信息" prop="upperLimitAlert">
                <el-input v-model="formData.upperLimitAlert" />
            </el-form-item>

            <el-form-item label="数据下限" prop="lowerLimit">
                <div class="input-with-unit">
                    <el-input v-model="lowerLimitShow" type="number" />
                    <span class="unit-text">{{ getUnit() }}</span>
                </div>
            </el-form-item>

            <el-form-item label="下限越限告警信息" prop="lowerLimitAlert">
                <el-input v-model="formData.lowerLimitAlert" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch, reactive, getCurrentInstance } from 'vue';
import { setAlarmConfig, getAlarmConfig } from '@/api/alarmMessage.js'
const emit = defineEmits(['close'])
const props = defineProps(['isVisible', 'title', 'sensorType'])

const dialogVisible = ref(false)
const submitData = ref({
    alarmType: "",
    serviceId: 'analog',
    data: {}
})

const uppperLimitShow = ref(0)
const lowerLimitShow = ref(0)
const genTitle = () => {
    switch (props.title) {
        case 'signal4g':
            return "设备信号"
        case 'ambienttemperature':
            return "环境温度"
        case 'waterlevelvalue':
            return "大气压强"
        case 'cablehead_tem':
            return "电缆温度"
        case 'cablehead':
            return "电缆震动"
        case 'BatteryVoltage':
            return "电池状态"
        case 'infrared':
            return "红外监测"
    }
}

const getFactor = () =>{
    switch (props.title) {
        case 'signal4g':
            return 1
        case 'ambienttemperature':
            return 100
        case 'waterlevelvalue':
            return 100
        case 'cablehead_tem':
            return 100
        case 'cablehead':
            return 1
        case 'BatteryVoltage':
            return 1000
        case 'infrared':
            return 100
    }
}

const getUnit = () =>{
    switch (props.title) {
        case 'signal4g':
            return ""
        case 'ambienttemperature':
            return "˚C"
        case 'waterlevelvalue':
            return "kPa"
        case 'cablehead_tem':
            return "˚C"
        case 'cablehead':
            return ""
        case 'BatteryVoltage':
            return "V"
        case 'infrared':
            return "˚C"
    }
}

const formData = reactive({
    upperLimit: 0,
    lowerLimit: 0,
    upperLimitAlert: undefined,
    lowerLimitAlert: undefined
})

const formRules = reactive({
    upperLimit: [
        { required: true, message: '数据上限不能为空', trigger: 'blur' },
    ],
    upperLimitAlert: [
        { required: true, message: '上限越限告警信息不能为空', trigger: 'blur' },
    ],
    lowerLimit: [
        { required: true, message: '数据下限不能为空', trigger: 'blur' },
    ],
    lowerLimitAlert: [
        { required: true, message: '下限越限告警信息不能为空', trigger: 'blur' },
    ],
});

const closeDialog = () => {
    emit('close')
}

const cancel = () => {
    emit('close')
}

const { proxy } = getCurrentInstance();

const submitForm = () => {
    proxy.$refs['analogForm'].validate((valid) => {
        if (valid) {
            submitData.value.alarmType = props.sensorType
            submitData.value.data = formData
            submitData.value.data.upperLimit = parseInt(uppperLimitShow.value * getFactor(), 10);
            submitData.value.data.lowerLimit = parseInt(lowerLimitShow.value * getFactor(), 10);
            setAlarmConfig(submitData.value).then(res => {
                if (res.data) {
                    Object.assign(formData, {
                        upperLimit: 0,
                        lowerLimit: 0,
                        upperLimitAlert: undefined,
                        lowerLimitAlert: undefined
                    });
                    emit('close')
                } else {
                    alert("保存失败")
                }
            })
        } else {
            console.log('表单校验失败');
            return false;
        }
    });

}

watch(
    () => props.isVisible,
    (newData, oldData) => {
        dialogVisible.value = newData
        if (newData) {
            getAlarmConfig(props.sensorType, "analog").then(res => {
                console.log(res)
                Object.assign(formData, res.data);
                uppperLimitShow.value = formData.upperLimit/getFactor()
                lowerLimitShow.value = formData.lowerLimit/getFactor()
            })
        } else {
            Object.assign(formData, {
                upperLimit: 0,
                lowerLimit: 0,
                upperLimitAlert: undefined,
                lowerLimitAlert: undefined
            });
        }
    }
)


</script>

<style>
.alarm-analog-dialog :deep(.el-dialog) {
    margin: 15vh auto 0 !important;
    border-radius: 8px;
}

.alarm-analog-dialog :deep(.el-dialog__header) {
    padding: 20px 20px 10px;
    margin-right: 0;
    border-bottom: 1px solid #eee;
}

.alarm-analog-dialog :deep(.el-dialog__body) {
    padding: 20px;
}

.alarm-analog-dialog :deep(.el-dialog__footer) {
    padding: 10px 20px 20px;
    border-top: 1px solid #eee;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.input-with-unit {
    display: flex;
    align-items: center;
    gap: 8px;
}

.input-with-unit .el-input {
    width: 120px;
}

.unit-text {
    font-size: 14px;
    color: #606266;
}

.alarm-analog-dialog :deep(.el-form-item__label) {
    padding-bottom: 8px;
    font-weight: 500;
}
</style>
