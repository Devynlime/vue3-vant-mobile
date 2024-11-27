import request from '@/utils/request'

/**
 * 获取设备总览统计数据
 * @returns {Promise} 设备总览统计数据
 */
export function overviewStatistic() {
  return request({
    url: '/device/overview/statistic',
    method: 'get',
  })
}

/**
 * 获取设备总览列表数据
 * @returns {Promise} 设备总览列表数据
 */
export function overviewList() {
  return request({
    url: '/device/overview/list',
    method: 'get',
  })
}

/**
 * 获取设备总览详情数据
 * @returns {Promise} 设备总览详情数据
 */
export function overviewDetail() {
  return request({
    url: '/device/overview/detail',
    method: 'get',
  })
}

/**
 * 获取设备总览图表数据
 * @returns {Promise} 设备总览图表数据
 */
export function overviewChart() {
  return request({
    url: '/device/overview/chart',
    method: 'get',
  })
}

/**
 * 获取设备总览地图数据
 * @returns {Promise} 设备总览地图数据
 */
export function overviewMap() {
  return request({
    url: '/device/overview/map',
    method: 'get',
  })
}
