<script setup>
import * as eCharts from 'echarts'
import EchartMap from '@/components/smart-cable/dev-overview/EchartMap.vue'
import { transformerSubstationIcon } from '@/components/icon'
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { cableStatistic, channelStatistic, feederLineStatistic, substationStatistic } from '@/api/device-overview'
import { mockLogin } from '@/utils/cable-v2/tokenHandler'

const props = defineProps({
  display: String,
})

const substationStatisticData = ref(null)
const feederLineStatisticData = ref(null)
const cableStatisticData = ref(null)
const channelStatisticData = ref(null)
onMounted(async () => {
  try {    
    const [substationData, feederData, cableData, channelData] = await Promise.all([
      substationStatistic(),
      feederLineStatistic(),
      cableStatistic(), 
      channelStatistic()
    ])

    // 安全地设置数据
    substationStatisticData.value = substationData.data
    feederLineStatisticData.value = feederData.data
    cableStatisticData.value = cableData.data
    channelStatisticData.value = channelData.data

    // 更新电缆统计数据
    if (cableStatisticData.value) {
      // 更新电缆状态统计
      cableItemStatisticData.value.cableStateCount = cableStatisticData.value.state.map(item => ({
        total: item.total,
        title: item.psrStateName,
        color: getStateColor(item.psrStateName)
      }))

      // 更新电缆段状态统计
      cableItemStatisticData.value.cableSectionState = Object.entries(cableStatisticData.value.cableSectionStateObj).map(([key, value]) => ({
        total: value,
        title: key,
        color: getStateColor(key)
      }))

      // 更新中间接头状态统计
      cableItemStatisticData.value.cableJointStateCount = Object.entries(cableStatisticData.value.cableJointStateCountObj).map(([key, value]) => ({
        total: value,
        title: key,
        color: getStateColor(key)
      }))

      // 更新电缆终端状态统计
      cableItemStatisticData.value.cableTerminationStateCount = Object.entries(cableStatisticData.value.cableTerminationStateCountObj).map(([key, value]) => ({
        total: value,
        title: key,
        color: getStateColor(key)
      }))
    }

    // 更新配网线路饼图数据
    if (chart_line.value && feederLineStatisticData.value) {
      option_line.value.series[0].data = [
        { 
            value: feederLineStatisticData.value.erection.混合 || 0, 
            name: '混合线路'
          },
          { 
            value: feederLineStatisticData.value.erection.电缆 || 0, 
            name: '电缆线路'
          },
          { 
            value: feederLineStatisticData.value.erection.架空 || 0, 
            name: '架空线路'
          }
        ]
      chart_line.value.setOption(option_line.value, true)
    }

    // 根据display属性初始化相应的图表
    if (props.display === 'right') {
      initChart_cable()
      initChart_channel()
      
      // 安全地更新cable图表数据
      if (chart_cable.value && cableStatisticData.value) {
        option_cable.value.series[0].data[0].value = cableStatisticData.value.cableSectionCount || 0
        option_cable.value.series[0].data[1].value = cableStatisticData.value.cableJointCount || 0
        option_cable.value.series[0].data[2].value = cableStatisticData.value.cableTerminationCount || 0
        chart_cable.value.setOption(option_cable.value, true)
      }
      
      // channel图表的数据更新将由watch处理
    }
  } catch (error) {
    console.error('Error:', error)
  }
})

// 添加一个辅助函数来获取状态对应的颜色
function getStateColor(state) {
  switch (state) {
    case '在运':
      return '#32CD32'
    case '未投运':
      return '#1E90FF'
    case '退役':
      return '#A52A2A'
    case '现场留用':
      return '#FFA500'  // 橙色
    default:
      return '#808080'  // 灰色作为默认颜色
  }
}

// 配网线路总条数,混合线路条数,电缆线路条数,架空线路条数
const chart_line = ref(null)
const option_line = ref({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '3%',
    left: 'center',
  },
  color: ['#f53c8d', '#f8b729', '#22b3ff'],
  series: [
    {
      name: '配网线路',
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        fontSize: '20px',
        fontWeight: 'bolder',
        position: 'inside',
        formatter: '{b}\n{c}\n{d}%',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          position: 'inside',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 0, name: '混合线路' },
        { value: 0, name: '电缆线路' },
        { value: 0, name: '架空线路' },
      ],
    },
  ],
})

function initChart_line() {
  const chartDom = document.querySelector('.statisticPieChart_line')
  chart_line.value = eCharts.init(chartDom)
  chart_line.value.setOption(option_line.value, true)
}

// 电缆总长度,电缆段条数,电缆中间接头数量,终端头数量
const chart_cable = ref(null)
const option_cable = ref({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '3%',
  },
  series: [
    {
      name: '电缆',
      type: 'pie',
      center: ['50%', '55%'],
      radius: '60%',
      itemStyle: {
        borderRadius: 5,
      },
      label: {
        show: true,
        fontSize: '20px',
        fontWeight: 'bolder',
        position: 'inside',
        formatter: '{b}\n{c}\n{d}%',
      },
      data: [
        { value: 0, name: '电缆段' },
        { value: 0, name: '电缆中间接头' },
        { value: 0, name: '终端头' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})
function initChart_cable() {
  const chartDom = document.querySelector('.statisticPieChart_cable')
  chart_cable.value = eCharts.init(chartDom)
  chart_cable.value.setOption(option_cable.value, true)
}
// 电缆通道条数，长度,排管长度,隧道长度,管廊长度,电缆井数量
const chart_channel = ref(null)
const option_channel = ref({
  tooltip: {
    trigger: 'item',
    formatter: function(params) {
      return `${params.name}: ${params.value}KM (${params.percent}%)`
    }
  },
  legend: {
    top: '3%',
    formatter: '{name}'
  },
  series: [
    {
      name: '电缆通道',
      type: 'pie',
      center: ['50%', '55%'],
      radius: ['30%', '70%'],
      itemStyle: {
        borderRadius: 5,
      },
      label: {
        show: true,
        fontSize: '20px',
        fontWeight: 'bolder',
        position: 'inside',
        formatter: function(params) {
          return `${params.name}\n${params.value}KM\n${params.percent}%`
        }
      },
      data: [], // 初始化为空数组
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})
function initChart_channel() {
  const chartDom = document.querySelector('.statisticPieChart_channel')
  chart_channel.value = eCharts.init(chartDom)
  chart_channel.value.setOption(option_channel.value, true)
}

onMounted(() => {
  setTimeout(() => {
    switch (props.display) {
      case 'left':
        initChart_line()
        break
      case 'center':
        break
      case 'right':
        initChart_cable()
        initChart_channel()
        break
    }
  }, 10)
})

// 动态生成统计组件数据
const cableItemStatisticData = ref({
  cableStateCount: [
    { total: 0, title: '在运', color: '#32CD32' },
    { total: 0, title: '未投运', color: '#1E90FF' },
    { total: 0, title: '退役', color: '#A52A2A' },
  ],
  cableSectionState: [
    { total: 0, title: '在运', color: '#32CD32' },
    { total: 0, title: '未投运', color: '#1E90FF' },
    { total: 0, title: '退役', color: '#A52A2A' },
  ],
  cableJointStateCount: [
    { total: 0, title: '在运', color: '#32CD32' },
    { total: 0, title: '未投运', color: '#1E90FF' },
    { total: 0, title: '退役', color: '#A52A2A' },
  ],
  cableTerminationStateCount: [
    { total: 0, title: '在运', color: '#32CD32' },
    { total: 0, title: '未投运', color: '#1E90FF' },
    { total: 0, title: '退役', color: '#A52A2A' },
  ],
})
const cableStatisticItems = computed(() => [
  { label: '电缆', states: cableItemStatisticData.value.cableStateCount },
  { label: '电缆段', states: cableItemStatisticData.value.cableSectionState },
  { label: '中间接头', states: cableItemStatisticData.value.cableJointStateCount },
  { label: '电缆终端', states: cableItemStatisticData.value.cableTerminationStateCount },
])

// 添加排序功能的 computed 属性
const sortedCableStatisticItems = computed(() => {
  return cableStatisticItems.value.map(item => {
    // 对每个设备的状态数组进行排序
    const sortedStates = [...item.states].sort((a, b) => b.total - a.total)
    return {
      ...item,
      states: sortedStates
    }
  })
})

// 修改 channelChartData computed 属性
const channelChartData = computed(() => {
  if (!channelStatisticData.value) return []
  
  return [
    { 
      value: parseFloat((channelStatisticData.value.cablePipeSectionLength / 1000).toFixed(2)),
      name: '排管'
    },
    { 
      value: parseFloat((channelStatisticData.value.cableTunnelSectionLength / 1000).toFixed(2)),
      name: '隧道'
    },
    { 
      value: parseFloat((channelStatisticData.value.utilityTunnelLength / 1000).toFixed(2)),
      name: '管廊'
    }
  ]
})

// 修改 watch 部分
watch(channelChartData, (newData) => {
  if (chart_channel.value && newData.length > 0) {
    // 直接设置新的配置
    chart_channel.value.setOption({
      series: [{
        ...option_channel.value.series[0], // 保持其他配置不变
        data: newData
      }]
    })
  }
}, { deep: true, immediate: true })

// 修改 getTooltipText 计算属性
const getTooltipText = computed(() => (label, state) => {
  let text = []
  text.push(`<div class="tooltip-title">${label}统计信息</div>`)
  text.push(`<div class="tooltip-content">`)
  text.push(`<div class="tooltip-item"><span class="label">状态:</span><span class="value" style="color:${state.color}">${state.title}</span></div>`)
  text.push(`<div class="tooltip-item"><span class="label">数量:</span><span class="value">${state.total}</span></div>`)
  
  // 根据不同类型添加额外信息
  switch(label) {
    case '电缆':
      if (cableStatisticData.value?.cableLength) {
        text.push(`<div class="tooltip-item"><span class="label">总长度:</span><span class="value">${(cableStatisticData.value.cableLength / 1000).toFixed(2)}KM</span></div>`)
      }
      break
    case '电缆段':
      if (cableStatisticData.value?.cableSectionCount) {
        text.push(`<div class="tooltip-item"><span class="label">总数量:</span><span class="value">${cableStatisticData.value.cableSectionCount}</span></div>`)
      }
      break
    case '中间接头':
      if (cableStatisticData.value?.cableJointCount) {
        text.push(`<div class="tooltip-item"><span class="label">总数量:</span><span class="value">${cableStatisticData.value.cableJointCount}</span></div>`)
      }
      break
    case '电缆终端':
      if (cableStatisticData.value?.cableTerminationCount) {
        text.push(`<div class="tooltip-item"><span class="label">总数量:</span><span class="value">${cableStatisticData.value.cableTerminationCount}</span></div>`)
      }
      break
  }
  text.push(`</div>`)
  
  return text.join('')
})
</script>

<template>
  <div class="do-page-main">
    <div class="content-container">
      <div v-if="props.display === 'left'" class="side-panel left-panel">
        <div class="transparent-content">
          <div class="list-content" style="padding-top:15px;">
            <div
              style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;"
            >
              <transformerSubstationIcon
                iconwidth="36px" iconheight="36px" iconcolor="#fff"
                style="margin-top:2px;margin-left:4px;"
              />
              <div
                style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;"
              >
                <div style="color:#fff;margin-left:8px;font-size: 1rem;">
                  220KV变电站<span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.voltageLevel[1].tital }}</span>座,容量 <span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.voltageLevel[1].stationCapacity }} </span> MVA
                </div>
              </div>
            </div>

            <div
              style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;margin-top:6px;"
            >
              <transformerSubstationIcon
                iconwidth="36px" iconheight="36px" iconcolor="#fff"
                style="margin-top:2px;margin-left:4px;"
              />
              <div
                style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;"
              >
                <div style="color:#fff;margin-left:8px;font-size: 1rem;">
                  110KV变电站<span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.voltageLevel[0].tital }}</span>座,容量 <span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.voltageLevel[0].stationCapacity }} </span> MVA
                </div>
              </div>
            </div>

            <div
              style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;margin-top:6px;"
            >
              <transformerSubstationIcon
                iconwidth="36px" iconheight="36px" iconcolor="#fff"
                style="margin-top:2px;margin-left:4px;"
              />
              <div
                style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;"
              >
                <div style="color:#fff;margin-left:8px;font-size: 1rem;">
                  35KV变电站<span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.voltageLevel[2].tital }}</span>座,容量 <span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.voltageLevel[2].stationCapacity }}</span> MVA
                </div>
              </div>
            </div>

            <div
              style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;margin-top:6px;"
            >
              <transformerSubstationIcon
                iconwidth="36px" iconheight="36px" iconcolor="#fff"
                style="margin-top:2px;margin-left:4px;"
              />
              <div
                style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;"
              >
                <div style="color:#fff;margin-left:8px;font-size: 1rem;">
                  合计变电站<span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.total.total }}</span>座,容量 <span
                    style="font-size: 1.2rem;font-weight: bolder;"
                  >{{
                    substationStatisticData?.total.stationCapacity }} </span> MVA
                </div>
              </div>
            </div>
            <div style="display: flex;flex-direction: row;justify-content:space-around;margin-top:20px;">
              <div class="statistic-box">
                <div>{{ substationStatisticData?.state[1].total }}</div>
                <div style="background-color:#32CD32;font-weight: bolder;">
                  在运
                </div>
              </div>
              <div class="statistic-box">
                <div>{{ substationStatisticData?.state[2].total }}</div>
                <div style="background-color: #1E90FF;font-weight: bolder;">
                  未投运
                </div>
              </div>
              <div class="statistic-box">
                <div>{{ substationStatisticData?.state[0].total }}</div>
                <div style="background-color: darkred;font-weight: bolder;">
                  退役
                </div>
              </div>
            </div>
          </div>
          <div class="list-content content-top">
            <div class="statisticPieChart_line" />
            <div style="display: flex;flex-direction: row;justify-content:space-around;margin-top:10px;">
              <div class="statistic-box">
                <div>{{ feederLineStatisticData?.state[0].total }}</div>
                <div style="background-color:#32CD32;font-weight: bolder;">
                  在运
                </div>
              </div>
              <div class="statistic-box">
                <div>{{ feederLineStatisticData?.state[2].total }}</div>
                <div style="background-color: #1E90FF;font-weight: bolder;">
                  未投运
                </div>
              </div>
              <div class="statistic-box">
                <div>{{ feederLineStatisticData?.state[1].total }}</div>
                <div style="background-color: darkred;font-weight: bolder;">
                  退役
                </div>
              </div>
            </div>
            <div style="display: flex;flex-direction: row;justify-content:space-around;margin-top:20px;">
              <div class="statistic-box">
                <div>{{ feederLineStatisticData?.state[3].total }}</div>
                <div style="background-color: darkred;font-weight: bolder;">
                  现场留用
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="props.display === 'center'" class="center-panel">
        <div class="transparent-content">
          <EchartMap />
        </div>
      </div>
      <div v-if="props.display === 'right'" class="side-panel right-panel">
        <div class="transparent-content">
          <div class="list-content">
            <div class="statisticPieChart_cable" />

            <div class="status-legend">
              <div class="legend-item running">在运</div>
              <div class="legend-item pending">未投运</div>
              <div class="legend-item retired">退役</div>
              <div class="legend-item onsite">现场留用</div>
            </div>

            <div class="statistics-list">
              <div
                v-for="(item, index) in sortedCableStatisticItems"
                :key="index"
                class="statistic-item"
              >
                <div class="item-label">{{ item.label }}</div>
                <div class="item-states">
                  <div
                    v-for="(state, stateIndex) in item.states"
                    :key="stateIndex"
                    :data-tooltip="getTooltipText(item.label, state)"
                    class="state-box"
                    :class="[`state-${state.title}`]"
                    :style="{
                      width: stateIndex === 0 ? '40%' : '30%',
                    }"
                  >
                    {{ state.total || 0 }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="list-content content-top">
            <div class="statisticPieChart_channel" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistic-box {
  background-color: #3c8b9a;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 100px;
}

.statistic-box div:first-child {
  /* padding: 6px 20px; */
  text-align: center;
  flex-grow: 1;
  font-weight: bolder;
  font-size: 1.4rem;
  color: white;
}

.statistic-box div:last-child {
  background-color: #477887;
  color: white;
  padding: 2px 10px;
  font-size: 1.1rem;
  text-align: center;
}

.statisticPieChart_line {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  width: 100%;
  height: 280px;
}

.statisticPieChart_cable {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  width: 100%;
  min-height: 280px;
}

.statisticPieChart_channel {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  width: 100%;
  /* flex: 1; */
  /* min-height: 300px; */
  height: 100%;
}

.do-page-main {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.content-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.side-panel {
  width: 400px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.transparent-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  width: 100%;
  padding: 10px;
  margin-bottom: 2px;
  height: 100%;
}

.content-top {
  margin-top: 10px;
  flex-grow: 1;
}

.label-box {
  margin-left: 2px;
  margin-right: 2px;
  width: 75px;
}

.state-box {
  text-align: center;
  color: white;
  cursor: help;
  transition: all 0.3s ease;
  padding: 4px 0;
}

.state-box:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

/* 添加自定义tooltip样式 */
.state-box[title] {
  position: relative;
}

.state-box[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-line;
  z-index: 1000;
}

.status-legend {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  flex-wrap: wrap;
}

.legend-item {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: default;
  min-width: 70px;
  text-align: center;
}

.legend-item.running { background-color: #32CD32; }
.legend-item.pending { background-color: #1E90FF; }
.legend-item.retired { background-color: #A52A2A; }
.legend-item.onsite { background-color: #FFA500; }

/* 统计列表样式 */
.statistics-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.statistic-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 20px;
}

.item-label {
  width: 65px;
  padding: 2px 6px;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.2);
  font-size: 12px;
  display: flex;
  align-items: center;
}

.item-states {
  display: flex;
  flex: 1;
  height: 100%;
}

.state-box {
  text-align: center;
  color: white;
  padding: 2px 1px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-box:hover {
  filter: brightness(1.1);
}

.state-在运 { background-color: #32CD32; }
.state-未投运 { background-color: #1E90FF; }
.state-退役 { background-color: #A52A2A; }
.state-现场留用 { background-color: #FFA500; }

/* 自定义tooltip样式 */
.state-box[data-tooltip]:hover::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 0;
  background: rgba(24, 36, 51, 0.95);
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: normal;
  white-space: normal;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  min-width: 220px;
}

/* 添加新的 tooltip 内部样式 */
:deep(.tooltip-title) {
  padding: 6px 10px;
  font-size: 12px;
}

:deep(.tooltip-content) {
  padding: 6px 10px;
}

:deep(.tooltip-item) {
  padding: 3px 0;
  font-size: 12px;
}

/* 修改箭头样式 */
.state-box[data-tooltip]:hover::after {
  content: '';
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: rgba(24, 36, 51, 0.95);
  z-index: 1000;
}

/* 修改图例样式使其更紧凑 */
.status-legend {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 10px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  flex-wrap: wrap;
}

.legend-item {
  padding: 2px 6px;
  border-radius: 3px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: default;
  min-width: 60px;
  text-align: center;
}
</style>
<route lang="json">
    {
        "name":"deviceOverview",
        "meta":{
            "title":"电缆井设备概况"
        }
}
</route>
