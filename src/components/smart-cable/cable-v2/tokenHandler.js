import request from '@/utils/request'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
  }
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data,
  })
}
const username = 'admin'
const password = 'Cable@2024'

export const mockLogin = () => {
    login(username, password, 'code', 'uuid').then((res) => {
      const data = res.data
      localStorage.setItem(STORAGE_TOKEN_KEY, data.access_token)
      resolve()
    }).catch((error) => {
      reject(error)
    })
}
