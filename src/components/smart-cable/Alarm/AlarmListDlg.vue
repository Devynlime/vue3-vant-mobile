<template>
  <div>
    <el-dialog v-model="dialogVisible" style="height: 530px;" width="620px" title="告警信息" top="150px" :draggable="`true`" @close="close">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="update_time" label="告警时间" width="160" />
        <el-table-column prop="alarm_value" label="告警数值" width="90" />
        <el-table-column prop="message" label="告警信息" />
        <el-table-column prop="name" label="工井名称" />
      </el-table>
      <el-pagination @current-change="pagechange" :page-size="pageSize" :pager-count="10" layout="prev, pager, next"
        :total="totalRow" style="justify-content: right;margin-top:10px;" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElDialog } from 'element-plus'
import { selectWorkOrderAlarmMessageDetails } from '@/api/alarmMessage'

const dialogVisible = ref(false)

const emit = defineEmits(['closeAlarmListDlg'])
const props = defineProps(['showDlg'])

const tableData = ref([])

const close = () => {
  emit('closeAlarmListDlg')
}

const formdata = ref({
  "deviceId": "",
  "serviceId": "",
  "alarmType": "",
  "updateTime": ""
})

const totalRow = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const show = (data) => {
  formdata.value.deviceId = data.deviceId||data.device_id
  formdata.value.serviceId = data.serviceId||data.service_id
  formdata.value.alarmType = deleteNum(data.alarmType||data.alarm_type)
  formdata.value.updateTime = (data.updateTime||data.update_time).substr(0,10)
  currentPage.value = 1
  totalRow.value  = 0
  searchListData()
  dialogVisible.value = true
}

const searchListData = () => {
  selectWorkOrderAlarmMessageDetails(formdata.value, pageSize.value, currentPage.value).then(res => {
    console.log("searchListData res:",res)
    tableData.value = res.rows
    totalRow.value = res.total
  })
}

const deleteNum = (str) => {
    let reg = /[0-9]+/g;
    let str1 = str.replace(reg, "");
    return str1;
}

const pagechange = (num) => {
  currentPage.value = num
  searchListData()
}

defineExpose({ show })

watch(
  () => props.showDlg,
  (newData, oldData) => {
    dialogVisible.value = newData
  }
)

</script>

<style scoped>
:deep(.el-dialog__header) {
  padding: 4px;
  padding-bottom: 10px;
  margin-right: 16px;
}

:deep(.el-dialog__headerbtn) {
  position: absolute;
  top: 6px;
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
  padding: 2px 10px 14px 10px;
  position: relative;
  width: var(--el-dialog-width, 50%);
}
</style>