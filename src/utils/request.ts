import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'ThirdToken'
export const IGW_TOKEN_KEY = 'Authorization'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: 'Authorization verification failed',
      })
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  // 根据不同环境处理请求配置
  // @ts-expect-error GET_PORT_URL 是外部注入的全局函数，TypeScript 无法识别
  config.baseURL = GET_PORT_URL(import.meta.env.VITE_APP_API_BASE_URL)
  // @ts-expect-error GET_PORT_URL 是外部注入的全局函数，TypeScript 无法识别
  console.log(GET_PORT_URL(import.meta.env.VITE_APP_API_BASE_URL))

  // i国网环境下，使用SDK获取token并添加到请求头
  try {
    // console.log('igwMethods.getToken()', igwMethods.getToken()) // 通过该方法获取token会报错
    /* 旧的获取i国网token方法
    const igwUser = localStorage.getItem(IGW_USER_KEY)
    if (igwUser) {
      const igwToken = JSON.parse(igwUser).user.token
      // console.log('igwToken', igwToken)
      config.headers[IGW_TOKEN_KEY] = igwToken
    }
    */

    // @ts-expect-error igwMethods 是外部注入的全局函数，TypeScript 无法识别
    const igwToken = igwMethods.getToken()
    config.headers[IGW_TOKEN_KEY] = igwToken
  }
  catch (error) {
    console.error('获取i国网token失败:', error)
  }

  const cableToken = localStorage.getItem(STORAGE_TOKEN_KEY) // 从本地存储中获取token
  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (cableToken)
    config.headers[REQUEST_TOKEN_KEY] = `Bearer ${cableToken}`

  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
/**
 * 响应拦截器处理函数
 * @param response - 响应对象
 * @returns 处理后的响应数据
 */
async function responseHandler(response: { data: any }) {
  // 处理401未授权的情况
  if (response.data.code === 401) {
    // 显示登录过期提示
    showNotify({
      type: 'danger',
      message: '登录已过期,请重新登录',
    })

    // 清除本地存储的token
    localStorage.removeItem(STORAGE_TOKEN_KEY)

    // 跳转到登录页面
    location.replace('/login')
  }
  // 返回响应数据
  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
