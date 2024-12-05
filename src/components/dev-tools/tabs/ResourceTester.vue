<script setup lang="ts">
import { ref } from 'vue'
import { showNotify } from 'vant'

const resourcePath = ref('')

function testResource() {
  const img = new Image()
  img.onload = () => {
    showNotify({ type: 'success', message: '资源路径有效' })
  }
  img.onerror = () => {
    showNotify({ type: 'danger', message: '资源路径无效' })
  }
  img.src = resourcePath.value
}
</script>

<template>
  <van-cell-group title="资源路径测试" inset>
    <van-field
      v-model="resourcePath"
      label="资源路径"
      placeholder="输入资源路径"
      clearable
    />
    <div class="button-wrapper">
      <van-button type="primary" size="small" @click="testResource">
        测试路径
      </van-button>
    </div>
    <iframe v-if="resourcePath" :src="resourcePath" width="100%" height="400px" style="border:none;" />
  </van-cell-group>
</template>

<style scoped>
.button-wrapper {
  padding: 8px 16px;
}
</style>
