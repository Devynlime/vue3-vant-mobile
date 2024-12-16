<script setup lang="ts">
import { type RouteMap, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { getCodeImg } from '@/api/user'

import logo from '~/images/logo.svg'
import logoDark from '~/images/logo-dark.svg'
import vw from '@/utils/inline-px-to-vw'
import { refreshCableToken } from '@/utils/cable-v2/tokenHandler'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const dark = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    dark.value = newMode
  },
)

const captchaEnabled = ref(false)
const codeUrl = ref('')

const postData = reactive({
  username: '',
  password: '',
  code: '',
  uuid: '',
})

// 加载时自动填入用户信息
onMounted(async () => {
  await userStore.info()

  if (userStore.userInfo.name) {
    postData.username = userStore.userInfo.name
    postData.password = userStore.userInfo.token
  }
})

const rules = reactive({
  username: [
    { required: true, message: t('login.pleaseEnterUsername') },
  ],
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
  ],
  code: [
    { required: true, message: t('login.pleaseEnterCaptcha') },
  ],
})

// 获取验证码
function getCode() {
  if (!captchaEnabled.value) {
    return
  }
  getCodeImg().then((res) => {
    // @ts-expect-error - API response type is not properly defined
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      // @ts-expect-error - Base64 image response type is not properly defined
      codeUrl.value = `data:image/gif;base64,${res.img}`
      // @ts-expect-error - UUID response type is not properly defined
      postData.uuid = res.uuid
    }
  })
}

// 初始化时获取验证码
getCode()

async function login() {
  try {
    loading.value = true
    // await userStore.login({ ...postData, ...values })
    // 走igw 的token请求接口
    await refreshCableToken()
    console.log(userStore.userInfo)
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      name: (redirect as keyof RouteMap) || 'home',
      query: {
        ...othersQuery,
      },
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="m-x-a w-7xl text-center">
    <div class="mb-32 mt-20">
      <van-image :src="dark ? logoDark : logo" class="h-120 w-120" alt="brand logo" />
    </div>

    <van-form :model="postData" :rules="rules" validate-trigger="onSubmit" @submit="login">
      <div class="overflow-hidden rounded-3xl">
        <van-field
          v-model="postData.username"
          :rules="rules.username"
          name="username"
          :placeholder="t('login.email')"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          v-model="postData.password"
          type="password"
          :rules="rules.password"
          name="password"
          :placeholder="t('login.password')"
        />
      </div>

      <div v-if="captchaEnabled" class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          v-model="postData.code"
          :rules="rules.code"
          name="code"
          :placeholder="t('login.captcha')"
        >
          <template #right-icon>
            <div class="h-full flex items-center px-12">
              <img
                :src="codeUrl"
                alt="captcha"
                class="h-32 cursor-pointer border-l border-gray-100 pl-12"
                @click="getCode"
              >
            </div>
          </template>
        </van-field>
      </div>

      <div class="mt-16">
        <van-button
          :loading="loading"
          type="primary"
          native-type="submit"
          round block
        >
          {{ $t('login.login') }}
        </van-button>
      </div>
    </van-form>

    <GhostButton block to="register" :style="{ 'margin-top': vw(18) }">
      {{ $t('login.sign-up') }}
    </GhostButton>

    <GhostButton block to="forgot-password">
      {{ $t('login.forgot-password') }}
    </GhostButton>
  </div>
</template>

<route lang="json">
{
  "name": "login",
  "meta": {
    "i18n": "menus.login"
  }
}
</route>

<style scoped>
.van-field :deep(.van-field__right-icon) {
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 1000;
}
</style>
