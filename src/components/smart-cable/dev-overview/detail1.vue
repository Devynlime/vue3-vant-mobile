<template>

<div class="left-list">
        <div class="transparent-content">
            <div class="list-content" style="padding-top:15px;">
                <div
                    style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;">
                    <transformerSubstationIcon :iconwidth="36" :iconheight="36" :iconcolor="`#fff`"
                        style="margin-top:2px;margin-left:4px;" />
                    <div
                        style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;">
                        <div style="color:#fff;margin-left:8px;font-size: 1rem;">220KV变电站<span
                                style="font-size: 1.2rem;font-weight: bolder;">{{
                                    substationStatisticData?.voltageLevel[1].tital }}</span>座,容量 <span
                                style="font-size: 1.2rem;font-weight: bolder;">{{
                                    substationStatisticData?.voltageLevel[1].stationCapacity }} </span> MVA</div>
                    </div>
                </div>

                <div
                    style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;margin-top:6px;">
                    <transformerSubstationIcon :iconwidth="36" :iconheight="36" :iconcolor="`#fff`"
                        style="margin-top:2px;margin-left:4px;" />
                    <div
                        style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;">
                        <div style="color:#fff;margin-left:8px;font-size: 1rem;">110KV变电站<span
                                style="font-size: 1.2rem;font-weight: bolder;">{{
                                    substationStatisticData?.voltageLevel[0].tital }}</span>座,容量 <span
                                style="font-size: 1.2rem;font-weight: bolder;">{{
                                    substationStatisticData?.voltageLevel[0].stationCapacity }} </span> MVA</div>
                    </div>
                </div>

                <div
                    style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;margin-top:6px;">
                    <transformerSubstationIcon :iconwidth="36" :iconheight="36" :iconcolor="`#fff`"
                        style="margin-top:2px;margin-left:4px;" />
                    <div
                        style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;">
                        <div style="color:#fff;margin-left:8px;font-size: 1rem;">35KV变电站<span
                                style="font-size: 1.2rem;font-weight: bolder;">{{
                                    substationStatisticData?.voltageLevel[2].tital }}</span>座,容量 <span
                                style="font-size: 1.2rem;font-weight: bolder;">{{
                                    substationStatisticData?.voltageLevel[2].stationCapacity }}</span> MVA</div>
                    </div>
                </div>

                <div
                    style="border:1px solid #477887;height: 40px;border-radius: 6px;display:flex;flex-direction: row;background-color: #477887;margin-top:6px;">
                    <transformerSubstationIcon :iconwidth="36" :iconheight="36" :iconcolor="`#fff`"
                        style="margin-top:2px;margin-left:4px;" />
                    <div
                        style="vertical-align: middle;border:1px solid #3c8b9a;height: 39px;border-radius: 6px;flex-grow: 1;margin-left:10px;background-color: #3c8b9a;display: flex;flex-direction: column;justify-content:center;">
                        <div style="color:#fff;margin-left:8px;font-size: 1rem;">合计变电站<span
                                style="font-size: 1.2rem;font-weight: bolder;">{{ substationStatisticData?.total.total
                                }}</span>座,容量 <span style="font-size: 1.2rem;font-weight: bolder;">{{
                                    substationStatisticData?.total.stationCapacity }} </span> MVA</div>
                    </div>
                </div>
                <div style="display: flex;flex-direction: row;justify-content:space-around;margin-top:20px;">
                    <div class="statistic-box">
                        <div>{{ substationStatisticData?.state[1].total }}</div>
                        <div style="background-color:#32CD32;font-weight: bolder;">在运</div>
                    </div>
                    <div class="statistic-box">
                        <div>{{ substationStatisticData?.state[2].total }}</div>
                        <div style="background-color: #1E90FF;font-weight: bolder;">未投运</div>
                    </div>
                    <div class="statistic-box">
                        <div>{{ substationStatisticData?.state[0].total }}</div>
                        <div style="background-color: darkred;font-weight: bolder;">退役</div>
                    </div>
                </div>
            </div>
            <div class="list-content content-top">
                <div id="statisticPieChart_line" class="statisticPieChart_line"></div>
                <div style="display: flex;flex-direction: row;justify-content:space-around;margin-top:10px;">
                    <div class="statistic-box">
                        <div>{{ feederLineStatisticData?.state[0].total }}</div>
                        <div style="background-color:#32CD32;font-weight: bolder;">在运</div>
                    </div>
                    <div class="statistic-box">
                        <div>{{ feederLineStatisticData?.state[2].total }}</div>
                        <div style="background-color: #1E90FF;font-weight: bolder;">未投运</div>
                    </div>
                    <div class="statistic-box">
                        <div>{{ feederLineStatisticData?.state[1].total }}</div>
                        <div style="background-color: darkred;font-weight: bolder;">退役</div>
                    </div>
                </div>
                <div style="display: flex;flex-direction: row;justify-content:space-around;margin-top:20px;">
                    <div class="statistic-box">
                        <div>{{ feederLineStatisticData?.state[3].total }}</div>
                        <div style="background-color: darkred;font-weight: bolder;">现场留用</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import * as eCharts from "echarts";
import  transformerSubstationIcon  from '@/components/icon/transformerSubstationIcon.vue';
import { onMounted, ref } from "vue";
import {substationStatistic, feederLineStatistic, cableStatistic, channelStatistic} from "@/api/device-overview"
import {
    chart_line,
    option_line,
} from "./chart";
import {
    substationStatisticData,
    feederLineStatisticData,
    cableStatisticData,
    channelStatisticData,
} from './index.js'
const initChart_line = () => {
    let chartDom = document.querySelector("#statisticPieChart_line")
    chart_line.value = eCharts.init(chartDom);
    chart_line.value.setOption(option_line.value, true);
}

onMounted(() => {
    setTimeout(() => {
        // initChart_line();

    }, 10);
    // initChart_line();
})
</script>
<style scoped>
@import url(./style.css);
#statisticPieChart_line {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    width: 100%;
    min-height: 320px;
}
</style>