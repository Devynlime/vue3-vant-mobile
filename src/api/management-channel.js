import request from '@/utils/request-prod'

// 根据managementChannelId获取
export function searchChannelList(managementChannelId, operationUnit) {
  return request({
    url: `/dataapi/management-channel/searchChannelList?managementChannelId=${managementChannelId}&operationUnit=${operationUnit}`,
    method: 'get',
  })
}

// 在资源树中搜索通道信息
export function searchChannelInfoList(data) {
  return request({
    url: '/dataapi/management-channel/searchChannelInfoList',
    method: 'post',
    data,
  })
}
// 在资源树中搜索通道信息
export function searchManagementChannelList(data) {
  return request({
    url: '/dataapi/management-channel/searchManagementChannelList',
    method: 'post',
    data,
  })
}

// 获取通道中的第一个电缆井
export function getManagementChannelOneManhole(data) {
  return request({
    url: '/dataapi/management-channel/getManagementChannelOneManhole',
    method: 'post',
    data,
  })
}

// 在资源树中搜索通道信息
export function searchChannelManholeList(data) {
  return request({
    url: '/dataapi/management-channel/searchChannelManholeList',
    method: 'post',
    data,
  })
}

// 获取全部电缆井信息
export function manholesList(data) {
  return request({
    url: '/dataapi/tyManhole-data/manholesList',
    method: 'post',
    data,
  })
}

// 更新坐标信息
export function updateCoordinatesById(data) {
  return request({
    url: '/dataapi/tyManhole-data/updateCoordinatesById',
    method: 'post',
    data,
  })
}

// 获取通道下全部电缆井及通道段列表信息
export function getChannelManholeAndChildChannel(data) {
  return request({
    url: '/dataapi/management-channel/getChannelManholeAndChildChannel',
    method: 'post',
    data,
  })
}

// 获取电缆井台账信息
export function getManholeById(manholeId, operationUnit) {
  return request({
    url: `/dataapi/tyManhole-data/getManholeById?manholeId=${manholeId}&operationUnit=${operationUnit}`,
    method: 'get',
  })
}

// 获取电缆井相关的通道信息
export function getChannels(manholeId, operationUnit) {
  return request({
    url: `/dataapi/tyManhole-data/getChannels?manholeId=${manholeId}&operationUnit=${operationUnit}`,
    method: 'get',
  })
}

// 获取电缆井相关的通道信息
export function getCameraPicture(deviceId) {
  return request({
    url: `/dataapi/tyManhole-data/getCameraPicture?deviceId=${deviceId}`,
    method: 'get',
  })
}
