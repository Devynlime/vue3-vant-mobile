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

const activeTab = ref(0)
</script>

<template>
  <div class="mobile-alarm-container">
    <!-- 顶部问候 -->
    <div class="greeting-header">
      <div class="greeting-text">{{ greetingMessge() }}</div>
      <div class="date-text">{{ currentDate() }}</div>
    </div>

    <!-- Tab 导航 -->
    <van-tabs v-model:active="activeTab" sticky animated swipeable>
      <!-- 概览 Tab -->
      <van-tab title="告警概览">
        <div class="tab-content">
          <div class="alarm-overview-grid">
            <SensorTypeStatistic />
          </div>
          
          <div class="section-card">
            <div class="section-header">
              <van-radio-group v-model="radioRange" direction="horizontal" @change="changeRange">
                <van-radio name="month">本月</van-radio>
                <van-radio name="year">本年</van-radio>
              </van-radio-group>
            </div>
            <AlarmTypeStatistic ref="refAlarmTypeStatistic" />
          </div>
        </div>
      </van-tab>

      <!-- 工单 Tab -->
      <van-tab title="工单管理">
        <div class="tab-content">
          <div class="section-card">
            <WorkOrderList 
              @AlarmListDlg="showAlarmList" 
              @goMapPosition="goMapPosition" 
            />
          </div>
        </div>
      </van-tab>

      <!-- 设备 Tab -->
      <van-tab title="设备状态">
        <div class="tab-content">
          <DeviceSensorInfo />
        </div>
      </van-tab>

      <!-- 设置 Tab -->
      <van-tab title="告警设置">
        <div class="tab-content">
          <AlarmConfigPanel />
          <div class="section-card">
            <div class="section-header">
              <div class="header-left">
                <van-icon name="clock-o" size="20" />
                <span>历史告警</span>
              </div>
            </div>
            <historyAlarmDataPanel />
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 告警详情弹窗 -->
    <AlarmListDlg 
      ref="refAlarmListDlg" 
      @closeAlarmListDlg="closeAlarmList" 
      :showDlg="showAlarmListDlg" 
    />
  </div>
</template>

<style scoped>
.mobile-alarm-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  color: #323233;
}

.greeting-header {
  padding: 16px 16px 0;
}

.greeting-text {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
}

.date-text {
  font-size: 14px;
  color: #969799;
  margin-top: 4px;
}

.tab-content {
  padding: 16px;
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

:deep(.van-tabs__wrap) {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
}

:deep(.van-tabs__content) {
  background: #f7f8fa;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .mobile-alarm-container {
    background-color: #1c1c1e;
    color: #f5f5f5;
  }

  .greeting-text {
    color: #f5f5f5;
  }

  .date-text {
    color: #969799;
  }

  .alarm-overview-grid,
  .section-card {
    background: #2c2c2e;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }

  .header-left {
    color: #f5f5f5;
  }

  :deep(.van-tabs__wrap) {
    background: #1c1c1e;
  }
  
  :deep(.van-tabs__content) {
    background: #1c1c1e;
  }

  :deep(.van-tab) {
    color: #f5f5f5;
  }

  :deep(.van-tab--active) {
    color: var(--van-primary-color);
  }

  :deep(.van-tabs__line) {
    background-color: var(--van-primary-color);
  }

  :deep(.van-radio__label) {
    color: #f5f5f5;
  }

  :deep(.van-radio__icon) {
    border-color: #606060;
  }

  :deep(.van-radio__icon--checked) {
    border-color: var(--van-primary-color);
    background-color: var(--van-primary-color);
  }
}

/* 调整工单Tab的样式 */
.tab-content .section-card:only-child {
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0;
  box-shadow: none;
}

/* 优化Tab样式 */
:deep(.van-tabs__wrap) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

:deep(.van-tab) {
  padding: 12px 0;
  font-size: 14px;
}

:deep(.van-tab--active) {
  font-weight: 600;
}
</style>
<route lang="json">
    {
        "name":"cableAlarm",
        "meta":{
            "title":"在线监测"
        }
    }
</route>