<template>
    <el-dialog :title="genTitle() + '告警设置'" v-model="dialogVisible" style="height: 450px;width: 450px;" draggable="true"
        @close="cancel">
        <el-form :rules="formRules" :model="formData" label-position="top" ref="analogForm">
            <el-form-item label="数据上限" prop="upperLimit">
                <el-input v-model="uppperLimitShow" type="number" style="width: 100px;font-size:1.2rem;"></el-input>
                <span style="font-size:1.3rem;margin-left:6px;"> {{ getUnit() }}</span> 
            </el-form-item>

            <el-form-item label="上限越限告警信息" prop="upperLimitAlert">
                <el-input v-model="formData.upperLimitAlert"></el-input>
            </el-form-item>

            <el-form-item label="数据下限" prop="lowerLimit">
                <el-input v-model="lowerLimitShow" type="number" style="width: 100px;font-size:1.2rem;"></el-input>
                <span style="font-size:1.3rem;margin-left:6px;"> {{ getUnit() }}</span> 
            </el-form-item>

            <el-form-item label="下限越限告警信息" prop="lowerLimitAlert">
                <el-input v-model="formData.lowerLimitAlert"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="justify-content: end;display: flex;">
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

<style scoped>
:deep(.el-form-item__label) {
    color: black;
    font-weight: bolder;
}
</style>
