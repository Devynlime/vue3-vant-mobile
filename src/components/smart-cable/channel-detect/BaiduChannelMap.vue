<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { ElMessage } from 'element-plus'
  
  const mapContainer = ref(null)
  let baiduMap = null
  let markerLayer = null
  
  const props = defineProps({
    apiKey: {
      type: String,
      required: true
    }
  })
  
  const initMap = () => {
    console.log('initMap被调用')
    if (typeof BMap === 'undefined') {
      console.error('BMap未定义，API加载失败')
      ElMessage.error('百度地图加载失败，请检查网络连接和API密钥是否正确')
      return
    }
  
    try {
      baiduMap = new BMap.Map(mapContainer.value)
      const point = new BMap.Point(87.59956765698519, 43.78276982782455)
      baiduMap.centerAndZoom(point, 16)
      baiduMap.enableScrollWheelZoom(true)
  
      markerLayer = new BMap.Marker(point)
      baiduMap.addOverlay(markerLayer)
  
      console.log('地图初始化成功')
    } catch (error) {
      console.error('地图初始化失败:', error)
      ElMessage.error('地图初始化失败，请刷新页面重试')
    }
  }
  
  const loadMapImages = () => {
    // 在百度地图中，我们不需要预加载图片，因为我们会在添加标记时直接使用图片URL
  }
  
  const flytoPosition = (coordinates) => {
    if (baiduMap) {
      const point = new BMap.Point(coordinates[0], coordinates[1])
      baiduMap.panTo(point)
      baiduMap.setZoom(18)
    }
  }
  
  const addSegmentInMap = (data, segmentId) => {
    if (!baiduMap) return
  
    data.data.forEach(element => {
      if (element.name !== 'manhole') {
        if (element.list.length === 0) return
        element.list.forEach(ele => {
          const path = ele.segmentCoordinates.split(',').map(pair => {
            const [lng, lat] = pair.split(' ').map(Number)
            return new BMap.Point(lng, lat)
          })
          const polyline = new BMap.Polyline(path, {
            strokeColor: '#28F',
            strokeWeight: 5,
            strokeOpacity: 0.8
          })
          baiduMap.addOverlay(polyline)
        })
      } else {
        if (element.list.length === 0) return
        element.list.forEach(ele => {
          const point = new BMap.Point(ele.longitude, ele.latitude)
          const marker = new BMap.Marker(point, {
            icon: new BMap.Icon(
              `/smart-cable-v2/assets/images/${getManholeType(ele.manholeType, ele.convertCoord)}.png`,
              new BMap.Size(32, 32),
              { imageSize: new BMap.Size(32, 32) }
            )
          })
          baiduMap.addOverlay(marker)
          marker.addEventListener('click', () => {
            const infoWindow = new BMap.InfoWindow(ele.deviceName, {
              width: 200,
              height: 100,
              title: '电缆井信息'
            })
            marker.openInfoWindow(infoWindow)
          })
        })
      }
    })
  }
  
  const removeSegmentFromMap = (segmentId) => {
    if (baiduMap) {
      baiduMap.clearOverlays()
    }
  }
  
  const getManholeType = (manholeType, convertCoord) => {
    switch (manholeType) {
      case '直线井':
        return convertCoord === 2 ? 'manhole-D-S' : 'manhole-D'
      case '四通井':
        return convertCoord === 2 ? 'manhole-C-S' : 'manhole-C'
      case '转角井':
        return convertCoord === 2 ? 'manhole-L-S' : 'manhole-L'
      case '三通井':
        return convertCoord === 2 ? 'manhole-T-S' : 'manhole-T'
      default:
        return convertCoord === 2 ? 'manhole-D-S' : 'manhole-D'
    }
  }
  
  onMounted(() => {
    console.log('开始加载百度地图脚本')
    const script = document.createElement('script')
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${props.apiKey}&callback=initBaiduMap`
    script.async = true
    
    script.onerror = () => {
      console.error('百度地图脚本加载失败')
      ElMessage.error('百度地图脚本加载失败，请检查网络���接')
    }
    
    document.body.appendChild(script)
    window.initBaiduMap = initMap
  })
  
  onUnmounted(() => {
    if (baiduMap) {
      baiduMap.destroy()
    }
    delete window.initBaiduMap
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