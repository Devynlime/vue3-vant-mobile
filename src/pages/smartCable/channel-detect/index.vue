<template>
  <div class="channel-detect-container">
    <div class="control-panel">
      <ChannelTree
        ref="channelTreeComponent"
        @check-change="handleCheckChange"
      />
    </div>

    <div class="map-container" :style="{ height: mapHeight }">
      <BaiduChannelMap ref="channelMap" :api-key="baiduMapApiKey" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaiduChannelMap from '@/components/smart-cable/channel-detect/BaiduChannelMap.vue'
import ChannelTree from '@/components/smart-cable/channel-detect/ChannelTree.vue'
import { ElMessage } from 'element-plus'
import { getChannelManholeAndChildChannel } from "@/api/management-channel"

const channelMap = ref(null)
const channelTreeComponent = ref(null)
const baiduMapApiKey = '7lZj0aj7OC987xjDhABFpHfVyie15F2l'

const mapHeight = computed(() => '100vh')

const handleCheckChange = async (data, checked) => {
  try {
    const res = await getChannelManholeAndChildChannel({
      channelCode: data.channelCode,
      managementChannelId: data.key,
      operationUnit: data.unit
    })
    
    if (!checked) {
      channelMap.value.removeSegmentFromMap(data.id)
    } else {
      channelMap.value.addSegmentInMap(res, data.id)
      if (res.data?.coordinates) {
        channelMap.value.flytoPosition(res.data.coordinates)
      }
    }
  } catch (error) {
    ElMessage.error('加载通道信息失败')
  }
}
</script>

<style scoped>
.channel-detect-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.control-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 10;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

@media screen and (max-width: 768px) {
  .control-panel {
    width: 90%;
    margin: 0 auto;
  }
}
</style>
<route lang="json">
  {
    "name": "channel-detect",
    "meta": {
      "title": "通道检测"
    }
  }
</route>
