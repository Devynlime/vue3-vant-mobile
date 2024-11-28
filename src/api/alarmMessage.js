import request from '@/utils/request'


/**
 * 获取模拟工单列表
 * @returns 
 */
export function getGroupAlarmMessage(day) {
    return request({
        url: '/dataapi/alarm-message/getGroupAlarmMessage?day='+day,
        method: 'get',
    });
}

/**
 * 获取未确认告警信息，设备唯一，用于地图定位 废弃
 * @returns 
 */
export function getDistinctAlarmDeviceId() {
    return request({
        url: '/dataapi/alarm-message/getDistinctAlarmDeviceId',
        method: 'get',
    });
}


/**
 * 获取未确认工单信息，用于地图定位
 * @returns 
 */
export function getAlarmMessage(day) {
    return request({
        url: '/dataapi/alarm-message/getAlarmMessage?day='+day,
        method: 'get',
    });
}

/**
 * 获取告警信息统计数据
 * @returns 
 */
export function getAlarmStatistic() {
    return request({
        url: '/dataapi/work-order/getAlarmStatistic',//'/dataapi/alarm-message/getAlarmStatistic',
        method: 'get',
    });
}

/**
 * 获取告警配信信息
 * @param {*} alarmType  告警类型
 * @param {*} serviceId  数据类型 analog discrete
 * @returns 
 */
export function getAlarmConfig(alarmType, serviceId){
    return request({
        url: '/dataapi/alarm-message/getAlarmConfig?alarmType='+alarmType+'&serviceId='+serviceId,
        method: 'get',
    });
}
/**
 * 保存告警配置信息
 * @param {*} data 
 * @returns 
 */
export function setAlarmConfig(data){
    return request({
        url: '/dataapi/alarm-message/setAlarmConfig',
        method: 'post',
        data: data
    })
}
/**
 * 告警历史数据列表
 * @param {*} data 
 * @returns 
 */
export function searchAlarmMessageHistory(data,pageSize,pageNum){
    return request({
        url: '/dataapi/alarm-message/searchAlarmMessageHistory?pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'post',
        data: data
    })
}


/**
 * 获取key的所有hash数据
 * @param {*} serviceId 
 * @returns 
 */
export function getAlarmAllConfig(serviceId){
    return request({
        url: '/dataapi/alarm-message/getAlarmAllConfig?serviceId='+serviceId,
        method: 'get',
    });
}

/**
 * 查询历史告警信息
 * @param {*} data 
 * @returns 
 */
export function searchAlarmMessage(data,pageSize,pageNum){
    return request({
        url: '/dataapi/alarm-message/searchAlarmMessage?pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'post',
        data: data
    })
}


/**
 * 获取同一设备，数据类型，告警类型，日期的所有告警信息
 * @param {*} data 
 * @returns 
 */
export function selectWorkOrderAlarmMessageDetails(data,pageSize,pageNum){
    return request({
        url: '/dataapi/alarm-message/selectWorkOrderAlarmMessageDetails?pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'post',
        data: data
    })
}