<script setup>
import VideoSurveillance from './videoSurveillance.vue'
import floatingBall from '@/components/smart-cable/floatingBall.vue'
// 导航栏
const active = ref(0)
// 标签组
const tabs = [
  // { title: '站点选择 ', component: treeTab , componentProps: { display: 'center' }  },
  { title: '视频监控', component: VideoSurveillance, componentProps: { display: 'center' } },
]
</script>

<template>
  <van-nav-bar title="电缆井运维监控平台" />

  <van-tabs v-model:active="active">
    <van-tab v-for="(tab, index) in tabs" :title="tab.title">
      <!-- {{ tab.title }} -->
      <component :is="tab.component" v-bind="tab.componentProps" />
    </van-tab>
  </van-tabs>

  <floatingBall />
</template>

<style>
</style>
