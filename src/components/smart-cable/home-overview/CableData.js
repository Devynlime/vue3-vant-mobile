import { reactive } from "vue";
import {
  cableStatistic,
  channelStatistic,
  feederLineStatistic,
  substationStatistic,
} from "@/api/device-overview";

export const lineData = reactive({
  total: 0,
  totalLength: 0,
  details: {
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
  },
});
export const segmentData = reactive({
  total: 0,
  details: {
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
  },
});
export const cableEndData = reactive({
  total: 0,
  details: {
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
  },
});
export const wellData = reactive({
  total: 0,
  details: {
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
  },
});
export const cableWayData = reactive({
  total: 0,
  details: {
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
  },
});
export const cableTubeData = reactive({
  total: 0,
  details: {
    running: 0,
    fault: 0,
    maintenance: 0,
    construction: 0,
    outage: 0,
    other: 0,
  },
});

// 添加工具函数来格式化长度
const formatLength = (length) => {
  if (!length) return "0";
  // 如果长度超过10000，显示为xx.xx万
  if (length > 10000) {
    return (length / 10000).toFixed(2) + "万";
  }
  // 否则保留2位小数
  return length.toFixed(2);
};

const fetchOverviewStatistic = async () => {
  try {
    // 并行请求所有数据
    const [cableRes, channelRes, feederRes] = await Promise.all([
      cableStatistic(),
      channelStatistic(),
      feederLineStatistic(),
    ]);

    // 处理电缆相关数据
    if (cableRes?.data) {
      // 处理电缆线路数据
      const { state = [] } = cableRes.data;
      const stateCount = state.reduce((acc, curr) => {
        acc[curr._id["psrState#Name"]] = curr.total;
        return acc;
      }, {});

      Object.assign(lineData, {
        total: cableRes.data.cableCount || 0,
        totalLength: formatLength(cableRes.data.cableLength || 0),
        details: {
          running: stateCount["在运"] || 0,
          fault: 0,
          maintenance: 0,
          construction: stateCount["未投运"] || 0,
          outage: 0,
          other: stateCount["退役"] || 0,
        },
      });

      // 处理电缆段数据
      Object.assign(segmentData, {
        total: cableRes.data.cableSectionCount || 0,
        details: {
          running: cableRes.data.cableSectionStateObj?.["在运"] || 0,
          fault: 0,
          maintenance: 0,
          construction: cableRes.data.cableSectionStateObj?.["未投运"] || 0,
          outage: 0,
          other: cableRes.data.cableSectionStateObj?.["退役"] || 0,
        },
      });

      // 处理电缆接头数据
      Object.assign(cableEndData, {
        total: cableRes.data.cableJointCount || 0,
        details: {
          running: cableRes.data.cableJointStateCountObj?.["在运"] || 0,
          fault: 0,
          maintenance: cableRes.data.cableJointStateCountObj?.["现场留用"] || 0,
          construction: cableRes.data.cableJointStateCountObj?.["未投运"] || 0,
          outage: 0,
          other: cableRes.data.cableJointStateCountObj?.["退役"] || 0,
        },
      });
    }

    // 处理通道相关数据
    if (channelRes?.data) {
      // 处理电缆井数据
      Object.assign(wellData, {
        total: channelRes.data.manholeCount || 0,
        details: {
          running: channelRes.data.manhole?.["01"] || 0, // 普通井
          fault: channelRes.data.manhole?.["03"] || 0, // 事故井
          maintenance: channelRes.data.manhole?.["04"] || 0, // 检修井
          construction: channelRes.data.manhole?.["05"] || 0, // 分支井
          outage: 0,
          other: channelRes.data.manhole?.["00"] || 0, // 其他类型
        },
      });

      // 处理电缆通道数据
      const totalChannelLength =
        (channelRes.data.cableTunnelSectionLength || 0) +
        (channelRes.data.utilityTunnelLength || 0);

      Object.assign(cableWayData, {
        total: channelRes.data.cableChannelCount || 0,
        totalLength: formatLength(totalChannelLength),
        details: {
          running: channelRes.data.cableChannelCount || 0, // 暂时都算作运行中
          fault: 0,
          maintenance: 0,
          construction: 0,
          outage: 0,
          other: 0,
        },
      });

      // 处理电缆排管孔数据
      Object.assign(cableTubeData, {
        total: channelRes.data.cableChannelCount || 0, // 使用通道数作为管孔数
        totalLength: formatLength(channelRes.data.cablePipeSectionLength || 0),
        details: {
          running: channelRes.data.cableChannelCount || 0, // 暂时都算作运行中
          fault: 0,
          maintenance: 0,
          construction: 0,
          outage: 0,
          other: 0,
        },
      });
    }
  } catch (error) {
    console.error("数据加载失败:", error);
  }
};
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
fetchOverviewStatistic();
