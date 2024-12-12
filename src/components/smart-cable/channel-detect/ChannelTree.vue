<template>
  <div class="channel-tree-wrapper">
    <div class="search-bar">
      <el-input
        v-model="filterText"
        placeholder="搜索管理通道"
        clearable
        @clear="handleClear"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button @click="toggleTree">
        <el-icon>
          <component :is="isTreeVisible ? ArrowUp : ArrowDown" />
        </el-icon>
      </el-button>
    </div>

    <transition name="slide-fade">
      <div v-show="isTreeVisible" class="tree-container">
        <el-scrollbar height="50vh">
          <el-tree
            ref="channelTree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @check="handleCheckChange"
            node-key="id"
            :highlight-current="true"
            :default-expanded-keys="defaultExpandedKeys"
            lazy
            :load="loadNode"
            show-checkbox
            check-strictly
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <el-image
                  style="width: 16px; height: 16px; margin-right: 6px;"
                  :src="getImageUrl(data.image)"
                  fit="fill"
                />
                <span :class="{ 'selected-node': data.checked }">
                  {{ node.label }}
                </span>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { searchChannelList, searchManagementChannelList } from "@/api/management-channel"

const props = defineProps({
  defaultExpanded: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['check-change'])

const channelTree = ref(null)
const filterText = ref('')
const isTreeVisible = ref(props.defaultExpanded)
const treeData = ref([])
const defaultExpandedKeys = ref(['0'])

const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'leaf',
  disabled: false
}

const toggleTree = () => {
  isTreeVisible.value = !isTreeVisible.value
}

const handleClear = () => {
  channelTree.value.filter('')
}

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.toLowerCase().includes(value.toLowerCase())
}

const handleCheckChange = (data, checked) => {
  if (!data.leaf) return
  emit('check-change', data, checked)
}

const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    const rootNode = { name: '国网乌鲁木齐供电公司', key: '0', id: '0', image: 'top-node', disabled: true }
    resolve([rootNode])
  } else if (node.level === 1) {
    const companies = [
      { name: '市南供电公司', key: '1', id: '1', image: 'root-node', disabled: true },
      { name: '市中供电公司', key: '2', id: '2', image: 'root-node', disabled: true },
      { name: '市北供电公司', key: '3', id: '3', image: 'root-node', disabled: true },
      { name: '乌鲁木齐县供电公司', key: '4', id: '4', image: 'root-node', disabled: true },
      { name: '五家渠供电公司', key: '5', id: '5', image: 'root-node', disabled: true },
      { name: '米东供电公司', key: '6', id: '6', image: 'root-node', disabled: true },
      { name: '西郊供电公司', key: '7', id: '7', image: 'root-node', disabled: true },
    ]
    resolve(companies)
  } else if (node.level === 2) {
    try {
      const res = await searchManagementChannelList({ operationUnit: node.data.key })
      const channels = res.data.map(item => ({
        name: item.deviceName,
        key: item.channelId,
        unit: node.data.key,
        id: node.data.key + item.channelId,
        image: 'channel-node',
        leaf: false,
        disabled: false
      }))
      resolve(channels)
    } catch (error) {
      ElMessage.error('加载管理通道失败')
      resolve([])
    }
  } else if (node.level === 3) {
    try {
      const res = await searchChannelList(node.data.key, node.data.unit)
      const channels = res.data
        .filter(item => item.count > 0)
        .map(item => ({
          name: item.channelName,
          key: node.data.key,
          unit: node.data.unit,
          id: `${node.data.unit}-${node.data.key}-${item.channelCode}`,
          image: item.channelCode,
          channelCode: item.channelCode,
          leaf: true,
          disabled: false
        }))
      resolve(channels)
    } catch (error) {
      ElMessage.error('加载子通道失败')
      resolve([])
    }
  }
}

const getImageUrl = (image) => {
  return `/assets/images/${image}.png`
}

watch(filterText, (val) => {
  channelTree.value?.filter(val)
})

const initializeTree = async () => {
  await nextTick()
  const rootNode = channelTree.value.getNode('0')
  if (rootNode && !rootNode.expanded) {
    rootNode.expanded = true
  }
}

onMounted(() => {
  initializeTree()
})

// 暴露方法给父组件
defineExpose({
  toggleTree,
  channelTree
})
</script>

<style scoped>
.channel-tree-wrapper {
  position: relative;
}

.search-bar {
  display: flex;
  padding: 10px;
  background-color: #f0f0f027;
  border-radius: 4px;
}

.tree-container {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  overflow-y: auto;
  margin-top: 10px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  padding: 4px 0;
  width: 100%;
  cursor: pointer;
}

.selected-node {
  color: #138D75;
  font-weight: bold;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-checkbox__inner) {
  border-radius: 2px;
}

@media screen and (max-width: 768px) {
  .tree-container {
    width: 100%;
    max-height: 60vh;
  }
  
  .search-bar {
    padding: 8px;
  }
}
</style> 