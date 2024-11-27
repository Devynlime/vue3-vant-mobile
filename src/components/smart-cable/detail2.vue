<template>
    <el-card style="background-color: #fff;  border: 0px solid #ccc; height: 100%">
        <DetailCard :card-title="titles[3]" :data="wellData" />
        <div style="height: 30px;"></div>
        <DetailCard :card-title="titles[4]" :data="cableWayData" />
        <div style="height: 30px;"></div>
        <DetailCard :card-title="titles[5]" :data="cableTubeData" total-unit="个" type="tube" />

        <el-row :gutter="4" style="margin: 0rem 0 0 0;">
            <el-col :span="8">
                <PieChartCard pie-id="chart4" :title="titles[3]" :values="Object.values(wellData.details)" />
            </el-col>
            <el-col :span="8">
                <PieChartCard pie-id="chart5" :title="titles[4]" :values="Object.values(cableWayData.details)" />
            </el-col>
            <el-col :span="8">
                <PieChartCard pie-id="chart6" :title="titles[5]" :values="Object.values(cableTubeData.details)" />
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