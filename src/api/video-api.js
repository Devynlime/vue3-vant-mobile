import request from '@/utils/request-prod'

/**
 * 获取视频token
 * @returns
 */
export function getVideoToken() {
  return request({
    url: '/smartcable-surveillance/video-token/getVideoToken',
    method: 'get',
  })
}

/**
 * 获取视频Resources
 * @returns
 */
export function queryResources() {
  return request({
    url: '/smartcable-surveillance/video-resources/queryResources',
    method: 'get',
  })
}

/**
 * 获取视频Resources 测试
 * @returns
 */
export function queryResourcesTest() {
  return request({
    url: '/smartcable-surveillance/video-resources/queryResources_test',
    method: 'get',
  })
}
