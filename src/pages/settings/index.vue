<script setup lang="ts">
import { showConfirmDialog } from 'vant'
import { useUserStore } from '@/stores'
import { useVConsoleStore } from '@/stores/modules/vconsole'
import { version } from '~root/package.json'

const { t } = useI18n()
const userStore = useUserStore()
const vconsoleStore = useVConsoleStore()
const userInfo = computed(() => userStore.userInfo)

const vconsoleEnabled = ref(localStorage.getItem('vConsole-enabled') === 'true')

const versionClickCount = ref(0)
const router = useRouter()

function Logout() {
  showConfirmDialog({
    title: t('settings.comfirmTitle'),
  })
    .then(() => {
      userStore.logout()
      router.push({ name: 'home' })
    })
    .catch(() => {})
}

function toggleVConsole(checked: boolean) {
  vconsoleStore.toggleVConsole(checked)
}

function handleVersionClick() {
  versionClickCount.value++
  if (versionClickCount.value === 5) {
    router.push('/dev-tools')
    versionClickCount.value = 0
  }
}
</script>

<template>
  <div class="text-center">
    <VanCellGroup :inset="true">
      <van-cell v-if="userInfo.uid" :title="$t('settings.logout')" clickable class="van-text-color" @click="Logout" />

      <van-cell :title="$t('settings.vconsole')" :label="$t('settings.vconsoleDesc')">
        <template #right-icon>
          <van-switch v-model="vconsoleEnabled" size="24" @change="toggleVConsole" />
        </template>
      </van-cell>
    </VanCellGroup>

    <div class="mt-10 text-gray" @click="handleVersionClick">
      {{ $t("settings.currentVersion") }}: v{{ version }}
    </div>
  </div>
</template>

<style scoped>
.van-text-color {
  --van-cell-text-color: var(--van-red);
}
</style>

<route lang="json">
{
  "name": "settings",
  "meta": {
    "title": "我的设置",
    "i18n": "menus.settings"
  }
}
</route>
