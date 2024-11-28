<template>
    <div class="statisticPieChart"></div>
</template>

<script setup>
import * as eCharts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";
import { alarmTypeGroupCount } from '@/api/alarm-level-config.js'

const chart = ref(null)
const chartData = ref([
  { value: 0, name: '非常紧急' },
  { value: 0, name: '紧急' },
  { value: 0, name: '一般' },
  { value: 0, name: '不紧急' }
])

const getChartOption = (isDarkMode = false) => {
  const textColor = isDarkMode ? '#f5f5f5' : '#323233';
  const legendTextColor = isDarkMode ? '#969799' : '#646566';
  
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: isDarkMode ? '#2c2c2e' : '#fff',
      borderColor: isDarkMode ? '#3a3a3c' : '#ebedf0',
      textStyle: {
        color: textColor
      }
    },
    legend: {
      top: '3%',
      left: 'center',
      textStyle: {
        color: legendTextColor,
        fontSize: 12
      }
    },
    color: ['#ff4444', '#ffbb33', '#ff8800', '#2196f3'],
    series: [
      {
        name: '告警统计',
        type: 'pie',
        radius: ['50%', '90%'],
        center: ['50%', '65%'],
        padAngle: 2,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDarkMode ? '#1c1c1e' : '#fff',
          borderWidth: 2
        },
        labelLayout: {
          hideOverlap: true
        },
        startAngle: 180,
        endAngle: 360,
        label: {
          show: true,
          fontSize: '14px',
          position: 'inside',
          formatter: '{b}\n{d}%',
          color: textColor
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16px',
            fontWeight: 'bold',
            color: textColor
          }
        },
        data: chartData.value
      }
    ]
  }
}

const initChart = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const chartDom = document.querySelector(".statisticPieChart");
  
  if (!chart.value) {
    chart.value = eCharts.init(chartDom);
  }
  
  chart.value.setOption(getChartOption(isDarkMode), true);
}

const updateChart = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (chart.value) {
    chart.value.setOption(getChartOption(isDarkMode), true);
  }
}

onMounted(() => {
  initChart();
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', updateChart);
  
  getAlarmTypeGroupCount('year');
  
  onUnmounted(() => {
    darkModeMediaQuery.removeEventListener('change', updateChart);
    if (chart.value) {
      chart.value.dispose();
      chart.value = null;
    }
  });
})

const getAlarmTypeGroupCount = (radioRange) => {
  alarmTypeGroupCount(radioRange).then(res => {
    chartData.value[0].value = res.data[0];
    chartData.value[1].value = res.data[2];
    chartData.value[2].value = res.data[3];
    chartData.value[3].value = res.data[4];
    
    const hasData = chartData.value.some(item => item.value > 0);
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const option = getChartOption(isDarkMode);
    
    if (!hasData) {
      option.series[0].label.formatter = '';
    }
    
    chart.value.setOption(option, true);
  })
}

defineExpose({ getAlarmTypeGroupCount })
</script>

<style scoped>
.statisticPieChart {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    width: 100%;
    height: 300px;
}
</style>