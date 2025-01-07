<template>
    <div class="pie-chart-container">
        <div class="card-header">
            <div class="title-box">{{ props.title }}</div>
        </div>
        <div :id="domId" class="chart-content" ref="chartRef"></div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { computed, onMounted, reactive, watch, ref, onUnmounted, nextTick } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: '标题'
    },
    values: Array,
    pieId: String
})

const domId = props.pieId;
const chartRef = ref(null);
let chartInstance = null;

// 处理窗口大小变化
const handleResize = () => {
    if (chartInstance) {
        chartInstance.resize();
    }
}

// 修改 data 的定义方式，改用 ref 来确保响应性
const data = ref({
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0
});

// 修改 watch 处理方式
watch(() => props.values, (newVal) => {
    if (!newVal) return;
    
    data.value = {
        running: newVal[0],
        fault: newVal[1],
        maintenance: newVal[2],
        construction: newVal[3],
        outage: newVal[4],
        other: newVal[5]
    };
    
    // 确保图表更新
    nextTick(() => {
        updateChart();
    });
}, { deep: true, immediate: true });

// 修改 option 中的数据绑定方式
const option = computed(() => ({
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            color: ['rgb(33, 226, 75)', '#FF0000', 'rgb(217 199 62)', 'rgba(0, 138, 255, 0.45)', 'grey', 'purple'],
            label: {
                show: true,
                position: 'inside',
                formatter: '{b}\n{d}%',
                fontSize: 12,
                color: '#fff'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            data: [
                { value: data.value.running, name: '运行' },
                { value: data.value.fault, name: '告警' },
                { value: data.value.maintenance, name: '维护' },
                { value: data.value.construction, name: '施工' },
                { value: data.value.outage, name: '停运' },
                { value: data.value.other, name: '退役' }
            ]
        }
    ]
}));

const initChart = () => {
    // 添加延时确保DOM已经渲染
    setTimeout(() => {
        if (chartInstance) {
            chartInstance.dispose();
        }
        
        const chart = document.getElementById(domId);
        if (!chart) return;
        
        chartInstance = echarts.init(chart);
        chartInstance.setOption(option.value);
        
        window.addEventListener('resize', handleResize);
    }, 0);
}

// 修改 updateChart 方法
const updateChart = () => {
    if (chartInstance) {
        chartInstance.setOption(option.value);
    }
}

// 使用 nextTick 确保在 DOM 更新后初始化图表
onMounted(() => {
    nextTick(() => {
        initChart();
    });
});

// 添加 watch 监听容器尺寸变化
watch(() => chartRef.value?.offsetWidth, (newVal) => {
    if (newVal && chartInstance) {
        chartInstance.resize();
    }
});

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose();
        window.removeEventListener('resize', handleResize);
    }
});

</script>

<style scoped lang="less">
.pie-chart-container {
    display: flex;
    flex-direction: column;
    height: 260px;
    background-color: var(--el-bg-color);
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);
    margin-bottom: 16px;
    padding: 10px;
    box-sizing: border-box;
}

.card-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    margin-bottom: 10px;
}

.title-box {
    grid-column: 2 / 3;
    height: 2rem;
    background-color: #3c8b9a;
    color: white;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
}

.chart-content {
    flex: 1;
    width: 100%;
    min-height: 180px;
}

@media screen and (max-width: 768px) {
    .pie-chart-container {
        height: 240px;
        padding: 5px;
    }

    .title-box {
        font-size: 14px;
        padding: 8px;
    }

    .chart-content {
        min-height: 160px;
    }
}
</style>