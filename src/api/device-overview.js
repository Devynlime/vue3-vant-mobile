import request from '@/utils/request'
// import request from '@/utils/request-prod'
// import requestDev from '@/utils/request-dev'

/**
 * 变电站统计
 * @returns 
 */
export function substationStatistic() {
    return request({
        url: '/dataapi/device-overview/substationStatistic',
        method: 'get',
    });
}

/**
 * 线路统计
 * @returns 
 */
export function feederLineStatistic() {
    return request({
        url: '/dataapi/device-overview/feederLineStatistic',
        method: 'get',
    });
}

/**
 * 电缆统计
 * @returns 
 */
export function cableStatistic() {
    return request({
        url: '/dataapi/device-overview/cableStatistic',
        method: 'get',
    });
}

/**
 * 通道统计
 * @returns 
 */
export function channelStatistic() {
    return request({
        url: '/dataapi/device-overview/channelStatistic',
        method: 'get',
    });
}

/**
 * 总览统计
 * 
 * @returns 
 */
export function overviewStatistic() {
    return request({
        url: '/v3/data/overview/get',
        method: 'get',
    });
}