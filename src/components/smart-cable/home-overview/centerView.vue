<template>
    <el-row :gutter="0">
        <el-col>
            <div class="w-full">
                <div class="mapcontainer"></div>
            </div>
        </el-col>

        <!-- 地图下方概览数据 -->
        <el-col :offset="0" :span="24">
            <el-card class="bottom-box" style="">
                <p class="text-center"> 变电总容量 <span class="highlight-values">{{ bianDianTotalCapacity }}</span> Mva </p>

                <div class="card-content">
                    <p class="text-center">变配电总功率</p>

                    <el-row :gutter="20" class="text-center power-row">
                        <el-col :span="12" class="power-col">
                            <span>有功 <span class="highlight-values">{{ bianPeiDianTotal.p }}</span>MW</span>
                        </el-col>
                        <el-col :span="12" class="power-col">
                            <span>无功 <span class="highlight-values">{{ bianPeiDianTotal.q }}</span>Mvar</span>
                        </el-col>
                    </el-row>

                </div>

                <p class="text-center">10kv电缆线路配供电总功率</p>

                <el-row :gutter="0" class="text-center power-row">
                    <el-col :span="12" class="power-col">
                        <span>有功 <span class="highlight-values"> {{ gongDianTotal_10kv.p }} </span>MW </span>
                    </el-col>

                    <el-col :span="12" class="power-col">
                        <span>无功<span class="highlight-values"> {{ gongDianTotal_10kv.q }} </span>Mvar</span>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>
<script setup>
import * as echarts from 'echarts';
import { onMounted, reactive, ref, onUnmounted, nextTick, watch } from 'vue';
import { substationStatistic } from '@/api/device-overview'

// 1. 首先定义所有响应式数据
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

// 2. 然后定义变量和函数
var option;
let mapchart; // 添加图表实例的引用

const loadmap = (jsonfile) => {
    let domMap = document.querySelector(".mapcontainer")
    domMap.removeAttribute("_echarts_instance_");
    
    domMap.style.width = '100%';
    domMap.style.height = '50vh';
    
    nextTick(() => {
        mapchart = echarts.init(domMap, null, {
            renderer: 'canvas'
        });
        
        const resizeHandler = () => {
            if (mapchart) {
                mapchart.resize();
            }
        };
        
        window.addEventListener('resize', resizeHandler);
        
        onUnmounted(() => {
            window.removeEventListener('resize', resizeHandler);
            if (mapchart) {
                mapchart.dispose();
            }
        });

        mapchart.showLoading();
        fetch(`./assets/data/${jsonfile}_full.json`)
            .then(res => res.json())
            .then(data => {
                echarts.registerMap('mapdata', data);
                fetch(`./assets/data/${jsonfile}_value.json`)
                    .then(res => res.json())
                    .then(val => {
                        mapchart.hideLoading();
                        option = {
                            title: {
                                text: '乌鲁木齐',
                                color: '#fff',
                                left: '75%',
                                top: '30%'
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
                                    top: 50,
                                    bottom: 50,
                                    left: 100,
                                    right: 50,
                                    label: {
                                        show: true
                                    },
                                    data: val,
                                }
                            ],
                            graphic: [
                                // 左上标签
                                {
                                    type: 'group',
                                    left: 20,
                                    top: 0,
                                    z: 100,
                                    children: [{
                                        type: 'rect',
                                        shape: {
                                            width: 160,
                                            height: 65,
                                            r: 8
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                                offset: 0,
                                                color: '#18B495'
                                            }, {
                                                offset: 1,
                                                color: '#16A085'
                                            }]),
                                            shadowBlur: 10,
                                            shadowColor: 'rgba(0,0,0,0.2)',
                                            shadowOffsetX: 2,
                                            shadowOffsetY: 2,
                                            borderRadius: 8
                                        }
                                    }, {
                                        type: 'text',
                                        style: {
                                            rich: {
                                                key: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'normal'
                                                },
                                                value: {
                                                    fill: '#FFD700',  // 金色
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    padding: [0, 4]  // 左右添加间距
                                                },
                                                unit: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    padding: [0, 0, 0, 2]  // 左侧添加间距
                                                }
                                            },
                                            text: [
                                                '{key|220KV变电站:} {value|' + leftTopInfo.numStation + '}{unit|座}\n',
                                                '{key|容量:} {value|' + leftTopInfo.capacity + '}{unit|MVA}'
                                            ].join(''),
                                            padding: [12, 15],
                                            lineHeight: 20,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                        }
                                    }, {
                                        // 添加装饰性图标或线条
                                        type: 'rect',
                                        shape: {
                                            width: 3,
                                            height: 30
                                        },
                                        position: [0, 17],
                                        style: {
                                            fill: '#fff',
                                            borderRadius: 2
                                        }
                                    }],
                                    // 添加鼠标悬停效果
                                    onmouseover: function() {
                                        this.children[0].style.shadowBlur = 20;
                                        mapchart.setOption(option);
                                    },
                                    onmouseout: function() {
                                        this.children[0].style.shadowBlur = 10;
                                        mapchart.setOption(option);
                                    }
                                },
                                // 右上标签
                                {
                                    type: 'group',
                                    right: 20,
                                    top: 0,
                                    z: 100,
                                    children: [{
                                        type: 'rect',
                                        shape: {
                                            width: 160,
                                            height: 65,
                                            r: 8
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                                offset: 0,
                                                color: '#18B495'
                                            }, {
                                                offset: 1,
                                                color: '#16A085'
                                            }]),
                                            shadowBlur: 10,
                                            shadowColor: 'rgba(0,0,0,0.2)',
                                            shadowOffsetX: 2,
                                            shadowOffsetY: 2,
                                            borderRadius: 8
                                        }
                                    }, {
                                        type: 'text',
                                        style: {
                                            rich: {
                                                key: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'normal'
                                                },
                                                value: {
                                                    fill: '#FFD700',  // 金色
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    padding: [0, 4]  // 左右添加间距
                                                },
                                                unit: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    padding: [0, 0, 0, 2]  // 左侧添加间距
                                                }
                                            },  
                                            text: [ 
                                                '{key|110KV变电站:} {value|' + rightTopInfo.numStation + '}{unit|座}\n',
                                                '{key|容量:} {value|' + rightTopInfo.capacity + '}{unit|MVA}'
                                            ].join(''),
                                            padding: [12, 15],
                                            lineHeight: 20,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                        }
                                    }, {
                                        // 添加装饰性图标或线条
                                        type: 'rect',
                                        shape: {
                                            width: 3,
                                            height: 30
                                        },
                                        position: [0, 17],
                                        style: {
                                            fill: '#fff',
                                            borderRadius: 2
                                        }
                                    }],
                                    // 添加鼠标悬停效果
                                    onmouseover: function() {
                                        this.children[0].style.shadowBlur = 20;
                                        mapchart.setOption(option);
                                    },
                                    onmouseout: function() {
                                        this.children[0].style.shadowBlur = 10;
                                        mapchart.setOption(option);
                                    }
                                },
                                // 左下标签
                                {
                                    type: 'group',
                                    left: 20,
                                    bottom: 0,
                                    z: 100,
                                    children: [{
                                        type: 'rect',
                                        shape: {
                                            width: 160,
                                            height: 65,
                                            r: 8
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                                offset: 0,
                                                color: '#18B495'
                                            }, {
                                                offset: 1,
                                                color: '#16A085'
                                            }]),
                                            shadowBlur: 10,
                                            shadowColor: 'rgba(0,0,0,0.2)',
                                            shadowOffsetX: 2,
                                            shadowOffsetY: 2,
                                            borderRadius: 8
                                        }
                                    }, {
                                        type: 'text',
                                        style: {
                                            rich: {
                                                key: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'normal'
                                                },
                                                value: {  
                                                    fill: '#FFD700',  // 金色
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    padding: [0, 4]  // 左右添加间距
                                                },
                                                unit: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    padding: [0, 0, 0, 2]  // 左侧添加间距
                                                }
                                            },
                                            text: [
                                                '{key|35KV变电站:} {value|' + leftBottomInfo.numStation + '}{unit|座}\n',
                                                '{key|容量:} {value|' + leftBottomInfo.capacity + '}{unit|MVA}'
                                            ].join(''),
                                            padding: [12, 15],
                                            lineHeight: 20,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                        }
                                    }, {
                                        // 添加装饰性图标或线条
                                        type: 'rect',
                                        shape: {
                                            width: 3,
                                            height: 30
                                        },
                                        position: [0, 17],
                                        style: {
                                            fill: '#fff',
                                            borderRadius: 2
                                        }
                                    }],
                                    // 添加鼠标悬停效果
                                    onmouseover: function() {
                                        this.children[0].style.shadowBlur = 20;
                                        mapchart.setOption(option);
                                    },
                                    onmouseout: function() {
                                        this.children[0].style.shadowBlur = 10;
                                        mapchart.setOption(option);
                                    }
                                }
                            ],
                        };
                        
                        mapchart.setOption(option);
                        mapchart.resize();
                    });
            });
    });
}

// 创建更新图表的方法
const updateLabels = () => {
    if (mapchart) {
        mapchart.setOption({
            graphic: [
                                // 左上标签
                                {
                                    type: 'group',
                                    left: 20,
                                    top: 0,
                                    z: 100,
                                    children: [{
                                        type: 'rect',
                                        shape: {
                                            width: 160,
                                            height: 65,
                                            r: 8
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                                offset: 0,
                                                color: '#18B495'
                                            }, {
                                                offset: 1,
                                                color: '#16A085'
                                            }]),
                                            shadowBlur: 10,
                                            shadowColor: 'rgba(0,0,0,0.2)',
                                            shadowOffsetX: 2,
                                            shadowOffsetY: 2,
                                            borderRadius: 8
                                        }
                                    }, {
                                        type: 'text',
                                        style: {
                                            rich: {
                                                key: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'normal'
                                                },
                                                value: {
                                                    fill: '#FFD700',  // 金色
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    padding: [0, 4]  // 左右添加间距
                                                },
                                                unit: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    padding: [0, 0, 0, 2]  // 左侧添加间距
                                                }
                                            },
                                            text: [
                                                '{key|220KV变电站:} {value|' + leftTopInfo.numStation + '}{unit|座}\n',
                                                '{key|容量:} {value|' + leftTopInfo.capacity + '}{unit|MVA}'
                                            ].join(''),
                                            padding: [12, 15],
                                            lineHeight: 20,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                        }
                                    }, {
                                        // 添加装饰性图标或线条
                                        type: 'rect',
                                        shape: {
                                            width: 3,
                                            height: 30
                                        },
                                        position: [0, 17],
                                        style: {
                                            fill: '#fff',
                                            borderRadius: 2
                                        }
                                    }],
                                    // 添加鼠标悬停效果
                                    onmouseover: function() {
                                        this.children[0].style.shadowBlur = 20;
                                        mapchart.setOption(option);
                                    },
                                    onmouseout: function() {
                                        this.children[0].style.shadowBlur = 10;
                                        mapchart.setOption(option);
                                    }
                                },
                                // 右上标签
                                {
                                    type: 'group',
                                    right: 20,
                                    top: 0,
                                    z: 100,
                                    children: [{
                                        type: 'rect',
                                        shape: {
                                            width: 160,
                                            height: 65,
                                            r: 8
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                                offset: 0,
                                                color: '#18B495'
                                            }, {
                                                offset: 1,
                                                color: '#16A085'
                                            }]),
                                            shadowBlur: 10,
                                            shadowColor: 'rgba(0,0,0,0.2)',
                                            shadowOffsetX: 2,
                                            shadowOffsetY: 2,
                                            borderRadius: 8
                                        }
                                    }, {
                                        type: 'text',
                                        style: {
                                            rich: {
                                                key: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'normal'
                                                },
                                                value: {
                                                    fill: '#FFD700',  // 金色
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    padding: [0, 4]  // 左右添加间距
                                                },
                                                unit: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    padding: [0, 0, 0, 2]  // 左侧添加间距
                                                }
                                            },  
                                            text: [ 
                                                '{key|110KV变电站:} {value|' + rightTopInfo.numStation + '}{unit|座}\n',
                                                '{key|容量:} {value|' + rightTopInfo.capacity + '}{unit|MVA}'
                                            ].join(''),
                                            padding: [12, 15],
                                            lineHeight: 20,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                        }
                                    }, {
                                        // 添加装饰性图标或线条
                                        type: 'rect',
                                        shape: {
                                            width: 3,
                                            height: 30
                                        },
                                        position: [0, 17],
                                        style: {
                                            fill: '#fff',
                                            borderRadius: 2
                                        }
                                    }],
                                    // 添加鼠标悬停效果
                                    onmouseover: function() {
                                        this.children[0].style.shadowBlur = 20;
                                        mapchart.setOption(option);
                                    },
                                    onmouseout: function() {
                                        this.children[0].style.shadowBlur = 10;
                                        mapchart.setOption(option);
                                    }
                                },
                                // 左下标签
                                {
                                    type: 'group',
                                    left: 20,
                                    bottom: 0,
                                    z: 100,
                                    children: [{
                                        type: 'rect',
                                        shape: {
                                            width: 160,
                                            height: 65,
                                            r: 8
                                        },
                                        style: {
                                            fill: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                                offset: 0,
                                                color: '#18B495'
                                            }, {
                                                offset: 1,
                                                color: '#16A085'
                                            }]),
                                            shadowBlur: 10,
                                            shadowColor: 'rgba(0,0,0,0.2)',
                                            shadowOffsetX: 2,
                                            shadowOffsetY: 2,
                                            borderRadius: 8
                                        }
                                    }, {
                                        type: 'text',
                                        style: {
                                            rich: {
                                                key: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'normal'
                                                },
                                                value: {  
                                                    fill: '#FFD700',  // 金色
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    padding: [0, 4]  // 左右添加间距
                                                },
                                                unit: {
                                                    fill: '#fff',
                                                    fontSize: 12,
                                                    padding: [0, 0, 0, 2]  // 左侧添加间距
                                                }
                                            },
                                            text: [
                                                '{key|35KV变电站:} {value|' + leftBottomInfo.numStation + '}{unit|座}\n',
                                                '{key|容量:} {value|' + leftBottomInfo.capacity + '}{unit|MVA}'
                                            ].join(''),
                                            padding: [12, 15],
                                            lineHeight: 20,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                        }
                                    }, {
                                        // 添加装饰性图标或线条
                                        type: 'rect',
                                        shape: {
                                            width: 3,
                                            height: 30
                                        },
                                        position: [0, 17],
                                        style: {
                                            fill: '#fff',
                                            borderRadius: 2
                                        }
                                    }],
                                    // 添加鼠标悬停效果
                                    onmouseover: function() {
                                        this.children[0].style.shadowBlur = 20;
                                        mapchart.setOption(option);
                                    },
                                    onmouseout: function() {
                                        this.children[0].style.shadowBlur = 10;
                                        mapchart.setOption(option);
                                    }
                                }
                            ],
        });
    }
}

// 监听数据变化
watch([leftTopInfo, rightTopInfo, leftBottomInfo], () => {
    console.log('数据变化，更新标签')
    updateLabels();
});

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

// 获取数据
const getSubstations = async () => {
    try {
        const res = await substationStatistic()
        // 解析数据
        const resVoltageLevel = res?.data?.voltageLevel || {}
        
        const substationGroup = {
            "220KV": resVoltageLevel.find(item => item.voltageLevelName === "交流220kV") || {},
            "110KV": resVoltageLevel.find(item => item.voltageLevelName === "交流110kV") || {},
            "35KV": resVoltageLevel.find(item => item.voltageLevelName === "交流35kV") || {}
        }

        Object.assign(leftTopInfo, {
            numStation: substationGroup["220KV"]?.total || 0,
            capacity: substationGroup["220KV"]?.stationCapacity || 0
        })
        Object.assign(rightTopInfo, {
            numStation: substationGroup["110KV"]?.total || 0,
            capacity: substationGroup["110KV"]?.stationCapacity || 0
        })
        Object.assign(leftBottomInfo, {
            numStation: substationGroup["35KV"]?.total || 0,
            capacity: substationGroup["35KV"]?.stationCapacity || 0
        })

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
    margin-top: 5px;
    border: 2px solid var(--vt-c-divider-light-0);
    background-color: var(--vt-c-divider-light-1);
    border-radius: 5px;
    position: relative;
    box-sizing: border-box;
    min-width: 300px;
    min-height: 300px;
}

.labelinfo {
    position: absolute;
    border: 1px solid var(--vt-c-divider-light-0);
    color: white;
    padding: 6px;
    border-radius: 5px;
    background-color: #18B495;
    z-index: 10;

    span {
        font-weight: bold;
        margin-left: 4px;
    }
}

.labelinfo-left-top {
    left: 20px;
    top: 20px;
}

.labelinfo-right-top {
    right: 20px;
    top: 20px;
}

.labelinfo-left-bottom {
    left: 20px;
    bottom: 20px;
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
    padding: 10px;
    color: #fff;
    background-color: #3c8b9a;
    overflow: hidden;
}

.text-center {
    // 居中
    text-align: center;

}

.power-row {
    width: 100%;
    display: flex;
    align-items: center;
}

.power-col {
    flex: 1;
    white-space: nowrap;
}
</style>