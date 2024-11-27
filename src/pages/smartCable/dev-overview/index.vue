<script setup>
// import detail1 from '@/components/smart-cable/dev-overview/detail1.vue'
import floatBall from '@/components/smart-cable/floatingBall.vue'
import deviceOverview from './deviceOverview.vue'
// 导航栏
const active = ref(0)
// 标签组
const tabs = [
  { title: '地图监控', component: deviceOverview, componentProps: { display: 'center' } },
  { title: '变电站/电缆线路', component: deviceOverview, componentProps: { display: 'left' } },
  { title: '中间设备', component: deviceOverview, componentProps: { display: 'right' } },
]
</script>

<template>
  <van-tabs v-model:active="active">
    <van-tab v-for="(tab, index) in tabs" :title="tab.title">
      <!-- {{ tab.title }} -->
      <component :is="tab.component" v-bind="tab.componentProps" />
    </van-tab>
  </van-tabs>

  <float-ball />
</template>

<route lang="json">
{
    "name":"devOverview",
    "meta":{
        "title":"电缆井设备概况"
    }
}
</route>