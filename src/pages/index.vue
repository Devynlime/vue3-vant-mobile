<script setup lang="ts">
const checked = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    checked.value = newMode
  },
  { immediate: true },
)
const menuItems = computed(() => ([
  { title: '电缆井运行态势总览', route: 'smartCable' },
  { title: '电缆设备概览', route: '/smartCable/dev-overview' },
  { title: '电缆井运维监控平台', route: '/smartCable/video-surveillance' },
  { title: '通道一张图', route: '/smartCable/channel-map' },
  { title: '告警工单', route: '/smartCable/cable-alarm' },
]))
</script>

<template>
  <VanCellGroup title="应用" :border="false" :inset="true">
    <template v-for="item in menuItems" :key="item.route">
      <VanCell :title="item.title" :to="item.route" is-link />
    </template>
  </VanCellGroup>
</template>

<route lang="json">
{
  "name": "home",
  "meta": {
    "title": "主页",
    "i18n": "menus.home"
  }
}
</route>
