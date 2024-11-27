<template>
    <div>
        <div>
            <div class="container ">
                <div class="title">配网电缆运行态势总览</div>
                <div class="title2">
                    <el-dropdown>
                        <span class="el-dropdown-link">{{ deptName }}<el-icon
                                class="el-icon--right"><arrow-down /></el-icon></span>
                        <template #dropdown>
                            <el-input v-model="filterText" style="padding:4px 12px 2px 12px;" placeholder="输入台区名称" />
                            <el-tree ref="treeRef" class="filter-tree" highlight-current :data="data"
                                :props="defaultProps" :filter-node-method="filterNode" :default-expanded-keys="nodekey"
                                @node-click="handleNodeClick" />
                        </template>
                    </el-dropdown>
                </div>
                <div class="overview"></div>
            </div>
            <div class="affix-container">
                <el-row :gutter="0" >

                    <!-- 左⬅️ -->
                    <el-col :span="6" style="padding-left: 10px;">
                        <el-card style="background-color: #fff; border: 1px solid #ccc; height: 100%">
                            <DetailCard :card-title="titles[0]" :data="lineData"/>
                            <div style="height: 30px;"></div>
                            <DetailCard :card-title="titles[1]" :data="segmentData" />
                            <div style="height: 30px;"></div>
                            <DetailCard :card-title="titles[2]" :data="cableEndData" total-unit="个" type="cable-ends"  />

                            <!-- 饼图 -->
                            <el-row :gutter="4" style="margin: 6.2rem 0 0 0;">
                                <el-col :span="8">
                                    <PieChartCard pie-id="chart1" :title="titles[0]"
                                        :values="Object.values(lineData.details)" />
                                </el-col>
                                <el-col :span="8">
                                    <PieChartCard pie-id="chart2" :title="titles[1]"
                                        :values="Object.values(segmentData.details)" />
                                </el-col>
                                <el-col :span="8">
                                    <PieChartCard pie-id="chart3" :title="titles[2]"
                                        :values="Object.values(cableEndData.details)" />
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>

                    <!-- 🀄️中央视图 -->
                    <el-col :span="12" style="padding-left: 10px;">
                        <centerView />
                    </el-col>

                    <!-- ➡️右 -->
                    <el-col :span="6" style="padding-left: 10px;">
                        <el-card style="background-color: #fff;  border: 1px solid #ccc; height: 100%">
                            <DetailCard :card-title="titles[3]" :data="wellData" />
                            <div style="height: 30px;"></div>
                            <DetailCard :card-title="titles[4]" :data="cableWayData" />
                            <div style="height: 30px;"></div>
                            <DetailCard :card-title="titles[5]" :data="cableTubeData" total-unit="个" type="tube" />

                            <el-row :gutter="4" style="margin: 6.2rem 0 0 0;">
                                <el-col :span="8">
                                    <PieChartCard pie-id="chart4" :title="titles[3]"
                                        :values="Object.values(wellData.details)" />
                                </el-col>
                                <el-col :span="8">
                                    <PieChartCard pie-id="chart5" :title="titles[4]"
                                        :values="Object.values(cableWayData.details)" />
                                </el-col>
                                <el-col :span="8">
                                    <PieChartCard pie-id="chart6" :title="titles[5]"
                                        :values="Object.values(cableTubeData.details)" />
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script setup>
import PieChartCard from "./PieChartCard.vue"
import {
    lineData,
    segmentData,
    cableEndData,
    wellData,
    cableWayData,
    cableTubeData
} from './CableData.js'
import DetailCard from "./DetailCard.vue"
// import { handleTree } from '@/utils/common'
import centerView from "./centerView.vue"
// import { listArea } from "@/api/manage/area";
import { ArrowDown } from '@element-plus/icons-vue'
import { onMounted, reactive, ref, watch } from 'vue'
import {overviewStatistic} from '@/api/device-overview'

// import useUserStore from '@/store/modules/user'

// const userStore = useUserStore()
const filterText = ref('')
const treeRef = ref(null)
const deptName = ref("")
// onMounted(() => {
//     deptName.value = useUserStore().deptName
//     arealist()
// })

const data = ref([])
const nodekey = ref([])
const defaultProps = {
    children: 'children',
    label: 'name',
    hasChildren: 'hasChildren'
}
// const arealist = () => {
//     let deptId = useUserStore().deptId
//     listArea({ "orgId": deptId, "nodeType": "0" }).then(response => {
//         console.log("response:", response)
//         data.value = handleTree(response.data, "id");
//         data.value.forEach(element => {
//             nodekey.value.push(element.id)
//         })
//     });
// }

watch(filterText, (value, oldValue) => {
    treeRef.value.filter(value)
    console.log(value, oldValue)
})

function handleNodeClick(data) {
    //emit('nodeClick', data)
    console.log("handleNodeClick:", data)
}

// const filterNode = (value, ndata, node) => {
//     let parentNode = node.parent
//     let labels = [node.label]
//     let level = 1 // 层级
//     while (level < node.level) {
//         labels = [...labels, parentNode.label] // 当前node名字，父级node的名字
//         parentNode = parentNode.parent
//         level++
//     }
//     return labels.some(d => d.indexOf(value) !== -1)
// }

// 各详情卡片标题
const titles = ["电缆线路", "电缆段", "电缆接头", "电缆井", "电缆通道", "电缆排管孔"]

// 各详情数据(详情数据定义在专门的js中)
const updateInfo = () => {
    const values = transformData(mockData, lineData) // 模拟数据
    transformData(mockData, segmentData)
    transformData(mockData, cableEndData)
    transformData(mockData, wellData)
    transformData(mockData, cableWayData)
    transformData(mockData, cableTubeData)
    console.log("values:", Object.values(values.details))

}
onMounted(() => {
    updateInfo()
})
const mockData = {
    total: 1298,
    totalLength: 128821,
    details: {
        running: 698,
        fault: 120,
        maintenance: 120,
        construction: 120,
        outage: 120,
        other: 110,
    }
}
const transformData = (from, to) => {
    to.total = from.total;
    to.totalLength = from.totalLength;
    to.details.running = from.details.running;
    to.details.fault = from.details.fault;
    to.details.maintenance = from.details.maintenance;
    to.details.construction = from.details.construction;
    to.details.outage = from.details.outage;
    to.details.other = from.details.other;

    return to;
}

// 读取信息
const fetchOverviewStatistic = async () => {
    overviewStatistic().then(res => {
        // console.log(res)
        let data = res.data

        // 电缆线路
        let line = data.cableLine
        // console.log("line:", line)
        // detail1.value = [line.num,line.length,line.statusAndCount["在运"],line.statusAndCount["未投运"],line.statusAndCount["现场留用"],line.statusAndCount["施工"],line.statusAndCount["停运"],line.statusAndCount["退役"]]
    })
}
const detail1 = ref([])
onMounted(() => {
    fetchOverviewStatistic()
})
</script>
<style scoped>
.filter-tree {
    margin: 2px 15px 2px 12px;
}

.el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    margin-top: 2px;
    z-index: 2022;
}

.overview {
    background: url(/src/assets/images/overview/53bg.png) no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
}

.container {
    display: flex;
    height: calc(100vh - 70px);
    width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: center;
}

.affix-container {
    position: fixed;
    top: 90px; /* 顶部距离 原本：100 */
    left: 0px;
    width: 100%;
}

.title {
    font-family: 'Courier New', Courier, monospace, 黑体;
    font-size: 1.8rem;
    color: rgb(18, 119, 167);
    font-weight: bold;
}

.title2 {
    font-size: 1.2rem;
    margin-top: -9px;
    font-weight: bolder;
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}

.searchBar {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 99999999;
    border: 1px solid var(--vt-c-divider-light-2);
    box-shadow: 1px 1px 4px black;
    border-radius: 4px;
}
</style>