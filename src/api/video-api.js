import request from '@/utils/request'

/**
 * 获取视频token
 * @returns 
 */
export function getVideoToken() {
    return request({
        url: '/smartcable-surveillance/video-token/getVideoToken',
        method: 'get',
    });
}

/**
 * 获取视频token
 * @returns 
 */
export function genVideoToken() {
    return request({
        url: '/smartcable-surveillance/video-token/genVideoToken',
        method: 'get',
    });
}

/**
 * 获取视频Resources
 * @returns 
 */
export function queryResources() {
    return request({
        url: '/smartcable-surveillance/video-resources/queryResources',
        method: 'get',
    });
}

/**
 * 获取视频Resources 测试
 * @returns 
 */
export function queryResourcesTest() {
    return request({
        url: '/smartcable-surveillance/video-resources/queryResources_test',
        method: 'get',
    });
}

/**
 * 获取无源相机数据
 *  * @returns 
 */
export function listByDeviceId(deviceId) {
    return request({
        url: '/dataapi/camera-data/listByDeviceId?deviceId='+deviceId,
        method: 'get'
    });
}