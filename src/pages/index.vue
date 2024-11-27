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
  { title: '电缆设备概览', route: 'cableOverview' },
  { title: '电缆井设备概览', route: 'cableWellOverview' },
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
