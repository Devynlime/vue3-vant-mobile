<script setup lang="ts">
const envInfo = {
  MODE: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  API_BASE_URL: import.meta.env.VITE_APP_API_BASE_URL,
}
</script>

<template>
  <van-cell-group title="环境信息" inset>
    <van-cell
      v-for="(value, key) in envInfo"
      :key="key"
      :title="key"
      :value="String(value)"
    />
  </van-cell-group>
</template>
