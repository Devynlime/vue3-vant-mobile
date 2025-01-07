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
                    总数量 <span class="info-value">{{ props.data.total }}</span> {{ totalUnit }}
                </div>
                <div class="grid-cell" v-if="type === 'cable'">
                    总长度 <span class="info-value">{{ props.data.totalLength }}</span> km
                </div>
            </div>

            <!-- 状态数据网格 -->
            <div class="status-grid">
                <div class="grid-cell">
                    <span class="tag-running">{{ tag[0] }}</span>
                    <span class="info-value">{{ props.data.details?.running || 0 }}</span>条
                    <span class="info-value">{{ calculatePercentage(props.data.details?.running || 0, props.data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-fault">{{ tag[1] }}</span>
                    <span class="info-value">{{ props.data.details?.fault || 0 }}</span>条
                    <span class="info-value">{{ calculatePercentage(props.data.details?.fault || 0, props.data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-maintenance">{{ tag[2] }}</span>
                    <span class="info-value">{{ props.data.details?.maintenance || 0 }}</span>条
                    <span class="info-value">{{ calculatePercentage(props.data.details?.maintenance || 0, props.data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-construction">{{ tag[3] }}</span>
                    <span class="info-value">{{ props.data.details?.construction || 0 }}</span>条
                    <span class="info-value">{{ calculatePercentage(props.data.details?.construction || 0, props.data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-outage">{{ tag[4] }}</span>
                    <span class="info-value">{{ props.data.details?.outage || 0 }}</span>条
                    <span class="info-value">{{ calculatePercentage(props.data.details?.outage || 0, props.data.total) }}</span>%
                </div>
                <div class="grid-cell">
                    <span class="tag-other">{{ tag[5] }}</span>
                    <span class="info-value">{{ props.data.details?.other || 0 }}</span>条
                    <span class="info-value">{{ calculatePercentage(props.data.details?.other || 0, props.data.total) }}</span>%
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

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

watch(() => props.data, (newVal) => {
    if (newVal) {
        tag.value = props.type === 'tube' ? tag_tube : tag_default;
    }
}, { deep: true });

onMounted(() => {
    tag.value = props.type === 'tube' ? tag_tube : tag_default;
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
    align-items: center; /* 垂直居中 */
}

.grid-cell {
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: rgba(60, 139, 154, 0.05);
    border-radius: 4px;
    overflow-x: scroll;
}

/* 标签基础样式 */
[class^="tag-"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 35px;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
}

.grid-cell span:first-child {
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
    border-radius: 5px;
    font-weight: bold;
}

.tag-maintenance {
    color: rgb(217 199 62);
    border-radius: 5px;
    font-weight: bold;
}

.tag-construction {
    color: rgb(0, 0, 255);
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