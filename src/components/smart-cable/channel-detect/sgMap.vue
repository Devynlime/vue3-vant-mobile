<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { ElMessage } from 'element-plus'
  
  const mapContainer = ref(null)
  let channelMap = null
  
  const initMap = () => {
    SGMap.tokenTask.login(import.meta.env.VITE_APPKEY, import.meta.env.VITE_APPSECRET)
      .then(() => {
        channelMap = new SGMap.Map({
          container: mapContainer.value,
          style: "aegis://styles/aegis/Streets-v2",
          zoom: 16,
          pitch: 0,
          bearing: 0,
          center: [87.59956765698519, 43.78276982782455],
          localIdeographFontFamily: "Microsoft YoHei"
        })
  
        channelMap.on("load", () => {
          loadMapImages()
        })
      })
      .catch((error) => {
        ElMessage.error('地图初始化失败')
        console.error('Map initialization error:', error)
      })
  }
  
  const loadMapImages = () => {
    const images = [
      'manhole-C', 'manhole-D', 'manhole-L', 'manhole-T',
      'manhole-C-S', 'manhole-D-S', 'manhole-L-S', 'manhole-T-S',
      'pipeline', 'cable-bridge', 'cable-trench', 'direct-burial',
      'jacking-pipe', 'pull-pipe', 'tunnel', 'utility-tunnel'
    ]
  
    images.forEach(image => {
      channelMap.loadImage(`/smart-cable-v2/assets/images/${image}.png`, (error, loadedImage) => {
        if (error) {
          console.error(`Error loading image ${image}:`, error)
        } else {
          channelMap.addImage(image, loadedImage)
        }
      })
    })
  }
  
  const flytoPosition = (coordinates) => {
    if (channelMap) {
      channelMap.flyTo({ center: coordinates, zoom: 18 })
    }
  }
  
  const addSegmentInMap = (data, segmentId) => {
    // Implementation for adding segments to the map
    // This would be similar to the original implementation, but adapted for the mobile context
  }
  
  const removeSegmentFromMap = (segmentId) => {
    // Implementation for removing segments from the map
    // This would be similar to the original implementation, but adapted for the mobile context
  }
  
  onMounted(() => {
    initMap()
  })
  
  onUnmounted(() => {
    if (channelMap) {
      channelMap.remove()
    }
  })
  
  defineExpose({
    flytoPosition,
    addSegmentInMap,
    removeSegmentFromMap
  })
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 100%;
  }
  </style>