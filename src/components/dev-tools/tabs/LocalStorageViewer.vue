<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Dialog } from 'vant'

interface StorageItem {
  key: string
  value: string
  parsed?: any
  isJson: boolean
}

const storageItems = ref<StorageItem[]>([])
const searchKey = ref('')
const enableDelete = ref(false)

function loadStorageItems() {
  const items: StorageItem[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key) || ''
      const item: StorageItem = {
        key,
        value,
        isJson: false,
      }

      try {
        item.parsed = JSON.parse(value)
        item.isJson = true
      }
      catch {
        item.parsed = value
        item.isJson = false
      }

      items.push(item)
    }
  }
  storageItems.value = items.sort((a, b) => a.key.localeCompare(b.key))
}

const filteredItems = computed(() => {
  if (!searchKey.value)
    return storageItems.value
  return storageItems.value.filter(item =>
    item.key.toLowerCase().includes(searchKey.value.toLowerCase()),
  )
})

function clearStorage() {
  if (!enableDelete.value) {
    showToast('删除功能已禁用')
    return
  }
  Dialog.confirm({
    title: '确认清除',
    message: '确定要清除所有LocalStorage数据吗？',
  }).then(() => {
    localStorage.clear()
    loadStorageItems()
  }).catch(() => {
    // 用户取消操作
  })
}

function removeItem(key: string) {
  if (!enableDelete.value) {
    showToast('删除功能已禁用')
    return
  }
  Dialog.confirm({
    title: '确认删除',
    message: `确定要删除 "${key}" 吗？`,
  }).then(() => {
    localStorage.removeItem(key)
    loadStorageItems()
  }).catch(() => {
    // 用户取消操作
  })
}

function copyValue(value: string) {
  navigator.clipboard.writeText(value)
  showToast('已复制到剪贴板')
}

onMounted(() => {
  loadStorageItems()
})
</script>

<template>
  <div class="storage-viewer">
    <div class="storage-header">
      <div class="header-top">
        <h3>LocalStorage 数据 ({{ filteredItems.length }}项)</h3>
        <div class="header-actions">
          <van-button
            v-if="enableDelete"
            size="small"
            type="danger"
            plain
            style="margin-right: 8px;"
            @click="clearStorage"
          >
            清除全部
          </van-button>
          <van-switch
            v-model="enableDelete"
            size="20"
            style="margin-right: 8px;"
          >
            <template #node>
              <van-icon
                :name="enableDelete ? 'delete' : 'lock'"
                :style="{ color: enableDelete ? 'var(--van-danger-color)' : 'var(--van-gray-5)' }"
              />
            </template>
          </van-switch>
        </div>
      </div>
      <van-search
        v-model="searchKey"
        placeholder="搜索键名..."
        shape="round"
      />
    </div>

    <div v-if="filteredItems.length === 0" class="empty-state">
      {{ searchKey ? '没有找到匹配的数据' : '暂无数据' }}
    </div>

    <div v-else class="storage-list">
      <van-cell-group
        v-for="item in filteredItems"
        :key="item.key"
        class="storage-item"
      >
        <van-cell>
          <template #title>
            <div class="key-title">
              <span class="key-name">{{ item.key }}</span>
              <van-tag v-if="item.isJson" type="primary" size="medium">
                JSON
              </van-tag>
            </div>
          </template>
          <template #value>
            <div class="action-buttons">
              <van-button
                size="small"
                type="primary"
                plain
                @click="copyValue(item.value)"
              >
                复制
              </van-button>
              <van-button
                size="small"
                type="danger"
                plain
                @click="removeItem(item.key)"
              >
                删除
              </van-button>
            </div>
          </template>
        </van-cell>
        <van-cell>
          <div class="value-container">
            <pre v-if="item.isJson" class="storage-value json">{{
              JSON.stringify(item.parsed, null, 2)
            }}</pre>
            <div v-else class="storage-value plain">
              {{ item.value }}
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<style scoped>
.storage-viewer {
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
}

.storage-header {
  position: sticky;
  top: 0;
  background: var(--van-background);
  z-index: 1;
  padding: 0 16px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.storage-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.key-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-name {
  font-weight: bold;
  color: var(--van-primary-color);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.value-container {
  max-height: 300px;
  overflow-y: auto;
  background: var(--van-background-2);
  border-radius: 4px;
  margin-top: 4px;
}

.storage-value {
  margin: 0;
  padding: 8px;
  word-break: break-all;
  font-family: monospace;
  font-size: 13px;
}

.storage-value.json {
  white-space: pre-wrap;
  background: var(--van-background-2);
}

.storage-value.plain {
  white-space: pre-wrap;
}

.empty-state {
  text-align: center;
  color: var(--van-gray-6);
  padding: 32px 0;
}

.storage-item {
  background: var(--van-background);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.van-cell) {
  padding: 12px 16px;
}

:deep(.van-search) {
  padding: 8px 0;
}
</style>
