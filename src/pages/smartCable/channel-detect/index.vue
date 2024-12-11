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
                  v-if="!data.leaf"
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
import { searchChannelList, searchManagementChannelList, getChannelManholeAndChildChannel } from "@/api/management-channel"

const channelTree = ref(null)
const channelMap = ref(null)
const filterText = ref('')
const isTreeVisible = ref(true)
const treeData = ref([])
const selectedChannels = ref(new Set())
const defaultExpandedKeys = ref(['0'])
const baiduMapApiKey = '7lZj0aj7OC987xjDhABFpHfVyie15F2l' // 替换为您的百度地图 API 密钥

const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'leaf',
  disabled: false
}

const mapHeight = computed(() => '100vh')

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

const handleCheckChange = async (data, checked) => {
  if (!data.leaf) return
  
  try {
    // 获取通道详细信息
    const res = await getChannelManholeAndChildChannel({
      channelCode: data.channelCode,
      managementChannelId: data.key,
      operationUnit: data.unit
    })
    
    if (!checked) {
      channelMap.value.removeSegmentFromMap(data.id)
    } else {
      channelMap.value.addSegmentInMap(res, data.id)
      // 定位到通道位置
      if (res.data?.coordinates) {
        channelMap.value.flytoPosition(res.data.coordinates)
      }
    }
  } catch (error) {
    ElMessage.error('加载通道信息失败')
  }
}

const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    const rootNode = { name: '国网乌鲁木齐供电公司', key: '0', id: '0', image: 'top-node', disabled: true }
    resolve([rootNode])
    setTimeout(() => {
      const firstNode = channelTree.value.getNode(rootNode)
      if (firstNode) {
        firstNode.expanded = true
      }
    }, 100)
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
    setTimeout(() => {
      companies.forEach(company => {
        const companyNode = channelTree.value.getNode(company)
        if (companyNode) {
          companyNode.expanded = true
        }
      })
    }, 100)
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

onMounted(() => {
  // 初始化根节点数据
  treeData.value = [{ 
    name: '国网乌鲁木齐供电公司',
    key: '0',
    id: '0',
    image: 'top-node'
  }]
})
</script>

<style scoped>
.channel-detect-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.search-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  padding: 10px;
  background-color: #f0f0f027;
  border-radius: 4px;
}

.tree-container {
  position: absolute;
  top: 60px;
  left: 15px;
  right: 15px;
  z-index: 10;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  overflow-y: auto;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
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

/* 新增移动端适配样式 */
@media screen and (max-width: 768px) {
  .tree-container {
    width: 90%;
    max-height: 60vh;
  }
  
  .search-bar {
    padding: 8px;
  }
}
</style>