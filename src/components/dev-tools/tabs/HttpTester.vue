<script setup lang="ts">
import { ref } from 'vue'
import { showNotify } from 'vant'
import request from '@/utils/request'

const url = ref('')
const method = ref('GET')
const requestBody = ref('')
const response = ref('')

async function sendRequest() {
  try {
    const config = {
      method: method.value,
      data: method.value !== 'GET' ? JSON.parse(requestBody.value || '{}') : undefined,
    }

    const res = await request(url.value, config)
    response.value = JSON.stringify(res, null, 2)
    showNotify({ type: 'success', message: '请求成功' })
  }
  catch (error: any) {
    response.value = JSON.stringify(error.response?.data || error.message, null, 2)
    showNotify({ type: 'danger', message: '请求失败' })
  }
}
</script>

<template>
  <van-cell-group title="HTTP 请求测试" inset>
    <van-field
      v-model="url"
      label="请求URL"
      placeholder="输入完整的请求URL"
      clearable
    />
    <van-field
      v-model="method"
      label="请求方法"
      placeholder="GET/POST/PUT/DELETE"
    />
    <van-field
      v-if="method !== 'GET'"
      v-model="requestBody"
      label="请求体"
      type="textarea"
      placeholder="输入JSON格式的请求体"
    />
    <div class="button-wrapper">
      <van-button type="primary" size="small" @click="sendRequest">
        发送请求
      </van-button>
    </div>
    <van-field
      v-if="response"
      v-model="response"
      label="响应结果"
      type="textarea"
      readonly
      rows="5"
    />
  </van-cell-group>
</template>

<style scoped>
.button-wrapper {
  padding: 8px 16px;
}
</style>
