<template>
    <div class="detail-card">
        <!-- 标题部分 -->
        <div class="card-header">
            <div class="title-box">{{ cardTitle }}</div>
        </div>

        <!-- 网格布局内容区 -->
        <div class="card-content">
            <!-- 总数据行 -->
            <div class="grid-row summary-row">
                <div class="grid-cell">
                    总数量 <span class="info-value">{{ data.total }}</span> {{ totalUnit }}
                </div>
                <div class="grid-cell" v-if="type === 'cable'">
                    总长度 <span class="info-value">{{ data.totalLength }}</span> km
                </div>
            </div>

            <!-- 状态数据网格 -->
            <div class="status-grid">
                <div class="grid-cell">
                    <span class="tag-running">{{ tag[0] }}</span>
                    <span class="info-value">{{ data.running }}</span>条
                    <span class="info-value">{{ calculatePercentage(data.running, data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-fault">{{ tag[1] }}</span>
                    <span class="info-value">{{ data.fault }}</span>条
                    <span class="info-value">{{ calculatePercentage(data.fault, data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-maintenance">{{ tag[2] }}</span>
                    <span class="info-value">{{ data.maintenance }}</span>条
                    <span class="info-value">{{ calculatePercentage(data.maintenance, data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-construction">{{ tag[3] }}</span>
                    <span class="info-value">{{ data.construction }}</span>条
                    <span class="info-value">{{ calculatePercentage(data.construction, data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-outage">{{ tag[4] }}</span>
                    <span class="info-value">{{ data.outage }}</span>条
                    <span class="info-value">{{ calculatePercentage(data.outage, data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-other">{{ tag[5] }}</span>
                    <span class="info-value">{{ data.other }}</span>条
                    <span class="info-value">{{ calculatePercentage(data.other, data.total) }}</span>%
                </div>
            </div>
        </div>
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
    data: {
        type: Object,
        required: true
    }
});

// 字段标签
const tag = ref(['运行', '告警', '维护', '施工', '停运', '退役']);
const tag_default = ['运行', '告警', '维护', '施工', '停运', '退役'];
const tag_tube = ['占用', '规设', '空余', '施工', '停运', '其他'];

const data = reactive({
    total: 0,
    totalLength: 0,
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
});

const initFromObject = (inData) => {
    if (!inData) return;
    
    data.total = inData.total || 0;
    data.totalLength = inData.totalLength || 0;
    data.running = inData.running || 0;
    data.fault = inData.fault || 0;
    data.maintenance = inData.maintenance || 0;
    data.construction = inData.construction || 0;
    data.outage = inData.outage || 0;
    data.other = inData.other || 0;
};

watch(() => props.data, (newVal) => {
    if (newVal) {
        const { total, totalLength, details } = newVal;
        const inData = { total, totalLength, ...details };
        initFromObject(inData);
    }
}, { deep: true });

onMounted(() => {
    if (props.type === 'tube') {
        tag.value = tag_tube;
    } else {
        tag.value = tag_default;
    }

    if (props.data) {
        initFromObject(props.data);
    } else {
        // Mock data for testing
        const mockData = {
            total: 1298,
            totalLength: 128821,
            running: 698,
            fault: 120,
            maintenance: 120,
            construction: 120,
            outage: 120,
            other: 110,
        };
        initFromObject(mockData);
    }
});

// 添加一个安全的百分比计算方法
const calculatePercentage = (value, total) => {
    if (!total || total === 0) return '0.00';
    return ((value / total) * 100).toFixed(2);
};
</script>

<style scoped>
.detail-card {
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 15px;
    padding: 10px;
    box-sizing: border-box;
    color: rgb(37, 31, 31);
    font-weight: 700;
    background-color: var(--el-bg-color);
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);
}

.card-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
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

.card-content {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 15px;
}

.summary-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.status-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
}

.grid-cell {
    padding: 8px;
    display: flex;
    align-items: center;
    background-color: rgba(60, 139, 154, 0.05);
    border-radius: 4px;
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

@media screen and (max-width: 768px) {
    .detail-card {
        gap: 10px;
        padding: 5px;
    }

    .status-grid {
        gap: 5px;
    }

    .grid-cell {
        padding: 5px;
        font-size: 14px;
    }

    .title-box {
        font-size: 14px;
        padding: 8px;
        height: 2rem;
    }
}
</style>