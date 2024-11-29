import stationData from '@/config/station-data.json'

// 从后端获取站点数据
export const fetchStationData = async () => {
  try {
    // TODO: 后期可以改为从后端 API 获取数据
    // const response = await axios.get('/api/stations')
    // return response.data
    return stationData
  } catch (error) {
    console.error('获取站点数据失败:', error)
    return stationData // 失败时使用本地数据作为后备
  }
}

// 创建树加载器
export const createTreeLoader = (treeData) => {
  return (node, resolve) => {
    if (node.level === 0) {
      return resolve([treeData.root])
    }

    if (node.level === 1) {
      return resolve(treeData.companies)
    }

    if (node.level === 2) {
      const company = treeData.companies.find(c => c.key === node.data.key)
      return resolve(company?.channels || [])
    }

    if (node.level === 3) {
      const company = treeData.companies.find(c => c.channels?.some(ch => ch.key === node.data.key))
      const channel = company?.channels?.find(ch => ch.key === node.data.key)
      return resolve(channel?.devices || [])
    }

    return resolve([])
  }
}

// 获取默认选中的节点
export const getDefaultCheckedNodes = (treeData) => {
  const nodes = []
  treeData.companies.forEach(company => {
    company.channels?.forEach(channel => {
      channel.devices?.forEach(device => {
        if (device.channel1) {
          nodes.push({
            key: device.key,
            device_id: device.device_id,
            channel1: device.channel1,
            channel2: device.channel2,
          })
        }
      })
    })
  })
  return nodes
} 