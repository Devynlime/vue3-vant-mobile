import request from '@/utils/request'


//获取电缆段
export function searchCableSeggmentList(segmentId) {
    return request({
        url: '/dataapi/cable-segment-topology/searchList',
        method: 'post',
        data:{'segmentId':segmentId}
    })
}

// 获取全部电缆井Symbol信息
export function listManholeSymbol(data) {
    return request({
        url: '/dataapi/AstUs-data/listManholeSymbol',
        method: 'post',
        data: data
    })
}

// 根据通道类型获取通道绘制信息
export function channelSymbol(channelType) {
    return request({
        url: '/dataapi/channel-data/channelSymbol?channelType=' + channelType,
        method: 'get'
    })
}

// 根据类型获取通道绘制信息
export function getResourceTree(type,key) {
    return request({
        url: '/dataapi/line-data/getResourceTree?type=' + type+'&key='+key,
        method: 'get'
    })
}


// 根据通道名称获取通道列表
export function searchChannel(channelName,channelType,pageSize,pageNum) {
    return request({
        url: '/dataapi/channel-data/searchChannel?channelName=' + channelName+'&channelType='+channelType+'&pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'get'
    })
}


// 查询线路信息
export function searchLineList(data,pageSize,pageNum) {
    return request({
        url: '/dataapi/AstUs-data/searchLineList?pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'post',
        data: data
    })
}


// 根据电缆段名称获取电缆段画线信息
export function lineSegmentSymbolByName(segmentName) {
    return request({
        url: '/dataapi/AstUs-data/lineSegmentSymbolByName',
        method: 'post',
        data: segmentName
    })
}
//电缆段查询
export function SearchLineSegments(data,pageSize,pageNum) {
    return request({
        url: '/dataapi/AstUs-data/SearchLineSegments?pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'post',
        data: data
    })
}

// 获取全部电缆井信息
export function manholesList(data) {
    return request({
        url: '/dataapi/AstUs-data/manholesList',
        method: 'post',
        data: data
    })
}

//更新坐标信息
export function updateCoordinatesById(data) {
    return request({
        url: '/dataapi/AstUs-data/updateCoordinatesById',
        method: 'post',
        data: data
    })
}

//更新电缆井信息
export function astManholeUpdate(data) {
    return request({
        url: '/dataapi/manhole-device-data/astManholeUpdate',
        method: 'post',
        data: data
    })
}


// 根据名称获取电缆井信息
export function selectManholeByName(manholeName,pageSize,pageNum) {
    return request({
        url: '/dataapi/AstUs-data/selectManholeByName?name=' + manholeName+'&pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'get'
    })
}

// 根据名称获取电缆井图片信息
export function selectManholePicByName(manholeName) {
    return request({
        url: '/dataapi/AstUs-data/selectManholePicByName?name=' + manholeName,
        method: 'get'
    })
}

//根据名称获取某个电缆井信息
export function getManholeByCableName(manholeName){
    return request({
        url: '/dataapi/AstUs-data/getManholeByCableName?manholeName=' + manholeName,
        method: 'get'
    })
}

export function searchCurrentData(data,pageSize,pageNum) {
    return request({
        url: '/dataapi/manhole-device-data/searchCurrentData?pageSize='+pageSize+'&pageNum='+pageNum,
        method: 'post',
        data: data
    })
}

export function selectCurrentDataByManholeName(manholeName) {
    return request({
        url: '/dataapi/manhole-device-data/selectCurrentDataByManholeName?manholeName=' + manholeName,
        method: 'get'
    })
}

export function getManholeDeviceInfoStatistic() {
    return request({
        url: '/dataapi/manhole-device-data/getManholeDeviceInfoStatistic',
        method: 'get'
    })
}

export function getManholeDeviceByKey(deviceId ,manholeId) {
    return request({
        url: '/dataapi/manhole-device-data/getManholeDeviceByKey?deviceId=' + deviceId + '&manholeId=' + manholeId,
        method: 'get'
    })
}
