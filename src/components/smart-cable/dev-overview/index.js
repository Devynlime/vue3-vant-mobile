// import EchartMap from '@/views/components/EchartMap'
import { onMounted, ref } from "vue";
import {substationStatistic, feederLineStatistic, cableStatistic, channelStatistic} from "@/api/device-overview"

const substationStatisticData = ref(null)
const feederLineStatisticData = ref(null)
const cableStatisticData = ref(null)
const channelStatisticData = ref(null)
// 请求接口数据
onMounted(() => {
    substationStatistic().then(res => {
        substationStatisticData.value = res.data
        console.log("substationStatisticData:",res.data)
    })
    feederLineStatistic().then(res => {
        feederLineStatisticData.value = res.data
        console.log("feederLineStatisticData:",res.data)
        option_line.value.series[0].data[0].value = feederLineStatisticData?.value.erectionMethod[3].total
        option_line.value.series[0].data[1].value = feederLineStatisticData?.value.erectionMethod[2].total
        option_line.value.series[0].data[2].value = feederLineStatisticData?.value.erectionMethod[0].total
        console.log("option_line:",option_line.value)
        chart_line.value.setOption(option_line.value, true);
        
    })
    cableStatistic().then(res => {
        cableStatisticData.value = res.data
        option_cable.value.series[0].data[0].value = cableStatisticData?.value.cableSectionCount
        option_cable.value.series[0].data[1].value = cableStatisticData?.value.cableJointCount
        option_cable.value.series[0].data[2].value = cableStatisticData?.value.cableTerminationCount
        chart_cable.value.setOption(option_cable.value, true);
        console.log("cableStatisticData:",res.data)
    })
    channelStatistic().then(res => {
        channelStatisticData.value = res.data
        option_channel.value.series[0].data[0].value = channelStatisticData?.value.cablePipeSectionLength/1000
        option_channel.value.series[0].data[1].value = channelStatisticData?.value.cableTunnelSectionLength/1000
        option_channel.value.series[0].data[2].value = channelStatisticData?.value.utilityTunnelLength/1000
        chart_channel.value.setOption(option_channel.value, true);
        console.log("channelStatisticData:",res.data)
    })
})

export {
    substationStatisticData,
    feederLineStatisticData,
    cableStatisticData,
    channelStatisticData,
}