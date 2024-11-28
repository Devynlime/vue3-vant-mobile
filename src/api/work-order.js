import request from '@/utils/request'

//确认工单
export function workOrderUpdate(data) {
    return request({
        url: '/dataapi/work-order/update',
        method: 'post',
        data: data
    })
}

//工单查询列表
export function workOrderSearchList(data,pageSize,pageNum) {
    return request({
        url: '/dataapi/work-order/list?pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'post',
        data: data
    })
}