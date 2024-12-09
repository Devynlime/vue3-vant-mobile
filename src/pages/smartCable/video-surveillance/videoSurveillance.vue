<template>
  <div class="mobile-page">


    <!-- 站点选择区域 -->
    <div class="station-select">
      <el-input
        v-model="filterText"
        placeholder="请选择管理通道"
        prefix-icon="Search"
      />
      <div class="tree-wrapper">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          :load="handleLoadNode"
          lazy
          show-checkbox
          node-key="key"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          @check="handleCheck"
          highlight-current
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <el-image 
                style="width: 16px; height: 16px" 
                :src="`assets/images/${data.image}.png`" 
              />
              <span class="node-label">{{ data.name }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <!-- 视频窗口区域 -->
    <div class="video-section">
      <div class="video-tabs">
        <el-tooltip 
          v-for="(node, index) in checkedNodes" 
          :key="node?.key || index"
          :content="node?.name"
          placement="top"
          :disabled="!node?.name"
          effect="dark"
        >
          <div 
            :class="{ 
              'tab-item': true, 
              'active': currentTab === index + 1,
              'disabled': !node
            }"
            @click="handleTabChange(index + 1)"
          >
            {{ node?.name || `视频${index + 1}` }}
          </div>
        </el-tooltip>
        
        <!-- 空 tab -->
        <div 
          v-for="i in 4 - checkedNodes.length" 
          :key="`empty-${i}`"
          class="tab-item disabled"
        >
          视频{{ checkedNodes.length + i }}
        </div>
      </div>

      <!-- 视频内容区 -->
      <div class="video-content">
        <template v-if="checkedNodes[currentTab-1]?.channel1">
          <iframe 
            :ref="el => videoRefs[currentTab-1] = el"
            :src="videoUrls[currentTab-1]"
            class="video-frame"
            @load="() => handleVideoLoad(currentTab-1)"
          />
          <div class="video-controls">
            <div class="control-buttons">
              <el-button circle @click="() => captureVideo(currentTab-1)">
                <takePhotoIcon :iconheight="24" :iconwidth="24" />
              </el-button>
              <el-button circle @click="() => recordVideo(currentTab-1)">
                <videoRecordIcon :iconheight="24" :iconwidth="24" />
              </el-button>
              <el-button circle @click="() => autoFit(currentTab-1)">
                <autoFitIcon :iconheight="24" :iconwidth="24" :iconcolor="`#000`" />
              </el-button>
            </div>
            <el-switch
              v-model="videoTypes[currentTab-1]"
              @change="() => handleChannelChange(currentTab-1)"
              active-value="visiableLight"
              inactive-value="infrared"
              active-text="可见光"
              inactive-text="红外"
            />
          </div>
        </template>
        <div v-else class="no-video-tip">
          请在上方选择要查看的视频
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-header {
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);

  .title {
    font-size: 17px;
    font-weight: 500;
  }

  .back-btn, .menu-btn {
    padding: 8px;
    cursor: pointer;
  }
}

.page-title {
  padding: 15px;
  
  span {
    font-size: 20px;
    font-weight: bold;
  }

  .title-line {
    width: 30px;
    height: 3px;
    background: #409EFF;
    margin-top: 8px;
  }
}

.station-select {
  padding: 0 15px;

  .el-input {
    margin-bottom: 10px;
  }

  .tree-wrapper {
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    max-height: 250px;
    overflow-y: auto;
  }

  .custom-tree-node {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
  }

  .node-label {
    font-size: 14px;
    color: #333;
  }

  :deep(.el-tree-node__content) {
    height: 32px;
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: #f0f7ff;
  }
}

.video-section {
  flex: 1;
  margin: 15px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  max-height: calc(100vh - 100px);
}

.video-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  height: 40px;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 8px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 24px;

    &.active {
      color: #409EFF;
      border-bottom: 2px solid #409EFF;
    }

    &.disabled {
      color: #999;
      cursor: not-allowed;
    }
  }
}

.video-content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 0;
  min-height: 300px;
  
  .video-frame {
    width: 100%;
    height: calc(100% - 60px); // 减去底部控制栏的高度
    border: none;
    background: #000;
    display: block;
    object-fit: contain;
  }
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

.history-view {
  height: 100%;
  position: relative;

  .history-content {
    height: calc(100% - 60px);
    background: #000;
    position: relative;

    video, .el-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .time-label {
    position: absolute;
    left: 10px;
    top: 10px;
    color: #fff;
    background: rgba(0,0,0,0.5);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
  }

  .temp-bar {
    position: absolute;
    left: 15px;
    top: 50px;
    width: 10px;
    height: 120px;
    background: linear-gradient(to bottom, red, transparent);
    border: 1px solid red;

    .temp-values {
      position: absolute;
      left: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #fff;
      font-weight: bold;

      .high { color: red; }
      .mid { color: white; }
      .low { color: blue; }
    }
  }
}

.no-video-tip {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

// 自定义 tooltip 样式（可选）
:deep(.el-tooltip__popper) {
  max-width: 300px; // 设置最大宽度
  word-break: break-all; // 允许在任意字符间断行
  line-height: 1.4; // 调整行高
}
</style>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { getVideoToken } from '@/api/video-api'
import { fetchStationData } from '@/services/station-tree.service'

// 树相关的状态
const treeRef = ref(null)
const treeData = ref([])
const filterText = ref('')

// 树的配置
const treeProps = {
  label: 'name',
  children: 'children',
  isLeaf: 'leaf'
}

// 默认展开和选中的节点
const defaultExpandedKeys = ref(['0', '3', '3-1'])
const defaultCheckedKeys = ref(['3-1-1', '3-1-2'])

// 视频相关的状态
const currentTab = ref(1)
const checkedNodes = ref([])
const videoRefs = ref([])
const videoUrls = ref([])
const videoTypes = ref([])

// 加载树节点
const handleLoadNode = async (node, resolve) => {
  try {
    if (node.level === 0) {
      // 加载根节点
      const data = [{
        name: '国网乌鲁木齐供电公司',
        key: '0',
        id: '0',
        image: 'top-node'
      }]
      return resolve(data)
    }

    // 获取完整的站点数据
    const stationData = await fetchStationData()

    if (node.level === 1) {
      // 加载供电公司节点
      return resolve(stationData.companies)
    }

    if (node.level === 2) {
      // 加载通道节点
      const company = stationData.companies.find(c => c.key === node.data.key)
      return resolve(company?.channels || [])
    }

    if (node.level === 3) {
      // 加载设备节点
      const company = stationData.companies.find(c => c.channels?.some(ch => ch.key === node.data.key))
      const channel = company?.channels?.find(ch => ch.key === node.data.key)
      return resolve(channel?.devices || [])
    }

    resolve([])
  } catch (error) {
    console.error('加载节点失败:', error)
    resolve([])
  }
}

// 处理节点选中状态变化
const handleCheck = async (data, { checkedNodes: nodes }) => {
  // 只保留叶子节点且有视频通道的节点
  checkedNodes.value = nodes
    .filter(node => node.leaf && node.channel1)
    .slice(0, 4) // 最多保留4个节点

  // 重置视频相关状态
  videoRefs.value = new Array(checkedNodes.value.length)
  videoUrls.value = new Array(checkedNodes.value.length)
  videoTypes.value = new Array(checkedNodes.value.length).fill('visiableLight')

  // 初始化视频URL
  await Promise.all(
    checkedNodes.value.map(async (_, index) => {
      try {
        const res = await getVideoToken()
        videoUrls.value[index] = `${import.meta.env.VITE_VIDEO_SURVEILLANCE_URL}?token=${res.data.token}`
      } catch (error) {
        console.error('获取视频token失败:', error)
        // 默认操作 - 默认读取视频html
        videoUrls.value[index] = `${import.meta.env.VITE_VIDEO_SURVEILLANCE_URL}`
        // 打印错误信息
        console.warn('获取视频token失败,读取视频html', `${import.meta.env.VITE_VIDEO_SURVEILLANCE_URL}  `)
      }
    })
  )

  // 如果当前选中的tab没有对应的视频，切换到第一个有视频的tab
  if (!checkedNodes.value[currentTab.value - 1]) {
    currentTab.value = 1
  }
}

// 视频加载完成处理
const handleVideoLoad = (index) => {
  const videoWindow = videoRefs.value[index]?.contentWindow
  if (videoWindow && checkedNodes.value[index]) {
    const node = checkedNodes.value[index]
    const channel = videoTypes.value[index] === 'visiableLight' ? node.channel1 : node.channel2
    
    // 打印完整的iframe URL
    console.log('iframe URL:', videoUrls.value[index])
    // 打印视频通道信息
    console.log('Channel Info:', {
      channelType: videoTypes.value[index],
      channelNumber: channel,
      nodeName: node.name
    })
    
    videoWindow.palyVideo(channel, "电缆通道监测")
    
    // 确保视频加载后自动适应大小
    setTimeout(() => {
      videoWindow.setVideoSize()
    }, 1000)

    // 添加 ResizeObserver 监听 iframe 大小变化
    const observer = new ResizeObserver(() => {
      videoWindow.setVideoSize()
    })
    observer.observe(videoRefs.value[index])
  }
}

// 在组件卸载时清理 ResizeObserver
onBeforeUnmount(() => {
  videoRefs.value.forEach(ref => {
    if (ref) {
      const observer = new ResizeObserver(() => {})
      observer.unobserve(ref)
      observer.disconnect()
    }
  })
})

// 初始化
onMounted(async () => {
  try {
    // 初始化树数据
    const data = await fetchStationData()
    treeData.value = [data.root]
    
    // 模拟选中默认节点
    const defaultNodes = defaultCheckedKeys.value.map(key => {
      const node = data.companies
        .find(c => c.channels?.some(ch => ch.devices?.some(d => d.key === key)))
        ?.channels
        ?.find(ch => ch.devices?.some(d => d.key === key))
        ?.devices
        ?.find(d => d.key === key)
      return node
    }).filter(Boolean)

    // 初始化选中状态
    await handleCheck({ checked: true }, { checkedNodes: defaultNodes })

    // 添加窗口大小变化监听
    window.addEventListener('resize', () => {
      const currentVideoWindow = videoRefs.value[currentTab.value - 1]?.contentWindow
      if (currentVideoWindow) {
        currentVideoWindow.setVideoSize()
      }
    })
  } catch (error) {
    console.error('初始化失败:', error)
  }
})

// Tab 切换处理
const handleTabChange = (tab) => {
  if (checkedNodes.value[tab-1]) {
    currentTab.value = tab
  }
}

// 通道切换处理
const handleChannelChange = (index) => {
  const videoWindow = videoRefs.value[index]?.contentWindow
  if (videoWindow) {
    const node = checkedNodes.value[index]
    const channel = videoTypes.value[index] === 'visiableLight' ? node.channel1 : node.channel2
    videoWindow.palyVideo(channel, "电缆通道监测")
  }
}

// 其他视频控制方法
const captureVideo = (index) => {
  const videoWindow = videoRefs.value[index]?.contentWindow
  if (videoWindow) {
    videoWindow.captureVideo("电缆通道监测")
  }
}

const recordVideo = (index) => {
  const videoWindow = videoRefs.value[index]?.contentWindow
  if (videoWindow) {
    videoWindow.realRecordVideo("电缆通道监测")
  }
}

const autoFit = (index) => {
  const videoWindow = videoRefs.value[index]?.contentWindow
  if (videoWindow) {
    videoWindow.setVideoSize()
  }
}
</script>