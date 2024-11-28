<template>
    <div class="statisticPieChart">
    </div>
</template>

<script setup>
import * as eCharts from "echarts";
import { ref,onMounted } from "vue";
import { alarmTypeGroupCount } from '@/api/alarm-level-config.js'


//{a| 这种表示a样式，而{a}这种有固定的含义，{a}（系列名称），
//{b}（数据项名称），{c}（数值）, {d}（百分比），样式里有条竖杠！记得区分。
const chart = ref(null)
const option = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '3%',
    left: 'center'
  },
  color:['red','yellow','orange','blue'],
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['50%', '90%'],
      center: ['50%', '65%'],
      padAngle: 2,
      itemStyle: {
        borderRadius: 10
      },
     labelLayout:{
       hideOverlap: true
     },
      // adjust the start and end angle
      startAngle: 180,
      endAngle: 360,
      label:{
        show: true,
        fontSize:'1rem',
        position:'inside',
        formatter:'{b}\n{d}%'
      },
      data: [
        { value: 0, name: '非常紧急' },
        { value: 0, name: '紧急' },
        { value: 0, name: '一般' },
        { value: 0, name: '不紧急' }
      ]
    }
  ]
})
const initChart = () => {
    var chartDom = document.querySelector(".statisticPieChart")
    chart.value = eCharts.init(chartDom);
    chart.value.setOption(option.value, true);
}
onMounted(() => {
    initChart()
    console.log("init chart....")
    getAlarmTypeGroupCount('year')
})

const getAlarmTypeGroupCount =(radioRange)=>{
  alarmTypeGroupCount(radioRange).then(res=>{
    console.log("====>",res)
    option.value.series[0].data[0].value = res.data[0]
    option.value.series[0].data[1].value = res.data[2]
    option.value.series[0].data[2].value = res.data[3]
    option.value.series[0].data[3].value = res.data[4]
    if((res.data[0] + res.data[2]+ res.data[3]+ res.data[4]) === 0){
      option.value.series[0].label.formatter = ''
    }else{
      option.value.series[0].label.formatter = '{b}\n{d}%'
    }
    chart.value.setOption(option.value, true);
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