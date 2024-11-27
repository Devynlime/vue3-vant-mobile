/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: cuiht
 * @Date: 2021-03-31 15:36:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-25 10:30:19
 * @Description: 微应用sdk
 */
const appCode = 'DIANLANJINGYIHUA'
const appServerCode = 'getNode'
// 返回主应用
const MAIN_BACKMAIN = function () {
  location.replace(localStorage.getItem('IGUOWANG_MAINAPPLICATION_PATH'))
}
// 获取用户数据
const GET_MAIN_USER = function () {
  let _data = null
  try {
    _data = JSON.parse(
      localStorage.getItem('IGUOWANG_PEIWANGYITIHUA_MAINAPPLICATION_USER')
    )
  } catch (error) {
    console.log('尝试获取token信息失败 (👀--GET_MAIN_USER)', error)
  }
  //   if (cb) cb(_data)

  return _data
}
// 获取已打开的微应用数据
const GET_MICRO_INFO = function (cb) {
  let _data = null
  try {
    _data = JSON.parse(
      localStorage.getItem('IGUOWANG_PEIWANGYITIHUA_MICROAPPLICATION_INFO')
    )
  } catch (error) {}
  if (cb)
cb(_data)

  return _data
}
// 获取安全连接prot
const GET_MAIN_PORT = function (cb) {
  let _data = null
  try {
    _data = JSON.parse(
      localStorage.getItem('IGUOWANG_PEIWANGYITIHUA_MAINAPPLICATION_PORT')
    )
  } catch (error) {}
  if (cb)
cb(_data)

  return _data
}
// 转换安全连接
const GET_PORT_URL = function GET_PORT_URL(API) {
  const _data = localStorage.getItem(
    'IGUOWANG_PEIWANGYITIHUA_MAINAPPLICATION_PORT'
  )
  return API.replace('#{port}', _data)
}
