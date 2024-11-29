<template>
    <el-card style="background-color: #fff; border: 0px solid #ccc; height: 100%;padding-top: 0px;">
        <DetailCard :card-title="titles[0]" :data="lineData" />
        <div style="height: 30px;"></div>
        <DetailCard :card-title="titles[1]" :data="segmentData" />
        <div style="height: 30px;"></div>
        <DetailCard :card-title="titles[2]" :data="cableEndData" total-unit="个" type="cable-ends" />

        <!-- 饼图 -->
        <el-row :gutter="4" style="margin: 0rem 0 0 0;">
            <el-col :xs="24" :sm="24" :md="8" class="chart-col">
                <PieChartCard pie-id="chart1" :title="titles[0]" :values="Object.values(lineData.details)" />
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" class="chart-col">
                <PieChartCard pie-id="chart2" :title="titles[1]" :values="Object.values(segmentData.details)" />
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" class="chart-col">
                <PieChartCard pie-id="chart3" :title="titles[2]" :values="Object.values(cableEndData.details)" />
            </el-col>
        </el-row>
    </el-card>
</template>
<script setup>
import PieChartCard from './home-overview/PieChartCard.vue'
import DetailCard from "./home-overview/DetailCard.vue"
import {
    lineData,
    segmentData,
    cableEndData,
    wellData,
    cableWayData,
    cableTubeData
} from './home-overview/CableData.js'

const titles = ["电缆线路", "电缆段", "电缆接头", "电缆井", "电缆通道", "电缆排管孔"]
</script>
<style></style>