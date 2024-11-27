<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { getVideoToken } from '@/api/video-api'
import { Search } from '@element-plus/icons-vue'
import { searchManagementChannelList } from '@/api/management-channel'
import VideoFrame from '@/components/smart-cable/videoFrame.vue'
import { mockLogin } from '@/utils/cable-v2/tokenHandler.js'

const fullContent = ref(false)
const videoUrl = ref('')
const isFullScreen = ref(false)
const showVideoDialog = ref(false)

onMounted(() => {
  mockLogin() // 手动模拟admin登录
  getVideoToken().then((res) => {
    console.log(res.data.token)
    videoUrl.value = `${import.meta.env.VITE_VIDEO_SURVEILLANCE_URL}?token=${res.data.token}`
    videoUrl.value = 'public/video/video-play.html'
    console.log(videoUrl.value)
  }).catch((err) => {
    // 临时处理，用来测试通过401
    console.log(err)
    mockLogin() // 手动模拟admin登录
    // let staticToken = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2tleSI6IjUxZmViZWNhLWNiNDUtNGNmYi04NDNlLWFlN2UxYzU5NTYzZCIsInVzZXJuYW1lIjoiYWRtaW4ifQ.Zn0gfkx_A1hoyCvRnGlyNgtBnYGhMb_rdjTnLrE2_ILzIIRuWg29RnO3ywWu6Awq1ruJVI22Pc9SD3YF6oWPiQ'
    // localStorage.setItem('access_token', staticToken)
    // 获取图片
    // videoUrl.value = import.meta.env.VITE_VIDEO_SURVEILLANCE_URL + '?token=' + staticToken
  })
})

function loadNode(node, resolve) {
  if (node.level === 0) {
    nextTick(() => {
      const nodedata = node.childNodes[0]
      nodedata.expanded = true
      nodedata.loadData()
    })
    return resolve([{ name: '国网乌鲁木齐供电公司', key: '0', id: '0', image: 'top-node' }])
  }
  if (node.level === 1) {
    nextTick(() => {
      const nodedata = node.childNodes[0]
      nodedata.expanded = true
      nodedata.loadData()
    }) // 16801866
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
    searchManagementChannelList({ operationUnit: node.data.key }).then((res) => {
      const data = []
      res.data.forEach((item) => {
        data.push({
          name: item.deviceName,
          key: item.channelId,
          unit: node.data.key,
          id: node.data.key + item.channelId,
          image: 'channel-node',
          leaf: false,
        })
      })
      resolve(data)
    })
  }
  if (node.level > 2)
    return resolve([])
}

// 视频框架
const videoFrames = ref([
  { ref: 'videoFrame1', url: videoUrl.value },
  { ref: 'videoFrame2', url: videoUrl.value },
  { ref: 'videoFrame3', url: videoUrl.value },
  { ref: 'videoFrame4', url: videoUrl.value },
])
// 点击视频框架
function handleVideoFrame() {
  showVideoDialog.value = true
}
</script>

<template>
  <main class="home-page-main">
    <div style="height:100%;display: flex;flex-direction: column">
      <div
        style="width:100%;min-width: 100px;margin-right:8px;align-self:stretch;display: flex;flex-direction: row;"
      >
        <div class="tree-content">
          <div style="padding:2px 2px 2px 8px;border-bottom: 1px solid #ccc;">
            <el-input v-model="filterText" style="width:100%;" placeholder="请选择管理通道">
              <template #prefix>
                <el-icon class="el-input__icon">
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="treebox">
            <el-tree
              ref="resourceTree" :default-expanded-keys="['1', '2', '3', '4', '5', '6', '7']"
              style="max-width: 600px" :props="props" :load="loadNode" lazy show-tooltip="true"
              show-checkbox node-key="id" :filter-node-method="filterNode"
              @check-change="handleCheckChange"
            >
              <template #default="{ node, data }">
                <el-image
                  v-if="!data.leaf" style="width: 16px; height: 16px"
                  :src="`/assets/images/${data.image}.png`" fit="fill"
                />
                <el-tooltip
                  v-if="data.leaf" class="box-item" :content="data.name" placement="top-start"
                  effect="light"
                >
                  <span class="node-label" @click="locationInMap(data)">{{ data.name }}</span>
                </el-tooltip>
                <span
                  v-else-if="node.level === 3" class="node-label"
                  @click="locationChannelInMap(data)"
                >{{ data.name }}</span>
                <span v-else class="node-label">{{ data.name }}</span>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
      <div style="flex-grow:1;align-self: stretch;display: flex;flex-direction: column;">
        <div v-if="fullContent" class="full-content" />
        <div style="height: 100%;">
          <el-row :gutter="10" style="height: 100%;">
            <el-col v-for="(video, index) in videoFrames.slice(0, 2)" :key="index" :span="12">
              <VideoFrame :ref-name="video.ref" :video-url="video.url" @click-video-frame="handleVideoFrame()" />
            </el-col>
          </el-row>
          <el-row :gutter="10" style="height: 100%;">
            <el-col v-for="(video, index) in videoFrames.slice(2, 4)" :key="index" :span="12">
              <VideoFrame :ref-name="video.ref" :video-url="video.url" />
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 弹出层 -->
      <van-dialog v-model:show="showVideoDialog" title="视频监控" show-cancel-button>
        <!-- <VideoFrame :refName="video.ref" :videoUrl="video.url" /> -->
        111
      </van-dialog>
    </div>
  </main>
</template>

<style scoped lang="scss">
.el-row {
  margin-bottom: 5px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.treebox {
  max-height: calc(40vh - 140px);
  overflow: auto;
}

.home-page-main {
  // background-color: #ececec;
  padding: 5px;
  height: 100%;
  width: 100vw;
}

.video-content {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 1px 1px 10px #ccc;
  padding: 2px 5px 2px 5px;
  height: calc(100% - 5px);
}

.tree-content {
  background-color: #fff;
  border-radius: 4px;
  flex-grow: 1;
  align-self: stretch;
  overflow: auto;
  box-shadow: 1px 1px 10px #ccc;
  padding: 2px 5px 2px 5px;
  max-height: 30vh;
  margin-top: 1vw;
  margin-bottom: 2vw;
}

.full-content {
  background-color: #fff;
  border-radius: 4px;
  width: 100%;
  overflow: hidden;
  box-shadow: 1px 1px 10px #ccc;
  flex-grow: 1;
  align-self: stretch;
  padding: 4px;
}
</style>
