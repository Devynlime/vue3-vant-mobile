<template>
    <div>
        <el-row :gutter="1">
            <el-col>
                <div :id="domId" style="width: 100%; height: 200px;"></div>

            </el-col>
            <el-col>
                <div class="pie-label">
                    {{ props.title }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import * as echarts from 'echarts';
import { computed, onMounted, reactive, watch } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: '标题'
    },
    values: Array,
    pieId: String
})

const domId = props.pieId;

const data = reactive({
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0
})
watch(() => props.values, (newVal) => {
    // console.log('饼图检测到数据变化', newVal);

    // 同步数据
    data.running = newVal[0];
    data.fault = newVal[1];
    data.maintenance = newVal[2];
    data.construction = newVal[3];
    data.outage = newVal[4];
    data.other = newVal[5];

    // console.log('饼图数据', data,option);
    // 更新饼图
    initChart(option);
})
const option = reactive({
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            type: 'pie',
            color: ['rgb(33, 226, 75)', '#FF0000', 'rgb(217 199 62)', 'rgba(0, 138, 255, 0.45)', 'grey', 'purple'],
            label: {
                show: false //开启显示
            },
            data: [
                { value: computed(()=>data.running), name: '运行' },
                { value: computed(()=>data.fault), name: '告警' },
                { value:computed(()=>data.maintenance) , name: '维护' },
                { value: computed(()=>data.construction), name: '施工' },
                { value: computed(()=>data.outage), name: '停运' },
                { value: computed(()=>data.other), name: '退役' }
            ]
            // data: computed(() => Object.values(data))
        }
    ]
});
const initChart = (option) => {
    var myChart = echarts.init(document.getElementById(domId));
    myChart.setOption(option);
}

onMounted(() => {
    initChart(option);
});

</script>
<style scoped>
.pie-label {
    width: 100%;
    background-color: #3c8b9a;
    color: rgb(255, 255, 255);
    text-align: center;
    font-size: 20px;
    font-weight: 500;
}
</style>