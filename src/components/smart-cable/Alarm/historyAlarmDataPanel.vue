<template>
    <div style="overflow-x:hidden;overflow-y: auto;height: calc(100vh - 616px);padding-left: 4px;">
        <el-table :data="tableData" style="width: 100%;overflow:hidden;" :show-header="false" @click="handleClick">
            <el-table-column prop="name" width="120px" :title="name"/>
            <el-table-column prop="message"/>
        </el-table>
    </div>
</template>

<script setup>
import {searchAlarmMessageHistory} from '@/api/alarmMessage.js'
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();

const tableData = ref([])

onMounted(()=>{
    getsearchAlarmMessageHistory()
})

const handleClick = (row) => {
    console.log("------------>>>>>>",row)
    router.push("/main/EarlyWarningManagement/AlarmMessageSearchList/3-2")
}

const getsearchAlarmMessageHistory = () =>{
    searchAlarmMessageHistory({},14,1).then(res => {
        tableData.value = res.rows
        console.log("history:",res)
    })
}
</script>

<style scoped>
:deep(.el-table .cell) {
    box-sizing: border-box;
    line-height: 23px;
    overflow: hidden;
    overflow-wrap: break-word;
    padding: 0 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>