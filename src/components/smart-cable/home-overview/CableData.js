import { reactive } from 'vue'
import {overviewStatistic} from '@/api/device-overview'

export const lineData = reactive({
    total: 0,
    totalLength: 0,
    details: {
        running: 0,
        fault: 0,
        maintenance: 0,
        construction: 0,
        outage: 0,
        other: 0
    }
})
export const segmentData = reactive({
    total: 0,
    details: {
        running: 0,
        fault: 0,
        maintenance: 0,
        construction: 0,
        outage: 0,
        other: 0
    }
})
export const cableEndData = reactive({
    total: 0,
    details: {
        running: 0,
        fault: 0,
        maintenance: 0,
        construction: 0,
        outage: 0,
        other: 0
    }
})
export const wellData = reactive({
    total: 0,
    details: {
        running: 0,
        fault: 0,
        maintenance: 0,
        construction: 0,
        outage: 0,
        other: 0
    }
})
export const cableWayData = reactive({
    total: 0,
    details: {
        running: 0,
        fault: 0,
        maintenance: 0,
        construction: 0,
        outage: 0,
        other: 0
    }
})
export const cableTubeData = reactive({
    total: 0,
    details: {
        running: 0,
        fault: 0,
        maintenance: 0,
        construction: 0,
        outage: 0,
        other: 0
    }
})

const fetchOverviewStatistic = async () => {
    try {
        const res = await overviewStatistic()
        // 添加数据校验
        if (!res || !res.data) {
            console.error('API返回数据格式错误:', res)
            return
        }

        // 从data中解构出需要的数据
        const {
            cableLine = {},
            cableSegment = {},
            cableJoint = {},
            manhole = {},
            cablePipe = {},
            cableChannel = {}
        } = res.data

        Object.assign(lineData, {
            total: cableLine.num || 0,
            totalLength: cableLine.length || 0,
            details: {
                running: cableLine.statusAndCount['在运'] || 0,
                fault: 0,
                maintenance: cableLine.statusAndCount['现场留用'] || 0,
                construction: cableLine.statusAndCount['未投运'] || 0,
                outage: 0,
                other: cableLine.statusAndCount['退役'] || 0
            }
        })
        // 电缆段
        Object.assign(segmentData, {
            total: cableSegment.num || 0,
            details: {
                running: cableSegment.statusAndCount['在运'] || 0,
                fault: 0,
                maintenance: cableSegment.statusAndCount['未投运'] || 0,
                construction: 0,
                outage: 0,
                other: cableSegment.statusAndCount['退役'] || 0
            }
        })
        // 电缆接头
        Object.assign(cableEndData, {
            total: cableJoint.num || 0,
            details: {
                running: cableJoint.statusAndCount['在运'] || 0,
                fault: 0,
                maintenance: cableJoint.statusAndCount['现场留用'] || 0,
                construction: cableJoint.statusAndCount['未投运'] || 0,
                outage: 0,
                other: cableJoint.statusAndCount['退役'] || 0
            }
        })
        // 电缆井
        Object.assign(wellData, {
            total: manhole.num || 0,
            totalLength: manhole.length || 0,
            details: {
                running: manhole.statusAndCount['在运'] || 0,
                fault: 0,
                maintenance: 0,
                construction: 0,
                outage: 0,
                other: 0
            }
        })
        // 电缆通道
        Object.assign(cableWayData, {
            total: cableChannel.num || 0,
            totalLength: cableChannel.length || 0,
            details: {
                running: cableChannel.statusAndCount['在运'] || 0,
                fault: 0,
                maintenance: 0,
                construction: 0,
                outage: 0,
                other: 0
            }
        })
        // 电缆排管孔
        Object.assign(cableTubeData, {
            total: cablePipe.num || 0,
            totalLength: cablePipe.length || 0,
            details: {
                running: cablePipe.statusAndCount['在运'] || 0,
                fault: 0,
                maintenance: 0,
                construction: 0,
                outage: 0,
                other: 0
            }
        })
    } catch (error) {
        console.error('API请求错误:', error)
    }
}
// "data": {
//     "cableJoint": {
//         "name": "电缆端/中间接头",
//         "num": 3612,
//         "length": 0,
//         "statusAndCount": {
//             "在运": 2724,
//             "现场留用": 1,
//             "退役": 564,
//             "未投运": 323
//         }
//     },
//     "substationGroup": {
//         "220KV-substation": 40,
//         "35KV-substation": 74,
//         "110KV-substation": 99
//     },
//     "manhole": {
//         "name": "电缆井",
//         "num": 4749,
//         "length": 0,
//         "statusAndCount": {
//             "在运": 4749
//         }
//     },
//     "cablePipe": {
//         "name": "电缆排管孔",
//         "num": 4085,
//         "length": 152591,
//         "statusAndCount": {
//             "在运": 4085
//         }
//     },
//     "cableChannel": {
//         "name": "电缆通道",
//         "num": 190,
//         "length": 0,
//         "statusAndCount": {
//             "在运": 190
//         }
//     },
//     "cableLine": {
//         "name": "电缆井线路线路",
//         "num": 1514,
//         "length": 146739,
//         "statusAndCount": {
//             "在运": 1278,
//             "现场留用": 6,
//             "退役": 91,
//             "未投运": 139
//         }
//     },
//     "cableSegment": {
//         "name": "电缆段",
//         "num": 39267,
//         "length": 5248600,
//         "statusAndCount": {
//             "在运": 30796,
//             "退役": 7337,
//             "未投运": 1134
//         }
//     }
fetchOverviewStatistic()
