<template>
    <div class="detail-card">
        <el-row :gutter="0">
            <el-col :span="12" :offset="6">
                <p class="title-box">{{ props.cardTitle }}</p>
            </el-col>
        </el-row>

        <el-row :gutter="0">
            <el-col :span="12">
                总数量 <span class="info-value">{{ data.total }}</span> {{ props.totalUnit }}
            </el-col>
            <el-col :span="12" v-if="props.type == 'cable'">
                总长度 <span class="info-value">{{ data.totalLength }}</span> km
            </el-col>
        </el-row>

        <el-row :gutter="0">
            <el-col :span="12">
                <span class="tag-running"> {{ tag[0] }} </span> <span class="info-value">{{ data.running }}</span> 条
                <span class="info-value">{{ (data.running / data.total * 100).toFixed(2) }}</span> %
            </el-col>
            <el-col :span="12">
                <span class="tag-fault"> {{ tag[1] }} </span> <span class="info-value">{{ data.fault }}</span> 条 <span
                    class="info-value">{{ (data.fault / data.total * 100).toFixed(2) }}</span> %
            </el-col>
        </el-row>

        <el-row :gutter="0">
            <el-col :span="12">
                <span class="tag-maintenance"> {{ tag[2] }} </span> <span class="info-value">{{ data.maintenance
                    }}</span> 条 <span class="info-value">{{ (data.maintenance / data.total * 100).toFixed(2) }}</span> %
            </el-col>
            <el-col :span="12">
                <span class="tag-construction"> {{ tag[3] }} </span> <span class="info-value">{{ data.construction
                    }}</span> 条
                <span class="info-value">{{ (data.construction / data.total * 100).toFixed(2) }}</span> %
            </el-col>
        </el-row>

        <el-row :gutter="0">
            <el-col :span="12">
                <span class="tag-outage"> {{ tag[4] }} </span> <span class="info-value">{{ data.outage }}</span> 条 <span
                    class="info-value">{{ (data.outage / data.total * 100).toFixed(2) }}</span>%
            </el-col>
            <el-col :span="12">
                <span class="tag-other"> {{ tag[5] }} </span> <span class="info-value">{{ data.other }}</span> 条 <span
                    class="info-value">{{ (data.other / data.total * 100).toFixed(2) }}</span>%
            </el-col>
        </el-row>

    </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
    cardTitle: {
        type: String,
        default: '标题'
    },
    totalUnit: {
        type: String,
        default: '条'
    },
    type: {
        type: String,
        default: 'cable'
    },
    data: Object,
})

watch( props.data, (newVal, oldVal) => {
    let {total, totalLength, details} = newVal;
    let inData = {total,totalLength,...details};
    initFromObject(inData);
    // console.log('data changed', props.data,"💛",inData,details);
})

// 字段标签
const tag = ref(['运行', '告警', '维护', '施工', '停运', '退役']);

const tag_default = ['运行', '告警', '维护', '施工', '停运', '退役'];
const tag_tube = ['占用', '规设', '空余', '施工', '停运', '其他'];

onMounted(() => {
    if (props.type == 'tube') {
        tag.value = tag_tube;
    } else {
        tag.value = tag_default;
    }
})

const data = reactive({
    total: 0,
    totalLength: 0,
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
})

const initFromObject = (inData) => {
    // 「方式1️⃣」
    // inData: [数量,长度 ,状态1, 状态2, 状态3, 状态4, 状态5, 状态6]
    // data.total = inData[0];
    // data.totalLength = inData[1];
    // data.running = inData[2];
    // data.fault = inData[3];
    // data.maintenance = inData[4];
    // data.construction = inData[5];
    // data.outage = inData[6];
    // data.other = inData[7];

    // 「方式2️⃣」
    data.total = inData.total;
    data.totalLength = inData.totalLength;
    // let status = inData.details;
    // console.log('status:', inData,status);
    data.running = inData.running;
    data.fault = inData.fault;
    data.maintenance = inData.maintenance;
    data.construction = inData.construction;
    data.outage = inData.outage;
    data.other = inData.other;
    // console.log('data:💢', data);
}

onMounted(() => {
    // initFromObject(props.data);  // 测试的时候注释掉

    const mockData = {
        total: 1298,
        totalLength: 128821,
        running: 698,
        fault: 120,
        maintenance: 120,
        construction: 120,
        outage: 120,
        other: 110,
    }

    initFromObject(mockData);

    // if(props!=undefined){
    //     initFromObject(props.data);
    // }
})

</script>
<style scoped>
.detail-card {
    color: rgb(37, 31, 31);
    font-weight: 700;
}

.title-box {
    height: 2rem;
    background-color: #3c8b9a;
    color: white;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    /* 水平居中 */
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 标签样式 */
.tag-running {
    color: rgb(33, 226, 75);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;

}

.tag-fault {
    color: rgb(255, 0, 0);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;

}

.tag-maintenance {
    /* color: rgb(255, 255, 0); */
    color: rgb(217 199 62);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;

}

.tag-construction {
    color: rgb(0, 0, 255);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;

}

.tag-outage {
    color: rgb(87, 86, 87);
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;

}

.tag-other {
    color: purple;
    padding: 2px 5px;
    border-radius: 5px;
    font-weight: bold;

}

.info-value {
    color: orange;
    font-weight: bold;
    margin: 0 5px;
}
</style>