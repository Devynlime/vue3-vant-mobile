<script setup>
import * as eCharts from 'echarts'
import EchartMap from '@/components/smart-cable/dev-overview/EchartMap.vue'
import { transformerSubstationIcon } from '@/components/icon'
import { onMounted, ref } from 'vue'
import { cableStatistic, channelStatistic, feederLineStatistic, substationStatistic } from '@/api/device-overview'
import { mockLogin } from '@/utils/cable-v2/tokenHandler'

const props = defineProps({
  display: String,
})

const substationStatisticData = ref(null)
const feederLineStatisticData = ref(null)
const cableStatisticData = ref(null)
const channelStatisticData = ref(null)
onMounted(() => {
  mockLogin() // 手动模拟admin登录
  substationStatistic().then((res) => {
    substationStatisticData.value = res.data
    console.log('substationStatisticData:', res.data)
  })
  feederLineStatistic().then((res) => {
    feederLineStatisticData.value = res.data
    console.log('feederLineStatisticData:', res.data)
    option_line.value.series[0].data[0].value = feederLineStatisticData?.value.erectionMethod[3].total
    option_line.value.series[0].data[1].value = feederLineStatisticData?.value.erectionMethod[2].total
    option_line.value.series[0].data[2].value = feederLineStatisticData?.value.erectionMethod[0].total
    console.log('option_line:', option_line.value)
    chart_line.value.setOption(option_line.value, true)
  })
  cableStatistic().then((res) => {
    cableStatisticData.value = res.data
    option_cable.value.series[0].data[0].value = cableStatisticData?.value.cableSectionCount
    option_cable.value.series[0].data[1].value = cableStatisticData?.value.cableJointCount
    option_cable.value.series[0].data[2].value = cableStatisticData?.value.cableTerminationCount
    chart_cable.value.setOption(option_cable.value, true)
    console.log('cableStatisticData:', res.data)
  })
  channelStatistic().then((res) => {
    channelStatisticData.value = res.data
    option_channel.value.series[0].data[0].value = channelStatisticData?.value.cablePipeSectionLength / 1000
    option_channel.value.series[0].data[1].value = channelStatisticData?.value.cableTunnelSectionLength / 1000
    option_channel.value.series[0].data[2].value = channelStatisticData?.value.utilityTunnelLength / 1000
    chart_channel.value.setOption(option_channel.value, true)
    console.log('channelStatisticData:', res.data)
  })
})

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
  },
  legend: {
    top: '3%',
  },
  series: [
    {
      name: '电缆',
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
        formatter: '{b}\n{c}KM\n{d}%',
      },
      data: [
        { value: 0, name: '排管' },
        { value: 0, name: '隧道' },
        { value: 0, name: '管廊' },
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
    { total: undefined, title: '在运', color: '#32CD32' },
    { total: undefined, title: '未投运', color: '#1E90FF' },
    { total: undefined, title: '退役', color: '#A52A2A' },
  ],
  cableSectionState: [
    { total: undefined, title: '在运', color: '#32CD32' },
    { total: undefined, title: '未投运', color: '#1E90FF' },
    { total: undefined, title: '退役', color: '#A52A2A' },
  ],
  cableJointStateCount: [
    { total: undefined, title: '在运', color: '#32CD32' },
    { total: undefined, title: '未投运', color: '#1E90FF' },
    { total: undefined, title: '退役', color: '#A52A2A' },
  ],
  cableTerminationStateCount: [
    { total: undefined, title: '在运', color: '#32CD32' },
    { total: undefined, title: '未投运', color: '#1E90FF' },
    { total: undefined, title: '退役', color: '#A52A2A' },
  ],
})
const cableStatisticItems = ref([
  { label: '电缆', states: cableItemStatisticData.value?.cableStateCount },
  { label: '电缆段', states: cableItemStatisticData.value?.cableSectionState },
  { label: '中间接头', states: cableItemStatisticData.value?.cableJointStateCount },
  { label: '电缆终端', states: cableItemStatisticData.value?.cableTerminationStateCount },
])
</script>

<template>
  <div class="do-page-main">
    <div style="height:100%;display: flex;flex-direction: row;">
      <div v-if="props.display === 'left'" class="left-list">
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
      <div v-if="props.display === 'center'" class="center-list">
        <div class="transparent-content">
          <EchartMap />
        </div>
      </div>
      <div v-if="props.display === 'right'" class="right-list">
        <div class="transparent-content">
          <div class="list-content">
            <div class="statisticPieChart_cable" />

            <div style="display:flex;flex-direction: row;margin-bottom: 10px;justify-content: center;">
              <div
                style="background-color: #32CD32;padding:1px 10px;border-radius: 4px;margin-right: 10px;color:white"
              >
                在运
              </div>
              <div
                style="background-color: #1E90FF;padding:1px 10px;border-radius: 4px;margin-right: 10px;color:white"
              >
                未投运
              </div>
              <div
                style="background-color: #A52A2A;padding:1px 10px;border-radius: 4px;margin-right: 10px;color:white"
              >
                退役
              </div>
            </div>
            <div>
              <div
                v-for="(item, index) in cableStatisticItems" :key="index"
                style="border:1px solid lightgray;display:flex;flex-direction: row;border-radius: 5px;margin-top:4px;"
              >
                <div class="label-box">
                  {{ item.label }}
                </div>
                <div style="display:flex;flex-direction: row;width:100%">
                  <div
                    v-for="(state, stateIndex) in item.states" :key="stateIndex"
                    :title="state.title" :style="{
                      width: stateIndex === 0 ? '40%' : '30%',
                      backgroundColor: state.color,
                      textAlign: 'center',
                      color: 'white',
                      borderTopLeftRadius: stateIndex === 0 ? '5px' : '0',
                      borderBottomLeftRadius: stateIndex === 0 ? '5px' : '0',
                      borderTopRightRadius: stateIndex === item.states.length - 1 ? '5px' : '0',
                      borderBottomRightRadius: stateIndex === item.states.length - 1 ? '5px' : '0',
                    }"
                  >
                    {{ state.total }}
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
  height: 320px;
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
  /* background-color: #ececec; */
  /* padding: 8px; */
  height: 100%;
  width: 100vw;
}

.right-list {
  width: 100vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.left-list {
  width: 100vw;
  margin-right: 4px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.center-list {
  /* margin-right: 4px; */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.list-content {
  background-color: #fff;
  border-radius: 4px;
  align-self: stretch;
  overflow: hidden;
  border: 1px solid #ccc;
  padding: 5px 10px 5px 10px;
  margin-bottom: 2px;
  width: 100%;
  /* height: max-content; */
}

.list-content:first-child {
  min-height: 308px;
}

.transparent-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  width: 100vw;
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
</style>
