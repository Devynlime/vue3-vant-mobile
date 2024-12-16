import request from '@/utils/request'

import { IGW_USER_KEY } from '@/stores/mutation-type'

export interface LoginData {
  email: string
  username: string
  password: string
}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  name?: string
  avatar?: string
  token?: string
}

export function login(data: LoginData): Promise<any> {
  return request.post<LoginRes>('/auth/login', data)
}

export function logout() {
  return request.post('/user/logout')
}

export function getUserInfo() {
  const userStorage = localStorage.getItem(IGW_USER_KEY)
  // console.log('userStorage', userStorage)
  return Promise.resolve(JSON.parse(userStorage).user)
}

export function getEmailCode(): Promise<any> {
  return request.get('/user/email-code')
}

export function resetPassword(): Promise<any> {
  return request.post('/user/reset-password')
}

export function register(): Promise<any> {
  return request.post('/user/register')
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false,
    },
    method: 'get',
    timeout: 20000,
  })
}
