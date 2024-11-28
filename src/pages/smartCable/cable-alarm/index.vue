<script setup>

import AlarmTypeStatistic from '@/components/smart-cable/Alarm/AlarmTypeStatistic.vue'
import AlarmConfigPanel from '@/components/smart-cable/Alarm/AlarmConfigPanel.vue'
import AlarmListDlg from '@/components/smart-cable/Alarm/AlarmListDlg.vue'
import historyAlarmDataPanel from '@/components/smart-cable/Alarm/historyAlarmDataPanel.vue'
import SensorTypeStatistic from '@/components/smart-cable/Alarm/SensorTypeStatistic.vue'
import WorkOrderList from '@/components/smart-cable/Alarm/WorkOrderList.vue'
import DeviceSensorInfo from '@/components/smart-cable/Alarm/DeviceSensorInfo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();

const radioRange = ref('year')

const showAlarmListDlg = ref(false)
const closeAlarmList = () => {
  showAlarmListDlg.value = false
}

const refAlarmListDlg = ref(null)
const showAlarmList = (item) => {
  //console.log("item:",item)F
  //showAlarmListDlg.value = true
  refAlarmListDlg.value.show(item)
}


const refMainMap = ref(null)
const goMapPosition = (data) => {
  console.log("goMapPosition:", data)
  refMainMap.value.flytoPosition(data)
}

const goWorkOrderList = () => {
  router.push({
    name: "WorkOrderSearch",
    params: { id: "2-4" }
  })
}

const refAlarmTypeStatistic = ref(null)
const changeRange = (val) => {
  radioRange.value = val
  refAlarmTypeStatistic.value.getAlarmTypeGroupCount(val)
}

const greetingMessge = () => {
  const hour = new Date().getHours()
  const greetings = {
    6: '早上好！',
    12: '中午好！', 
    14: '下午好！',
    18: '晚上好！',
    22: '已经是深夜了！'
  }
  
  return Object.entries(greetings).find(([h]) => hour < h)?.[1] || '已经是深夜了！'
}

const currentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // months are 0-based
  const day = date.getDate();

  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  return year + "年" + (month < 10 ? "0" + month : month) + "月" + (day < 10 ? "0" + day : day) + "日 " + weekdays[date.getDay()]
}
</script>

<template>
  <div class="mobile-alarm-page">
    <!-- 顶部问候 -->
    <div class="greeting-section">
      <div class="greeting-text">{{ greetingMessge() }}</div>
      <div class="date-text">{{ currentDate() }}</div>
    </div>

    <!-- 告警概览统计 - 使用卡片网格布局 -->
    <div class="alarm-overview-grid">
      <SensorTypeStatistic />
    </div>

    <!-- 最新工单 -->
    <div class="section-card">
      <div class="section-header">
        <div class="header-left">
          <van-icon name="orders-o" size="20" />
          <span>最新工单</span>
        </div>
        <van-button type="primary" size="small" @click="goWorkOrderList">查看更多</van-button>
      </div>
      <WorkOrderList @AlarmListDlg="showAlarmList" @goMapPosition="goMapPosition" />
    </div>

    <!-- 告警统计 -->
    <div class="section-card">
      <div class="section-header">
        <div class="header-left">
          <van-icon name="chart-trending-o" size="20" />
          <span>告警统计</span>
        </div>
        <van-radio-group v-model="radioRange" direction="horizontal" @change="changeRange">
          <van-radio name="month">本月</van-radio>
          <van-radio name="year">本年</van-radio>
        </van-radio-group>
      </div>
      <AlarmTypeStatistic ref="refAlarmTypeStatistic" />
    </div>

    <!-- 设备状态 -->
    <div class="section-card">
      <div class="section-header">
        <div class="header-left">
          <van-icon name="cluster-o" size="20" />
          <span>设备状态</span>
        </div>
      </div>
      <DeviceSensorInfo />
    </div>

    <!-- 告警设置 -->
    <div class="section-card">
      <div class="section-header">
        <div class="header-left">
          <van-icon name="setting-o" size="20" />
          <span>告警设置</span>
        </div>
      </div>
      <AlarmConfigPanel />
    </div>

    <!-- 历史告警 -->
    <div class="section-card">
      <div class="section-header">
        <div class="header-left">
          <van-icon name="clock-o" size="20" />
          <span>历史告警</span>
        </div>
      </div>
      <historyAlarmDataPanel />
    </div>

    <!-- 告警详情弹窗 -->
    <AlarmListDlg 
      ref="refAlarmListDlg" 
      @closeAlarmListDlg="closeAlarmList" 
      :showDlg="showAlarmListDlg" 
    />
  </div>
</template>

<style scoped>
.mobile-alarm-page {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding: 16px;
}

.greeting-section {
  margin-bottom: 20px;
  color: #323233;
}

.greeting-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.date-text {
  font-size: 14px;
  color: #969799;
}

.alarm-overview-grid {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.section-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

:deep(.van-radio-group) {
  display: flex;
  gap: 16px;
}

:deep(.van-radio) {
  margin: 0;
}

:deep(.van-button--small) {
  padding: 0 16px;
  height: 32px;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .mobile-alarm-page {
    background-color: #1c1c1e;
  }

  .section-card {
    background: #2c2c2e;
  }

  .greeting-text {
    color: #fff;
  }

  .header-left {
    color: #fff;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 320px) {
  .mobile-alarm-page {
    padding: 12px;
  }

  .greeting-text {
    font-size: 20px;
  }

  .section-card {
    padding: 12px;
  }
}
</style>
