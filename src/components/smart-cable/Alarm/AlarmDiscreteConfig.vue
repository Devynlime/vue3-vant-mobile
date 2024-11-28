<template>
    <el-dialog :title="genTitle() + '告警设置'" v-model="dialogVisible" style="height: 290px;width: 450px;"
        draggable="true" @close="cancel">
        <el-form :model="formData" :rules="formRules" label-position="top" ref="discreteForm">
            <el-form-item label="状态" prop="statusval">
                <el-switch v-model="formData.statusval" width="50" size="large" :active-value="1" :inactive-value="2"
                    active-text="触发时告警" inactive-text="触发时忽略" />
            </el-form-item>

            <el-form-item label="触发告警信息" prop="alertMsg">
                <el-input v-model="formData.alertMsg"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" style="justify-content: end;display: flex;">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch,getCurrentInstance } from 'vue';
import { setAlarmConfig, getAlarmConfig } from '@/api/alarmMessage.js'

const emit = defineEmits(['close'])
const props = defineProps(['isVisible', 'title', 'sensorType'])

const dialogVisible = ref(false)
const formData = reactive({
    statusval: 2,
    alertMsg: ''
})

const genTitle = () =>{
    switch(props.title){
        case 'smokedetector':
            return "烟感状态"
        case 'manholecover':
            return "井盖状态"
        case 'waterlevel':
            return "水浸监测"
    }
}

const formRules = reactive({
    alertMsg: [
        { required: true, message: '触发告警信息不能为空', trigger: 'blur' },
    ]
});

const submitData = ref({
    alarmType: "",
    serviceId: 'discrete',
    data: {}
})

const closeDialog = () => {
    emit('close')
}

const cancel = () => {
    emit('close')
}

const { proxy } = getCurrentInstance();
const submitForm = () => {
    proxy.$refs['discreteForm'].validate((valid) => {
        if (valid) {
            console.log("====>1",formData)
            submitData.value.alarmType = props.sensorType
            submitData.value.data = formData
            console.log("====>2",submitData.value)
            setAlarmConfig(submitData.value).then(res => {
                if (res.data) {
                    Object.assign(formData, {
                        statusval: 2,
                        alertMsg: ''
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
    })
}

watch(
    () => props.isVisible,
    (newData, oldData) => {
        console.log("watch :", newData, oldData)
        dialogVisible.value = newData
        if (newData) {
            getAlarmConfig(props.sensorType, "discrete").then(res => {
                Object.assign(formData, res.data);
            })
        } else {
            Object.assign(formData, {
                statusval: 2,
                alertMsg: ''
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