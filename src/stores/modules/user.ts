import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'
import { setToken as setTokenCable } from '@/utils/cable-v2/auth'

import {
  getEmailCode,
  getUserInfo,
  resetPassword,
  login as userLogin,
  logout as userLogout,
  register as userRegister,
} from '@/api/user'

const InitUserInfo = {
  uid: 0,
  nickname: '',
  avatar: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserState>({ ...InitUserInfo })
    console.log(userInfo.value)
    // Set user's information
    const setInfo = (partial: Partial<UserState>) => {
      userInfo.value = { ...partial }
    }

    /**
     * 用户登录
     * @param loginForm 登录表单数据
     * @returns Promise<void>
     */
    const login = async (loginForm: LoginData): Promise<void> => {
      try {
        // 调用登录接口获取数据
        const { data } = await userLogin(loginForm)

        // 从响应中获取访问令牌
        const { access_token } = data

        // 分别在 localStorage 和 cookies 中存储令牌
        setToken(access_token)
        setTokenCable(access_token)

        // 更新用户信息
        if (access_token) {
          setInfo({ name: loginForm.username })
        }
      }
      catch (error) {
        // 登录失败时清除令牌
        clearToken()
        throw error
      }
    }

    /**
     * 获取用户详细信息
     * 通常在以下场景使用：
     * 1. 用户登录后获取完整信息
     * 2. 页面刷新后重新获取用户信息
     * 3. 需要更新用户信息时
     *
     * @throws {Error} 获取信息失败时抛出错误
     */
    const info = async () => {
      try {
        const { data } = await getUserInfo()
        setInfo(data)
      }
      catch (error) {
        clearToken()
        throw error
      }
    }

    const logout = async () => {
      try {
        await userLogout()
      }
      finally {
        clearToken()
        setInfo({ ...InitUserInfo })
      }
    }

    const getCode = async () => {
      try {
        const data = await getEmailCode()
        return data
      }
      catch {}
    }

    const reset = async () => {
      try {
        const data = await resetPassword()
        return data
      }
      catch {}
    }

    const register = async () => {
      try {
        const data = await userRegister()
        return data
      }
      catch {}
    }

    return {
      userInfo,
      info,
      login,
      logout,
      getCode,
      reset,
      register,
    }
  },
  {
    persist: true,
  },
)

export default useUserStore
