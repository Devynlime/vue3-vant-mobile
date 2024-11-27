<script>
import { nextTick, ref } from 'vue'

export default {
  setup() {
    const activeIds = ref([1, 2])
    const activeIndex = ref(0)
    const items = ref([])

    const loadNode = (node, resolve) => {
      if (node.level === 0) {
        nextTick(() => {
          const nodedata = node.childNodes[0]
          nodedata.expanded = true
          nodedata.loadData()
        })
        return resolve([
          {
            text: '国网乌鲁木齐供电公司',
            id: '0',
            children: [],
          },
        ])
      }
      if (node.level === 1) {
        nextTick(() => {
          const nodedata = node.childNodes[0]
          nodedata.expanded = true
          nodedata.loadData()
        })
        const data = [
          { text: '市南供电公司', id: '1', children: [] },
          { text: '市中供电公司', id: '2', children: [] },
          { text: '市北供电公司', id: '3', children: [] },
          { text: '乌鲁木齐县供电公司', id: '4', children: [] },
          { text: '五家渠供电公司', id: '5', children: [] },
          { text: '米东供电公司', id: '6', children: [] },
          { text: '西郊供电公司', id: '7', children: [] },
        ]
        return resolve(data)
      }
      if (node.level === 2) {
        searchManagementChannelList({ operationUnit: node.data.key }).then((res) => {
          const data = []
          res.data.forEach((item) => {
            data.push({
              text: item.deviceName,
              id: node.data.key + item.channelId,
              children: [],
            })
          })
          resolve(data)
        })
      }
      if (node.level > 2)
        return resolve([])
    }

    // 初始化 items 数据
    loadNode({ level: 0, childNodes: [] }, (data) => {
      items.value = data
    })

    return {
      items,
      activeIds,
      activeIndex,
      loadNode,
    }
  },
}
</script>

<template>
  <van-tree-select
    v-model:active-id="activeIds"
    v-model:main-active-index="activeIndex"
    :items="items"
  />
</template>
