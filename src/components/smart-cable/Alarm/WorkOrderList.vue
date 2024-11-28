<template>
  <div class="work-order-list">
    <van-empty v-if="!workOrderList.length" description="暂无工单" />
    
    <transition-group name="list">
      <div v-for="item in workOrderList" :key="item.id" class="work-order-card">
        <div class="order-header">
          <div class="order-type">
            <van-icon name="warning-o" :color="getTypeColor(item.alarmType)"/>
            <span>{{ getAlertType(item.alarmType) }}</span>
          </div>
          <div class="order-time">{{ item.createTime }}</div>
        </div>
        
        <div class="order-content">
          <div class="content-row">
            <div class="label">
              <van-icon name="warning-o" color="#ee0a24"/>
              <span>告警次数</span>
            </div>
            <div class="value alarm-count" @click="showAlarmListDlg(item)">
              {{ item.amcount }}
            </div>
          </div>

          <div class="content-row">
            <div class="label">
              <van-icon name="info-o" color="#1989fa"/>
              <span>告警信息</span>
            </div>
            <div class="value message">{{ item.message }}</div>
          </div>

          <div class="content-row" v-if="item.maintOrgName">
            <div class="label">
              <van-icon name="shop-o" color="#07c160"/>
              <span>维护单位</span>
            </div>
            <div class="value org">{{ item.maintOrgName }}</div>
          </div>

          <div class="content-row">
            <div class="label">
              <van-icon name="location-o" color="#ff976a"/>
              <span>地址信息</span>
            </div>
            <div class="value location" @click="goParentMapPosition(item)">
              {{ item.position }}
            </div>
          </div>
        </div>

        <div class="order-footer">
          <van-button size="small" type="primary" plain @click="showAlarmListDlg(item)">
            查看告警
          </van-button>
          <van-button size="small" type="primary" @click="goParentMapPosition(item)">
            查看位置
          </van-button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.work-order-list {
  padding: 4px;
}

.work-order-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.work-order-card:last-child {
  margin-bottom: 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f7f8fa;
  border-bottom: 1px solid #ebedf0;
}

.order-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.order-time {
  font-size: 12px;
  color: #969799;
}

.order-content {
  padding: 12px;
}

.content-row {
  display: flex;
  margin-bottom: 8px;
}

.content-row:last-child {
  margin-bottom: 0;
}

.label {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 80px;
  font-size: 13px;
  color: #969799;
}

.value {
  flex: 1;
  font-size: 13px;
  color: #323233;
  word-break: break-all;
}

.alarm-count {
  color: #ee0a24;
  font-weight: 500;
  cursor: pointer;
}

.location {
  color: #1989fa;
  cursor: pointer;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px;
  background: #f7f8fa;
  border-top: 1px solid #ebedf0;
}

/* 动画效果 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .work-order-card {
    background: #2c2c2e;
  }

  .order-header {
    background: #1c1c1e;
    border-color: #3a3a3c;
  }

  .order-type {
    color: #fff;
  }

  .value {
    color: #fff;
  }

  .order-footer {
    background: #1c1c1e;
    border-color: #3a3a3c;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 320px) {
  .order-header {
    padding: 8px;
  }

  .order-content {
    padding: 8px;
  }

  .order-footer {
    padding: 8px;
  }

  .label {
    font-size: 12px;
  }

  .value {
    font-size: 12px;
  }
}

/* 添加空状态样式 */
:deep(.van-empty) {
  padding: 32px 0;
}
</style>

<script setup>
import { getGroupAlarmMessage } from "@/api/alarmMessage"
import { workOrderUpdate } from '@/api/work-order'
import { onMounted, ref, reactive } from "vue";
import { ElMessage } from 'element-plus'

const emit = defineEmits(['AlarmListDlg', 'goMapPosition'])
const workOrderList = ref([])

// 获取告警类型颜色
const getTypeColor = (alarmType) => {
  const typeColors = {
    ambienttemperature: '#ff8917',
    BatteryVoltage: '#ee0a24',
    cablehead: '#2f86f6',
    cablehead_tem: '#ff4d4f',
    manholecover: '#07c160',
    signal4g: '#7232dd',
    smokedetector: '#ff976a',
    waterlevel: '#1989fa',
    waterlevelvalue: '#ff8917'
  }
  const type = deleteNum(alarmType)
  return typeColors[type] || '#969799'
}

// 删除字符串中的数字
const deleteNum = (str) => {
  if (!str) return ''
  return str.replace(/[0-9]+/g, '')
}

// 获取告警类型名称
const getAlertType = (alarmType) => {
  const typeNames = {
    ambienttemperature: '环境温度告警',
    BatteryVoltage: '电池低电压告警',
    cablehead: '电缆震动感告警',
    cablehead_tem: '电缆头温度告警',
    manholecover: '电缆井井盖开启',
    signal4g: '感知设备4G无信号',
    smokedetector: '烟感告警',
    waterlevel: '水浸告警',
    waterlevelvalue: '大气压告警'
  }
  const type = deleteNum(alarmType)
  return typeNames[type] || '告警信息'
}

// 显示告警列表对话框
const showAlarmListDlg = (item) => {
  emit('AlarmListDlg', item)
}

// 跳转到地图位置
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

// 获取工单列表
const getWorkOrderList = () => {
  getGroupAlarmMessage(-3).then(res => {
    console.log("groupAlarmMessage:", res)
    if (res.code === 200) {
      workOrderList.value = res.rows
    }
  })
}

onMounted(() => {
  getWorkOrderList()
})
</script>