<template>
    <el-row :gutter="0">
        <el-col>
            <div class= "w-100%">
                <div class="mapcontainer"> </div>

                <div class="labelinfo labelinfo-left-top">
                    <div>220KV变电站: <span class="highlight-values">{{ leftTopInfo.numStation }}</span> 座</div>
                    <div>容量: <span class="highlight-values">{{ leftTopInfo.capacity }}</span> MVA</div>
                    <!-- <br>
                    <div>其中10kv电缆线路:</div>
                    <div>数量: <span class="highlight-values">{{ leftTopInfo.numCable }}</span> 条</div>
                    <div>长度: <span class="highlight-values">{{ leftTopInfo.lenthCable }}</span> km</div> -->
                </div>

                <div class="labelinfo labelinfo-right-top">
                    <div>110KV变电站: <span class="highlight-values">{{ rightTopInfo.numStation }}</span> 座</div>
                    <div>容量: <span class="highlight-values">{{ rightTopInfo.capacity }}</span> MVA</div>
                    <!-- <br>
                    <div>其中10kv电缆线路:</div>
                    <div>数量: <span class="highlight-values">{{ rightTopInfo.numCable }}</span> 条</div>
                    <div>长度: <span class="highlight-values">{{ rightTopInfo.lenthCable }}</span> km</div> -->
                </div>

                <div class="labelinfo labelinfo-left-bottom">
                    <div>35KV变电站: <span class="highlight-values">{{ leftBottomInfo.numStation }}</span> 座</div>
                    <div>容量: <span class="highlight-values">{{ leftBottomInfo.capacity }}</span> MVA</div>
                    <!-- <br>
                    <div>其中10kv电缆线路:</div>
                    <div>数量: <span class="highlight-values">{{ leftBottomInfo.numCable }}</span> 条</div>
                    <div>长度: <span class="highlight-values">{{ leftBottomInfo.lenthCable }}</span> km</div> -->
                </div>
            </div>
        </el-col>

        <!-- 地图下方概览数据 -->
        <el-col :offset="0" :span="24">
            <el-card class="bottom-box" style="">
                <p class="text-center"> 变电总容量 <span class="highlight-values">{{ bianDianTotalCapacity }}</span> Mva </p>

                <div class="card-content">
                    <p class="text-center">变配电总功率</p>

                    <el-row :gutter="0" class="text-center">
                        <el-col :span="12">有功 <span class="highlight-values"> {{ bianPeiDianTotal.p }} </span>MW
                        </el-col>

                        <el-col :span="12">无功<span class="highlight-values"> {{ bianPeiDianTotal.q }}
                            </span>Mvar</el-col>
                    </el-row>

                </div>

                <p class="text-center">10kv电缆线路配供电总功率</p>

                <el-row :gutter="0" class="text-center">
                    <el-col :span="12">有功 <span class="highlight-values"> {{ gongDianTotal_10kv.p }} </span>MW </el-col>

                    <el-col :span="12">无功<span class="highlight-values"> {{ gongDianTotal_10kv.q }} </span>Mvar</el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>
<script setup>
import * as echarts from 'echarts';
import { onMounted, reactive, ref, onUnmounted } from 'vue';
import { overviewStatistic } from '@/api/device-overview'

var option;

const loadmap = (jsonfile) => {
    let domMap = document.querySelector(".mapcontainer")
    domMap.removeAttribute("_echarts_instance_");
    
    // 确保容器有明确的尺寸
    domMap.style.width = '100%';
    domMap.style.height = '45vh';
    
    // 初始化时指定渲染模式和尺寸
    var mapchart = echarts.init(domMap, null, {
        renderer: 'canvas',
        width: 'auto',
        height: 'auto'
    });
    
    // 添加resize监听
    const resizeHandler = () => {
        if (mapchart) {
            mapchart.resize({
                width: 'auto',
                height: 'auto'
            });
        }
    };
    
    window.addEventListener('resize', resizeHandler);
    
    // 确保组件销毁时移除监听器
    onUnmounted(() => {
        window.removeEventListener('resize', resizeHandler);
        mapchart.dispose();
    });
    
    mapchart.showLoading();
    fetch('./assets/data/' + jsonfile + "_full.json").then(res => {
        return res.json()
    }).then(data => {
        echarts.registerMap('mapdata', data);
        fetch('./assets/data/' + jsonfile + "_value.json").then(res => {
            return res.json()
        }).then(val => {
            mapchart.hideLoading();
            mapchart.setOption(
                option = {
                    title: {
                        text: '乌鲁木齐',
                        color: '#fff',
                        left: '75%',
                        top: '10%'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}:{c}'
                    },
                    visualMap: {
                        min: 0,
                        max: 300,
                        text: ['High', 'Low'],
                        realtime: false,
                        calculable: true,
                        show: false,
                        inRange: {
                            color: [
                                '#313695',
                                '#4575b4',
                                '#74add1',
                                '#abd9e9',
                                '#e0f3f8',
                                '#ffffbf',
                                '#fee090',
                                '#fdae61',
                                '#f46d43',
                                '#d73027',
                                '#a50026'
                            ]
                        }
                    },
                    series: [
                        {
                            name: '统计信息',
                            type: 'map',
                            map: 'mapdata',
                            label: {
                                show: true
                            },
                            data: val,
                            nameMap: {}
                        }
                    ]
                }
            );
            mapchart.setOption(option);
            setTimeout(() => {
                mapchart.resize();
            }, 0);
        })
    })
}

onMounted(() => {
    // let deptName = useUserStore().deptName
    let deptName = '乌鲁木齐'
    if (deptName === '乌鲁木齐') {
        loadmap('650100')
    } else if (deptName === '巴州') {
        loadmap('652800')
    } else {
        loadmap('650100')
    }
})

// 左上数据
const leftTopInfo = reactive({
    numStation: 0,
    capacity: 0,
    numCable: 0,
    lenthCable: 0,
})
const rightTopInfo = reactive({
    numStation: 0,
    capacity: 0,
    numCable: 0,
    lenthCable: 0,
})
const leftBottomInfo = reactive({
    numStation: 0,
    capacity: 0,
    numCable: 0,
    lenthCable: 0,
})

// 地图下方概览数据
const bianDianTotalCapacity = ref(0)
const bianPeiDianTotal = reactive({
    p: 0,
    q: 0,
})
const gongDianTotal_10kv = reactive({
    p: 0,
    q: 0,
})

// 模拟初始化数据
onMounted(() => {
    const mockData = {
        numStation: 123,
        capacity: 500,
        numCable: 1298,
        lenthCable: 1298
    }

    Object.assign(leftTopInfo, mockData)
    Object.assign(rightTopInfo, mockData)
    Object.assign(leftBottomInfo, mockData)
    Object.assign(bianPeiDianTotal, { p: 100, q: 50 })
    Object.assign(gongDianTotal_10kv, { p: 50, q: 25 })
    bianDianTotalCapacity.value = 1000
})

// 获取数据
const getSubstations = async () => {
    try {
        const res = await overviewStatistic()
        // console.log('API response:', res) // 添加日志查看完整响应

        // 安全地获取数据，提供默认值
        const substationGroup = res?.data?.substationGroup || {
            "220KV": 0,
            "110KV": 0,
            "35KV": 0
        }

        // 更新变电站信息
        Object.assign(leftTopInfo, {
            numStation: substationGroup["220KV"] || 0,
            capacity: (substationGroup["220KV"] || 0) * 240
        })
        Object.assign(rightTopInfo, {
            numStation: substationGroup["110KV"] || 0,
            capacity: (substationGroup["110KV"] || 0) * 120
        })
        Object.assign(leftBottomInfo, {
            numStation: substationGroup["35KV"] || 0,
            capacity: (substationGroup["35KV"] || 0) * 25
        })

        // 计算总容量
        bianDianTotalCapacity.value = leftTopInfo.capacity + rightTopInfo.capacity + leftBottomInfo.capacity
    } catch (error) {
        console.error('获取变电站数据失败:', error)
        // 可以在这里添加错误处理，比如显示错误提示
    }
}
onMounted(() => {
    getSubstations()
})
</script>

<style scoped lang="less">
.mapcontainer {
    width: 100%;
    height: 45vh;
    margin-top: 50px;
    border: 2px solid var(--vt-c-divider-light-0);
    background-color: var(--vt-c-divider-light-1);
    border-radius: 5px;
    position: relative;
    box-sizing: border-box;
    overflow: hidden; // 防止内容溢出
    display: flex; // 使用flex布局
    align-items: center;
    justify-content: center;
}

.labelinfo {
    position: absolute;
    border: 1px solid var(--vt-c-divider-light-0);
    color: white;
    padding: 6px;
    border-radius: 5px;
    // background-color: #1f9e8dbe;
    // background-color: #3c8b9a;
    background-color: #18B495;

    span {
        font-weight: bold;
        margin-left: 4px;
    }
}

.labelinfo-left-top {
    left: 20px;
    top: 10px;
}

.labelinfo-right-top {
    right: 20px;
    // top: 80px;
    top: 10px;
}

.labelinfo-left-bottom {
    left: 20px;
    bottom: 300px;
}

// 高亮数据
.highlight-values {
    color: #ffd000;
    font-weight: bold;
    margin: 0 5px;
}

.bottom-box {
    // color: #fff;
    // background-color: #3c8b9a;
    color: #3c8b9a;
    background-color: #fff;

    border: #ccc;
    font-size: 1.25rem;
    font-weight: 900;

    max-width: 100%;
    margin-top: 35px;
}

.card-content {
    border: #3c8b9a 1px solid;
    border-radius: 5px;
    margin: 10px 0;

    color: #fff;
    background-color: #3c8b9a;
}

.text-center {
    // 居中
    text-align: center;

}
</style>