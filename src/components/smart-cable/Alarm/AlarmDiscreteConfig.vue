<template>
    <el-dialog 
        :title="genTitle() + '告警设置'" 
        v-model="dialogVisible"
        :close-on-click-modal="false" 
        :append-to-body="true"
        class="alarm-discrete-dialog"
        :destroy-on-close="true"
        width="400px"
    >
        <el-form :model="formData" :rules="formRules" label-position="top" ref="discreteForm">
            <el-form-item label="状态" prop="statusval">
                <el-switch 
                    v-model="formData.statusval" 
                    :active-value="1" 
                    :inactive-value="2"
                    active-text="触发时告警" 
                    inactive-text="触发时忽略" 
                />
            </el-form-item>

            <el-form-item label="触发告警信息" prop="alertMsg">
                <el-input v-model="formData.alertMsg" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch,getCurrentInstance } from 'vue';
import { setAlarmConfig, getAlarmConfig } from '@/api/alarmMessage.js'
import { ElDialog } from 'element-plus'

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
            console.log('表单校失败');
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

<style>
.alarm-discrete-dialog :deep(.el-dialog) {
    margin: 15vh auto 0 !important;
    border-radius: 8px;
}

.alarm-discrete-dialog :deep(.el-dialog__header) {
    padding: 20px 20px 10px;
    margin-right: 0;
    border-bottom: 1px solid #eee;
}

.alarm-discrete-dialog :deep(.el-dialog__body) {
    padding: 20px;
}

.alarm-discrete-dialog :deep(.el-dialog__footer) {
    padding: 10px 20px 20px;
    border-top: 1px solid #eee;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.alarm-discrete-dialog :deep(.el-form-item__label) {
    padding-bottom: 8px;
    font-weight: 500;
}

.alarm-discrete-dialog :deep(.el-switch) {
    margin: 8px 0;
}
</style>