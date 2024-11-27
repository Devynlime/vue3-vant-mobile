import request from '@/utils/request-prod'

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

export function mockLogin() {
  return new Promise((resolve, reject) => {
    login(username, password, 'code', 'uuid').then((res) => {
      const data = res.data
      localStorage.setItem('access_token', data.access_token)
      resolve()
    }).catch((error) => {
      reject(error)
    })
  })
}
