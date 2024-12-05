<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HttpTester from './tabs/HttpTester.vue'
import ResourceTester from './tabs/ResourceTester.vue'
import EnvInfo from './tabs/EnvInfo.vue'
import LocalStorageViewer from './tabs/LocalStorageViewer.vue'

const router = useRouter()
const activeTab = ref(0)

const tabs = [
  { title: 'HTTP测试', component: HttpTester },
  { title: '资源测试', component: ResourceTester },
  { title: '环境信息', component: EnvInfo },
  { title: '存储查看', component: LocalStorageViewer },
]
</script>

<template>
  <div class="debug-panel">
    <div class="debug-header">
      <h2>开发调试面板</h2>
      <van-button size="small" type="primary" @click="router.back()">
        返回
      </van-button>
    </div>

    <van-tabs v-model:active="activeTab">
      <van-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :title="tab.title"
      >
        <component :is="tab.component" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.debug-panel {
  padding: 16px;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--van-background);
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

:deep(.van-cell-group__title) {
  padding: 8px 16px;
}

:deep(.van-tabs__content) {
  padding-top: 16px;
}
</style>
