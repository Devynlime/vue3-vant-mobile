import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { mockLogin } from '@/components/smart-cable/cable-v2/tokenHandler'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'Authorization'

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
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  // i国网环境下替换请求baseurl
  if (import.meta.env.MODE === 'iguowang') {
    // @ts-expect-error GET_PORT_URL 是外部注入的全局函数，TypeScript 无法识别
    config.baseURL = GET_PORT_URL(import.meta.env.VITE_APP_API_BASE_URL)
    // @ts-expect-error GET_PORT_URL 是外部注入的全局函数，TypeScript 无法识别
    console.log(GET_PORT_URL(import.meta.env.VITE_APP_API_BASE_URL))

    // i国网环境下，使用SDK获取token并添加到请求头
    // @ts-expect-error igwMethods 是外部注入的全局函数，TypeScript 无法识别
    if (window.igwMethods) {
      try {
        // @ts-expect-error igwMethods 是外部注入的全局函数，TypeScript 无法识别
        const token = window.igwMethods.getToken()
        if (token)
          config.headers[REQUEST_TOKEN_KEY] = `Bearer ${token}`
      }
      catch (error) {
        console.error('获取i国网token失败:', error)
      }
    }
  }

  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken)
    config.headers[REQUEST_TOKEN_KEY] = `Bearer ${savedToken}`

  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
function responseHandler(response: { data: any }) {
  if (response.data.code === 401) {
    showNotify({
      type: 'danger',
      message: '登录已过期,请重新登录',
    })
    // 清除token
    localStorage.removeItem(STORAGE_TOKEN_KEY)
    mockLogin()
    return Promise.reject(new Error('登录已过期'))
  }
  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
