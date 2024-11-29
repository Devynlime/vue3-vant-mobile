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
          ref="resourceTree"
          :default-expanded-keys="['1', '2', '3', '4', '5', '6', '7']"
          :props="props"
          :load="loadNode"
          lazy
          show-checkbox
          node-key="id"
          :filter-node-method="filterNode"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <el-image 
                style="width: 16px; height: 16px" 
                :src="'/assets/images/' + data.image + '.png'"
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
        <div 
          v-for="i in 4" 
          :key="i"
          :class="[
            'tab-item', 
            { 
              'active': currentTab === i,
              'disabled': !isTabEnabled(i)
            }
          ]"
          @click="isTabEnabled(i) && (currentTab = i)"
        >
          {{ getTabTitle(i) }}
        </div>
      </div>

      <!-- 视频内容区 -->
      <div class="video-content">
        <template v-if="showVideoContent(currentTab)">
          <!-- 实时视频 -->
          <template v-if="showVideoContent(currentTab).type === 'realtime'">
            <iframe 
              :ref="currentTab === 1 ? 'ifvideoBox1' : 'ifvideoBox2'"
              :src="showVideoContent(currentTab).videoUrl"
              class="video-frame"
              @load="iframeLoaded(currentTab)"
            ></iframe>
            <div class="video-controls">
              <div class="control-left">
                <el-button circle @click="captureVideo(currentTab)">
                  <takePhotoIcon :iconheight="20" :iconwidth="20" />
                </el-button>
                <el-button circle @click="recordVideo(currentTab)">
                  <videoRecordIcon :iconheight="20" :iconwidth="20" />
                </el-button>
                <el-button circle @click="autoFit(currentTab)">
                  <autoFitIcon :iconheight="20" :iconwidth="20" />
                </el-button>
              </div>
              <div class="control-right">
                <el-switch
                  :model-value="showVideoContent(currentTab).videoType"
                  @change="channelChange(currentTab)"
                  active-text="可见光"
                  inactive-text="红外"
                  active-value="visiableLight"
                  inactive-value="infrared"
                />
              </div>
            </div>
          </template>

          <!-- 历史记录 -->
          <template v-else>
            <div class="history-view">
              <div v-if="currentTab === 3" class="history-content">
                <!-- 视频3的历史内容 -->
                <div v-if="radio3 === 'shortVideo'" class="video-player">
                  <video controls>
                    <source :src="video3Src" type="video/mp4">
                  </video>
                </div>
                <div v-else class="image-viewer">
                  <el-image :src="imageUrl3" fit="contain" />
                </div>
                <div class="time-label">{{ dataoptions3[updateTime3]?.updateTime }}</div>
                <div class="temp-bar">
                  <div class="temp-values">
                    <span class="high">{{ dataoptions3[updateTime3]?.data?.CAM1_AI6_RES }}℃</span>
                    <span class="mid">{{ dataoptions3[updateTime3]?.data?.CAM1_AI7_RES }}℃</span>
                    <span class="low">{{ dataoptions3[updateTime3]?.data?.CAM1_AI8_RES }}℃</span>
                  </div>
                </div>
              </div>
              <!-- 类似的视频4内容... -->
            </div>
          </template>
        </template>

        <!-- 未选择视频时的提示 -->
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
    max-height: 300px;
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
  overflow: scroll;
  display: flex;
  flex-direction: column;
}

.video-tabs {
  display: flex;
  border-bottom: 1px solid #eee;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 15px;
    color: #666;
    cursor: pointer;

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
  flex: 1;
  position: relative;
  
  .video-frame {
    width: 100%;
    height: calc(100% - 50px);
    border: none;
  }
}

.video-controls {
  height: 50px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee;

  .control-left {
    display: flex;
    gap: 10px;
  }
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
</style>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { ArrowLeft, Menu, Search } from '@element-plus/icons-vue'
import { takePhotoIcon, videoRecordIcon, autoFitIcon } from '@/components/smart-cable/icon'
import { getVideoToken, listByDeviceId } from '@/api/video-api'

const currentTab = ref(1)
const filterText = ref('')
const showMenu = ref(false)
const videoUrl1 = ref('')
const videoUrl2 = ref('')
const videoType1 = ref('visiableLight')
const videoType2 = ref('visiableLight')

// 树形控件相关
const resourceTree = ref(null)
const props = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf'
}

// 添加选中节点的状态管理
const checkedNodes = ref([])
const currentVideoMap = ref(new Map()) // 存储当前选中的视频节点映射

// 添加必要的响应式变量
const active_device_id = ref('')
const radio3 = ref('visiableLight')
const radio4 = ref('visiableLight')
const updateTime3 = ref(0)
const updateTime4 = ref(0)
const dataoptions3 = ref([])
const dataoptions4 = ref([])
const video3Src = ref('')
const video4Src = ref('')
const imageUrl3 = ref('')
const imageUrl4 = ref('')

// 监听搜索框
watch(filterText, (val) => {
  resourceTree.value?.filter(val)
})

// 节点过滤方法
const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

// 加载节点数据
const loadNode = (node, resolve) => {
  if (node.level === 0) {
    nextTick(() => {
      let nodedata = node.childNodes[0]
      nodedata.expanded = true
      nodedata.loadData()
    })
    return resolve([{ name: '国网乌鲁木齐供电公司', key: '0', id: '0', image: 'top-node' }])
  }
  if (node.level === 1) {
    nextTick(() => {
      let nodedata = node.childNodes[0]
      nodedata.expanded = true
      nodedata.loadData()
    })
    const data = [
      {
        name: '市南供电公司',
        key: '1',
        id: '1',
        image: 'root-node',
        leaf: false,
      },
      {
        name: '市中供电公司',
        key: '2',
        id: '2',
        image: 'root-node',
        leaf: false,
      },
      {
        name: '市北供电公司',
        key: '3',
        id: '3',
        image: 'root-node',
        leaf: false,
      },
      {
        name: '乌鲁木齐县供电公司',
        key: '4',
        id: '4',
        image: 'root-node',
        leaf: false,
      },
      {
        name: '五家渠供电公司',
        key: '5',
        id: '5',
        image: 'root-node',
        leaf: false,
      },
      {
        name: '米东供电公司',
        key: '6',
        id: '6',
        image: 'root-node',
        leaf: false,
      },
      {
        name: '西郊供电公司',
        key: '7',
        id: '7',
        image: 'root-node',
        leaf: false,
      },
    ]
    return resolve(data)
  }
  if (node.level === 2) {
    let data = []
    if (node.data.key === '2') {
      data = []
      data.push({
        name: "南湖南路电缆通道",
        key: '2-1',
        unit: "2",
        id: "21",
        image: 'channel-node',
        leaf: false,
      })
    } else if (node.data.key === '3') {
      data = []
      data.push({
        name: "卫星路电缆通道",
        key: '3-1',
        unit: "3",
        id: "31",
        image: 'channel-node',
        leaf: false,
      })
      data.push({
        name: "长沙路电缆通道",
        key: '3-2',
        unit: "3",
        id: "32",
        image: 'channel-node',
        leaf: false,
      })
    }
    resolve(data)
  }
  if (node.level === 3) {
    let data = []
    if (node.data.key === '2-1') {
      data.push({
        name: "南湖南路电缆廊道J004",
        key: '2-1-1',
        unit: "2",
        id: "211",
        device_id: 'T651GW202406060009000004_cam1',
        image: 'photo',
        leaf: true
      })
    } else if (node.data.key === '3-1') {
      data.push({
        name: "开发区变出线通道J006",
        key: '3-1-1',
        unit: "2",
        id: "211",
        device_id: 'T651GW202406060009000001_cam1',
        channel1: '301810000003040099',
        channel2: '301810000003040100',
        image: 'camera',
        leaf: true
      })
      data.push({
        name: "开发区变出线通道J004",
        key: '3-1-2',
        unit: "2",
        id: "211",
        device_id: 'T651GW202406060009000002_cam1',
        channel1: '301810000003040101',
        channel2: '301810000003040102',
        image: 'camera',
        leaf: true
      })
    } else if (node.data.key === '3-2') {
      data.push({
        name: "市北电缆井三宫变J005",
        key: '3-2-1',
        unit: "2",
        id: "211",
        device_id: 'T651GW202406060009000003_cam1',
        image: 'photo',
        leaf: true
      })
    }
    resolve(data)
  }
}

// 处理节点点击
const handleNodeClick = (data) => {
  if (data.leaf) {
    showDataRightView(data)
  }
}

// 显示右侧视频内容
const showDataRightView = (data) => {
  active_device_id.value = data.device_id
  // 根据设备ID切换到对应的视频Tab
  if (data.device_id === "T651GW202406060009000004_cam1") {
    currentTab.value = 4
  } else if (data.device_id === "T651GW202406060009000003_cam1") {
    currentTab.value = 3
  } else if (data.device_id === "T651GW202406060009000002_cam1") {
    currentTab.value = 2
  } else if (data.device_id === "T651GW202406060009000001_cam1") {
    currentTab.value = 1
  }
}

// 初始化视频相关
onMounted(async () => {
  // 获取视频token
  try {
    const res = await getVideoToken()
    console.log("token===>", res.data.token)
    const baseUrl = import.meta.env.VITE_VIDEO_SURVEILLANCE_URL
    videoUrl1.value = `${baseUrl}?token=${res.data.token}`
    videoUrl2.value = `${baseUrl}?token=${res.data.token}`
  } catch (error) {
    console.error('获取视频token失败:', error)
  }
})

// 修改处理复选框变化的逻辑
const handleCheckChange = async (data, checked) => {
  console.log("checkbox change:", data, checked)
  if (!data.leaf) return // 只处理叶子节点
  
  if (checked) {
    // 添加到选中列表
    if (!checkedNodes.value.find(node => node.device_id === data.device_id)) {
      checkedNodes.value.push(data)
      
      // 如果是实时视频节点，需要加载视频
      if (data.channel1 && data.channel2) {
        const index = checkedNodes.value.length
        if (index === 1) {
          currentTab.value = 1
          nextTick(() => {
            if (ifvideoBox1.value?.contentWindow) {
              ifvideoBox1.value.contentWindow.palyVideo(data.channel1, "电缆通道监测")
            }
          })
        } else if (index === 2) {
          currentTab.value = 2
          nextTick(() => {
            if (ifvideoBox2.value?.contentWindow) {
              ifvideoBox2.value.contentWindow.palyVideo(data.channel1, "电缆通道监测")
            }
          })
        }
      }
      
      // 如果是历史记录节点，需要加载历史数据
      if (data.device_id.includes('_cam1') && !data.channel1) {
        await getDeviceData(data.device_id)
      }
    }
    // 更新视频映射
    updateVideoMapping()
  } else {
    // 从选中列表移除
    const index = checkedNodes.value.findIndex(node => node.device_id === data.device_id)
    if (index > -1) {
      checkedNodes.value.splice(index, 1)
      // 更新视频映射
      updateVideoMapping()
    }
  }
}

// 添加视频iframe的ref
const ifvideoBox1 = ref(null)
const ifvideoBox2 = ref(null)

// 视频加载完成的处理
const iframeLoaded = (ifno) => {
  console.log("iframeLoaded--->", ifno)
  nextTick(() => {
    const node = currentVideoMap.value.get(ifno)
    console.log("current node:", node)
    if (!node || !node.channel1) return
    
    if (ifno === 1) {
      console.log("loading video 1:", node.channel1)
      if (ifvideoBox1.value?.contentWindow) {
        ifvideoBox1.value.contentWindow.palyVideo(node.channel1, "电缆通道监测")
      }
    } else if (ifno === 2) {
      console.log("loading video 2:", node.channel1)
      if (ifvideoBox2.value?.contentWindow) {
        ifvideoBox2.value.contentWindow.palyVideo(node.channel1, "电缆通道监测")
      }
    }
  })
}

// 修改视频内容显示逻辑
const showVideoContent = (tabIndex) => {
  const node = currentVideoMap.value.get(tabIndex)
  if (!node) return false
  
  if (node.channel1 && node.channel2) {
    // 实时视频节点
    if (tabIndex === 1) {
      return {
        type: 'realtime',
        videoUrl: videoUrl1.value,
        videoType: videoType1.value
      }
    } else if (tabIndex === 2) {
      return {
        type: 'realtime',
        videoUrl: videoUrl2.value,
        videoType: videoType2.value
      }
    }
  } else {
    // 历史记录节点
    return {
      type: 'history',
      data: node
    }
  }
  return false
}

// 添加历史数据加载方法
const getDeviceData = async (deviceId) => {
  try {
    const idata = await listByDeviceId(deviceId)
    if (idata.data.length === 0) return
    
    const videos = idata.data.filter(item => item.dataType === 'video')
    const images = idata.data.filter(item => item.filename?.indexOf("-J_") !== -1)
    const hotimages = idata.data.filter(item => item.filename?.indexOf("-H_") !== -1)
    
    // 处理时间格式
    const formatData = (items) => {
      return items.map(item => ({
        ...item,
        updateTime: formatDateTime(item.updateTime),
        data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data
      }))
    }
    
    const cdata = {
      videos: formatData(videos),
      images: formatData(images),
      hotimages: formatData(hotimages)
    }
    
    // 存储数据
    if (deviceId === 'T651GW202406060009000003_cam1') {
      dataoptions3.value = cdata.images
      video3Src.value = cdata.videos[0]?.filename
    } else if (deviceId === 'T651GW202406060009000004_cam1') {
      dataoptions4.value = cdata.images
      video4Src.value = cdata.videos[0]?.filename
    }
  } catch (error) {
    console.error('加载设备数据失败:', error)
  }
}

// 添加时间格式化方法
const formatDateTime = (datatimeStr) => {
  const date = new Date(datatimeStr)
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date)
}

// 更新视频映射关系
const updateVideoMapping = () => {
  currentVideoMap.value.clear()
  checkedNodes.value.forEach((node, index) => {
    if (index < 4) { // 最多显示4个视频
      currentVideoMap.value.set(index + 1, node)
    }
  })
  
  // 如果当前选中的tab不在映射中，切换到第一个有效的tab
  if (!currentVideoMap.value.has(currentTab.value) && currentVideoMap.value.size > 0) {
    currentTab.value = Array.from(currentVideoMap.value.keys())[0]
  }
}

// 修改tab显示逻辑
const getTabTitle = (index) => {
  const node = currentVideoMap.value.get(index)
  return node ? node.name : `视频${index}`
}

// 判断tab是否可用
const isTabEnabled = (index) => {
  return currentVideoMap.value.has(index)
}

// 修改视频控制相关方法
const captureVideo = (ifno) => {
  if (ifno === 1) {
    if (ifvideoBox1.value?.contentWindow) {
      ifvideoBox1.value.contentWindow.captureVideo("电缆通道监测")
    }
  } else if (ifno === 2) {
    if (ifvideoBox2.value?.contentWindow) {
      ifvideoBox2.value.contentWindow.captureVideo("电缆通道监测")
    }
  }
}

const recordVideo = (ifno) => {
  if (ifno === 1) {
    if (ifvideoBox1.value?.contentWindow) {
      ifvideoBox1.value.contentWindow.realRecordVideo("电缆通道监测")
    }
  } else if (ifno === 2) {
    if (ifvideoBox2.value?.contentWindow) {
      ifvideoBox2.value.contentWindow.realRecordVideo("电缆通道监测")
    }
  }
}

const autoFit = (ifno) => {
  if (ifno === 1) {
    if (ifvideoBox1.value?.contentWindow) {
      ifvideoBox1.value.contentWindow.setVideoSize()
    }
  } else if (ifno === 2) {
    if (ifvideoBox2.value?.contentWindow) {
      ifvideoBox2.value.contentWindow.setVideoSize()
    }
  }
}

const channelChange = (ifno) => {
  if (ifno === 1) {
    videoType1.value = videoType1.value === 'visiableLight' ? 'infrared' : 'visiableLight'
    const node = currentVideoMap.value.get(1)
    if (node && ifvideoBox1.value?.contentWindow) {
      ifvideoBox1.value.contentWindow.palyVideo(
        videoType1.value === 'visiableLight' ? node.channel1 : node.channel2,
        "电缆通道监测"
      )
    }
  } else if (ifno === 2) {
    videoType2.value = videoType2.value === 'visiableLight' ? 'infrared' : 'visiableLight'
    const node = currentVideoMap.value.get(2)
    if (node && ifvideoBox2.value?.contentWindow) {
      ifvideoBox2.value.contentWindow.palyVideo(
        videoType2.value === 'visiableLight' ? node.channel1 : node.channel2,
        "电缆通道监测"
      )
    }
  }
}

</script>