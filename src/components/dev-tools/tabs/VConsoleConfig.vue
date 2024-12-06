<script setup lang="ts">
import { ref } from 'vue'
import { useVConsoleStore } from '@/stores/modules/vconsole'

const vconsoleStore = useVConsoleStore()
const vconsoleEnabled = ref(localStorage.getItem('vConsole-enabled') === 'true')

function toggleVConsole(checked: boolean) {
  vconsoleStore.toggleVConsole(checked)
}
</script>

<template>
  <van-cell-group title="VConsole 调试工具" inset>
    <van-cell title="VConsole 开关" label="开启后可在移动端查看控制台日志等调试信息">
      <template #right-icon>
        <van-switch v-model="vconsoleEnabled" size="24" @change="toggleVConsole" />
      </template>
    </van-cell>

    <van-cell title="使用说明">
      <template #label>
        <div class="description">
          <p>- 开启后页面将自动刷新以应用新设置</p>
          <p>- 开启后可以在移动端查看:</p>
          <ul>
            <li>控制台日志</li>
            <li>网络请求</li>
            <li>页面元素</li>
            <li>本地存储</li>
          </ul>
          <p>- 建议仅在开发调试时开启此功能</p>
        </div>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.description {
  font-size: 14px;
  color: var(--van-text-color-2);
  line-height: 1.5;
}

.description ul {
  padding-left: 20px;
  margin: 4px 0;
}

.description li {
  margin: 2px 0;
}
</style>
