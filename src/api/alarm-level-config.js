import request from '@/utils/request'


/**
 * 列表
 * @returns 
 */
export function listData() {
    return request({
        url: '/dataapi/alarm-level-config/list',
        method: 'get',
    });
}
/**
 * 
 * @returns 获取告警类别数量统计
 */
export function alarmTypeGroupCount(radioRange){
    return request({
        url: '/dataapi/alarm-level-config/alarmTypeGroupCount?radioRange='+radioRange,
        method: 'get',
    });
}

// 更新
export function updateData(data) {
    return request({
        url: '/dataapi/alarm-level-config/update',
        method: 'post',
        data: data
    })
}