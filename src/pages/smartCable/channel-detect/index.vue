<template>
  <div class="channel-detect-container">
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
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <el-image
                  v-if="!data.leaf"
                  style="width: 16px; height: 16px; margin-right: 6px;"
                  :src="getImageUrl(data.image)"
                  fit="fill"
                />
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </transition>

    <div class="map-container" :style="{ height: mapHeight }">
      <BaiduChannelMap ref="channelMap" :api-key="baiduMapApiKey" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import BaiduChannelMap from '@/components/smart-cable/channel-detect/BaiduChannelMap.vue'
import { ElMessage } from 'element-plus'
import { searchChannelList, searchManagementChannelList } from "@/api/management-channel"

const channelTree = ref(null)
const channelMap = ref(null)
const filterText = ref('')
const isTreeVisible = ref(false)
const treeData = ref([])
const baiduMapApiKey = '7lZj0aj7OC987xjDhABFpHfVyie15F2l' // 替换为您的百度地图 API 密钥

const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'leaf'
}

const mapHeight = computed(() => isTreeVisible.value ? '50vh' : '100vh')

const toggleTree = () => {
  isTreeVisible.value = !isTreeVisible.value
}

const handleClear = () => {
  channelTree.value.filter('')
}

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

const handleNodeClick = (data) => {
  if (data.leaf) {
    channelMap.value.flytoPosition([data.longitude, data.latitude])
  }
}

const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    resolve([{ name: '国网乌鲁木齐供电公司', key: '0', id: '0', image: 'top-node' }])
  } else if (node.level === 1) {
    const companies = [
      { name: '市南供电公司', key: '1', id: '1', image: 'root-node' },
      { name: '市中供电公司', key: '2', id: '2', image: 'root-node' },
      { name: '市北供电公司', key: '3', id: '3', image: 'root-node' },
      { name: '乌鲁木齐县供电公司', key: '4', id: '4', image: 'root-node' },
      { name: '五家渠供电公司', key: '5', id: '5', image: 'root-node' },
      { name: '米东供电公司', key: '6', id: '6', image: 'root-node' },
      { name: '西郊供电公司', key: '7', id: '7', image: 'root-node' },
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
      }))
      resolve(channels)
    } catch (error) {
      ElMessage.error('加载管理通道失败')
      resolve([])
    }
  } else if (node.level === 3) {
    try {
      const res = await searchChannelList(node.data.key, node.data.unit)
      const subChannels = res.data
        .filter(item => item.count > 0)
        .map(item => ({
          name: item.channelName,
          key: node.data.key,
          unit: node.data.unit,
          id: node.data.unit + node.data.key,
          image: item.channelCode,
          leaf: true,
        }))
      resolve(subChannels)
    } catch (error) {
      ElMessage.error('加载子通道失败')
      resolve([])
    }
  } else {
    resolve([])
  }
}

const getImageUrl = (image) => {
  return `/assets/images/${image}.png`
}

watch(filterText, (val) => {
  channelTree.value?.filter(val)
})

onMounted(() => {
  treeData.value = [{ name: '国网乌鲁木齐供电公司', key: '0', id: '0', image: 'top-node' }]
})
</script>

<style scoped>
.channel-detect-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.search-bar {
  display: flex;
  padding: 10px;
  background-color: #f0f0f0;
}

.tree-container {
  flex-shrink: 0;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.map-container {
  flex-grow: 1;
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
}
</style>