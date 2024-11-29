<template>
  <div class="work-order-container">
    <div class="alarm-data-list">
      <transition-group name="list" tag="div">
        <div class="alarm-card" v-for="item in groupAlarmMessage" :key="item.ast_id">
          <el-descriptions title="" :column="2" size="small" border>
            <template #title>
              <span class="title">{{ getAlertType(item.alarmType) }}</span>
            </template>
            <template #extra>
              <el-button link type="primary" @click="confirmWorkorder(item)">确认工单</el-button>
            </template>

            <el-descriptions-item label="时间">{{ item.updateTime.substr(0, 10) }}</el-descriptions-item>
            <el-descriptions-item label="工井">{{ item.manholeName }}</el-descriptions-item>
            
            <el-descriptions-item label="数据">
              <el-tag type="danger" size="small" effect="dark">
                {{ getFormatValue(item.alarmType, item.valmax) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="次数">
              <el-tag size="small" @click="showAlarmListDlg(item)">{{ item.amcount }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="信息:" :span="2">
              <el-tag type="danger" size="small">{{ item.message }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item v-if="item.maintOrgName" label="维护单位:" :span="2">
              <el-tag size="small">{{ item.maintOrgName }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="地址:" :span="2">
              <el-button type="primary" link @click="goParentMapPosition(item)">
                {{ item.position }}
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </transition-group>
    </div>

    <!-- 修改工单确认弹窗部分 -->
    <van-popup
      v-model:show="dialogVisible"
      round
      position="center"
      :style="{ width: '90%' }"
      class="confirm-dialog-popup"
      :overlay="true"
      :close-on-click-overlay="false"
      teleport="body"
    >
      <div class="confirm-dialog">
        <div class="confirm-header">
          <div class="header-title">{{ workorderTitle }}</div>
          <van-icon name="cross" class="close-icon" @click="cancelSubmit" />
        </div>

        <div class="confirm-content">
          <van-cell-group :border="false">
            <van-cell title="时间" :value="currentWorkorder?.updateTime.substr(0, 10)" />
            <van-cell title="次数" :value="currentWorkorder?.amcount" />
            <van-cell title="工井" :value="currentWorkorder?.manholeName" />
            <van-cell title="数值" :value="getFormatValue(currentWorkorder?.alarmType, currentWorkorder?.valmax)" />
            <van-cell title="告警信息" :value="currentWorkorder?.message" />
            <van-cell title="地址" :value="currentWorkorder?.position" />
          </van-cell-group>

          <div class="confirm-form">
            <div class="form-item">
              <div class="form-label">告警确认信息</div>
              <van-field
                v-model="form.confirmMessage"
                type="textarea"
                rows="6"
                autosize
                show-word-limit
                maxlength="256"
                placeholder="请输入确认信息"
              />
            </div>
            
            <div class="form-footer">
              <van-dropdown-menu>
                <van-dropdown-item v-model="form.deviceStatus" :options="[
                  { text: '告警信息', value: 'normal' },
                  { text: '错误误报', value: 'error' }
                ]" />
              </van-dropdown-menu>
              
              <div class="button-group">
                <van-button type="primary" :loading="isloading" @click="onSubmit">确认</van-button>
                <van-button plain @click="cancelSubmit">取消</van-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 修改告警详情弹窗 -->
    <van-popup
      v-model:show="alarmDetailVisible"
      round
      position="center"
      :style="{ width: '90%' }"
      class="alarm-detail-popup"
      :overlay="true"
      :close-on-click-overlay="true"
      teleport="body"
    >
      <div class="alarm-detail">
        <div class="alarm-header">
          <div class="header-title">告警信息</div>
          <van-icon name="cross" class="close-icon" @click="alarmDetailVisible = false" />
        </div>

        <div class="alarm-table">
          <div class="table-header">
            <div class="th">告警时间</div>
            <div class="th">告警数值</div>
            <div class="th">告警信息</div>
            <div class="th">工井名称</div>
          </div>

          <div class="table-body">
            <template v-if="alarmList.length">
              <div v-for="alarm in alarmList" :key="alarm.id" class="table-row">
                <div class="td">{{ alarm.createTime }}</div>
                <div class="td">{{ getFormatValue(alarm.alarmType, alarm.valmax) }}</div>
                <div class="td">{{ alarm.message }}</div>
                <div class="td">{{ alarm.manholeName }}</div>
              </div>
            </template>
            <div v-else class="empty-tip">
              暂无告警记录
            </div>
          </div>

          <div class="table-footer">
            <div class="pagination">
              <van-icon name="arrow-left" class="page-btn" />
              <span class="page-num">1</span>
              <van-icon name="arrow" class="page-btn" />
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGroupAlarmMessage } from '@/api/alarmMessage'
import { workOrderUpdate } from '@/api/work-order'
import { selectWorkOrderAlarmMessageDetails } from '@/api/alarmMessage'

const emit = defineEmits(['AlarmListDlg', 'goMapPosition'])

// 数据定义
const groupAlarmMessage = ref([])
const dialogVisible = ref(false)
const workorderTitle = ref('工单确认')
const currentWorkorder = ref(null)
const isloading = ref(false)

const form = reactive({
  deviceStatus: 'normal',
  id: '',
  alarmType: '',
  confirmMessage: '',
})

const alarmDetailVisible = ref(false)
const currentAlarm = ref(null)
const alarmList = ref([])

// 添加分页相关数据
const currentPage = ref(1)

// 获取工单列表
const getWorkOrderList = () => {
  getGroupAlarmMessage(-3).then(res => {
    if(res.code === 200) {
      groupAlarmMessage.value = res.rows
    }
  })
}

// 工单确认
const confirmWorkorder = (item) => {
  currentWorkorder.value = item
  workorderTitle.value = getAlertType(item.alarmType) + ' | 工单确认'
  dialogVisible.value = true
}

// 提交确认
const onSubmit = async () => {
  if (form.confirmMessage.length < 10) {
    ElMessage.warning('请输入一定量的确认信息')
    return
  }

  try {
    isloading.value = true
    form.id = currentWorkorder.value.id
    form.alarmType = deleteNum(currentWorkorder.value.alarmType)
    
    const res = await workOrderUpdate(form)
    
    if (res.data === 2) {
      ElMessage.success('工单确认成功')
      getWorkOrderList()
      dialogVisible.value = false
    } else if (res.data === -1) {
      ElMessage.warning(res.msg)
    } else {
      ElMessage.warning('工单确认异常')
    }
  } finally {
    isloading.value = false
    form.confirmMessage = ''
  }
}

// 取消确认
const cancelSubmit = () => {
  dialogVisible.value = false
}

// 查看告警详情
const showAlarmListDlg = async (item) => {
  currentAlarm.value = item
  alarmDetailVisible.value = true
  
  try {
    const res = await selectWorkOrderAlarmMessageDetails(
      {
        deviceId: item.deviceId,
        alarmType: item.alarmType,
        serviceId: item.serviceId,
        createTime: item.createTime
      },
      10,
      1
    )
    
    if(res.code === 200) {
      alarmList.value = res.rows || []
    }
  } catch (error) {
    console.error('获取告警详情失败:', error)
    ElMessage.error('获取告警详情失败')
  }
}

// 地图定位
const goParentMapPosition = (item) => {
  emit('goMapPosition', {
    flydata: {
      center: [item.longitude, item.latitude],
      zoom: 16
    },
    title: item.manholeName,
    id: item.id
  })
}

// 工具函数
const deleteNum = (str) => {
  return str?.replace(/[0-9]+/g, '') || ''
}

const getFormatValue = (alarmType, val) => {
  const type = deleteNum(alarmType)
  const formatMap = {
    ambienttemperature: () => val / 100 + ' ℃',
    BatteryVoltage: () => val / 1000 + ' V',
    cablehead: () => val > 0 ? '触发' : '正常',
    cablehead_tem: () => val / 100 + ' ℃',
    manholecover: () => val === 1 ? '开启' : '正常',
    signalg: () => val,
    smokedetector: () => val === 1 ? '触发' : '正常',
    waterlevel: () => val === 1 ? '触发' : '正常',
    waterlevelvalue: () => val + ' PA'
  }
  return formatMap[type]?.() || val
}

const getAlertType = (alarmType) => {
  const type = deleteNum(alarmType)
  const typeMap = {
    ambienttemperature: '环境温度告警',
    BatteryVoltage: '电池低电压告警', 
    cablehead: '电缆震动感告警',
    cablehead_tem: '电缆头温度告警',
    manholecover: '电缆井井盖开启',
    signalg: '感知设备4G无信号',
    smokedetector: '烟感告警',
    waterlevel: '水浸告警',
    waterlevelvalue: '大气压告警'
  }
  return typeMap[type] || '告警信息'
}

// 获取标签类型
const getTagType = (alarmType) => {
  const type = deleteNum(alarmType)
  const typeMap = {
    ambienttemperature: 'warning',
    BatteryVoltage: 'danger',
    cablehead: 'primary',
    cablehead_tem: 'danger',
    manholecover: 'success',
    signalg: 'warning',
    smokedetector: 'danger',
    waterlevel: 'primary',
    waterlevelvalue: 'warning'
  }
  return typeMap[type] || 'default'
}

onMounted(() => {
  getWorkOrderList()
})
</script>

<style scoped>
.work-order-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.alarm-data-list {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
}

.alarm-card {
  margin-bottom: 12px;
  background: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 8px;
}

:deep(.el-descriptions__cell) {
  padding: 8px 12px;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
  color: var(--el-text-color-regular);
}

:deep(.el-dialog) {
  max-width: 90%;
  margin: 15vh auto 50px;
}

:deep(.el-dialog__body) {
  padding: 16px;
}

/* 动画效果 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 修改告警详情弹窗样式 */
.alarm-detail-popup {
  background-color: #fff;
}

.alarm-detail {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.alarm-header {
  position: relative;
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #ebedf0;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}

.close-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #969799;
  cursor: pointer;
}

.alarm-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: #f7f8fa;
  border-bottom: 1px solid #ebedf0;
}

.th {
  padding: 12px 8px;
  font-size: 14px;
  color: #323233;
  text-align: center;
  font-weight: 500;
}

.table-body {
  max-height: 50vh;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid #ebedf0;
}

.td {
  padding: 12px 8px;
  font-size: 14px;
  color: #323233;
  text-align: center;
  word-break: break-all;
}

.empty-tip {
  padding: 32px 0;
  text-align: center;
  color: #969799;
}

.table-footer {
  padding: 12px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #ebedf0;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-btn {
  font-size: 16px;
  color: #323233;
  cursor: pointer;
}

.page-btn:disabled {
  color: #c8c9cc;
  cursor: not-allowed;
}

.page-num {
  font-size: 14px;
  color: #1989fa;
}

/* 暗黑模式适配 */
:root[data-theme="dark"] {
  .alarm-detail-popup {
    background-color: #1c1c1e;
  }

  .alarm-header {
    border-color: #3a3a3c;
  }

  .header-title {
    color: #fff;
  }

  .table-header {
    background-color: #2c2c2e;
    border-color: #3a3a3c;
  }

  .th {
    color: #fff;
  }

  .table-row {
    border-color: #3a3a3c;
  }

  .td {
    color: #fff;
  }

  .table-footer {
    border-color: #3a3a3c;
  }

  .page-btn {
    color: #fff;
  }

  .page-btn:disabled {
    color: #666;
  }
}

/* 确保弹窗层级正确 */
:deep(.van-popup) {
  position: fixed;
  z-index: 2999 !important;
}

:deep(.van-overlay) {
  position: fixed;
}

/* 添加工单确认弹窗样式 */
.confirm-dialog-popup {
  background-color: #fff;
}

.confirm-dialog {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.confirm-header {
  position: relative;
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #ebedf0;
}

.confirm-content {
  padding: 16px;
}

.confirm-form {
  margin-top: 16px;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #323233;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.button-group {
  display: flex;
  gap: 8px;
}

/* 暗黑模式适配 */
:root[data-theme="dark"] {
  .confirm-dialog-popup {
    background-color: #1c1c1e;
  }

  .confirm-header {
    border-color: #3a3a3c;
  }

  .form-label {
    color: #fff;
  }
}

/* 确保弹窗层级正确 */
:deep(.van-popup) {
  position: fixed;
  z-index: 2999 !important;
}

:deep(.van-overlay) {
  position: fixed;
}
</style>