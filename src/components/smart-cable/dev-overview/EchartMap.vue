<template>
    <div class="containerdiv">
        <div class="mapcontainer">
        </div>
        <div class="labelinfo">
            <div>电缆井感知:<span>277套</span></div>
            <div>有源视频监控:<span>2套</span></div>
            <div>无源视频监控:<span>2套</span></div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted, nextTick, ref } from 'vue';
import { loadMapAsset } from '@/utils/asset-loader';

var option;
let mapchart;

// 添加基础路径配置
const BASE_DATA_PATH = '/assets/data';

const loadmap = async (jsonfile) => {
    let domMap = document.querySelector(".mapcontainer")
    domMap.removeAttribute("_echarts_instance_");

    domMap.style.width = '100%';
    domMap.style.height = '75vh';
    
    try {
        await nextTick();

        mapchart = echarts.init(domMap);
        mapchart.showLoading();

        // 使用 asset-loader 加载地图数据
        const [mapData, valueData] = await Promise.all([
            loadMapAsset(jsonfile, 'full'),
            loadMapAsset(jsonfile, 'value')
        ]);

        if (!mapData || !valueData) {
            throw new Error('地图数据加载失败');
        }

        echarts.registerMap('mapdata', mapData);
        mapchart.hideLoading();
        
        mapchart.setOption({
            title: {
                text: '乌鲁木齐',
                color: '#fff',
                left: '75%',
                top: '5%'
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
                    data: valueData,
                    nameMap: {}
                }
            ]
        });
    } catch (error) {
        console.error('加载地图数据失败:', error);
        mapchart?.hideLoading();
        // 这里可以添加错误提示UI
    }
}

const handleResize = () => {
    if (mapchart) {
        mapchart.resize();
    }
}

onMounted(() => {
    console.log('EchartMap组件已挂载');

    loadmap('650100');
    window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (mapchart) {
        mapchart.dispose();
    }
})
</script>

<style scoped lang="less">
.containerdiv {
    width: 100%;
    height: 100%;
    border: 1px solid #138D75;
    position: relative;
    border-radius: 5px;
}

.mapcontainer {
    width: 100%;
    height: 100%;
}

.labelinfo {
    position: absolute;
    left: 20px;
    top: 10px;
    border: 1px solid #138D75;
    color: black;
    padding: 5px 15px 5px 15px;
    border-radius: 5px;

    span {
        font-weight: bold;
        margin-left: 4px;
    }
}
</style>