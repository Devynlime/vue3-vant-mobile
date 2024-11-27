<script setup>
import overviewCenter from '@/components/smart-cable/home-overview/centerView.vue'
import detail1 from '@/components/smart-cable/detail1.vue'
import detail2 from '@/components/smart-cable/detail2.vue'
import floatBall from '@/components/smart-cable/floatingBall.vue'
// 导航栏
const active = ref(0)
// 标签组
const tabs = ref([
  { title: '地图监控', component: overviewCenter },
  { title: '电缆线路/段/接头', component: detail1 },
  { title: '电缆井/通道/管孔', component: detail2 },
])
</script>

<template>
  <van-tabs v-model:active="active">
    <van-tab v-for="(tab, index) in tabs" :title="tab.title">
      <!-- {{ tab.title }} -->
      <component :is="tab.component" />
    </van-tab>
  </van-tabs>

  <float-ball />
</template>

<route lang="json">
{
    "name":"smartCable",
    "meta":{
        "title":"电缆井运行态势总览"
    }
}
</route>
