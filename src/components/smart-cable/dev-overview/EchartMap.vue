<template>
    <div class="containerdiv">
        <div class="mapcontainer">
        </div>
        <div class="labelinfo">
            <div>电缆井感知:<span>188套</span></div>
            <div>有源视频监控:<span>2套</span></div>
            <div>无源视频监控:<span>2套</span></div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';

var option;
const loadmap = (jsonfile) => {
    let domMap = document.querySelector(".mapcontainer")
    domMap.removeAttribute("_echarts_instance_");
    var mapchart = echarts.init(domMap);
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
                            data: val,
                            nameMap: {}
                        }
                    ]
                }
            );
        })
    })
}

onMounted(() => {
    loadmap('650100')
})
</script>

<style scoped lang="less">
.containerdiv {
    width: 100%;
    height: calc(85vh);
    border: 1px solid #138D75;
    position: relative;
    border-radius: 5px;
}

.mapcontainer {
    width: 100vw;
    height: calc(88vh);
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