<template>
    <van-floating-bubble v-model:offset="offset" @click.stop="onClick" class="bubble" gap="5" axis="xy">
        <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect">
            <template #reference>
                <van-icon name="list-switch" size="30px"></van-icon>
            </template>
        </van-popover>
    </van-floating-bubble>

</template>
<script setup>
import { showToast } from 'vant';
import { useRouter } from 'vue-router';

const router = useRouter();
const onClick = () => {
    // showToast('点击气泡');
    showPopover.value = true;
    // console.log('点击气泡', showPopover.value);
};
const onSelect = (action) => {
    console.log('点击选项：',action);
    switch (action.text) {
        case '总览':
            toOverview();
            break;
        case '设备概览':
            toDeviceOverview();
            break;
        case '视频监控':
            toVideoMonitor();
            break;
        case '返回首页':
            toHome();
            break;
        default:
            break;
    }
};
const toOverview = () => {
    router.push('/smartCable');
};
const toDeviceOverview = () => {
    router.push('/smartCable/dev-overview');
};
const toVideoMonitor = () => {
    router.push('/smartCable/video-surveillance');
};
const toHome = () => {
    router.push('/');
};
const offset = ref({ x: 50, y: 300 });

// 气泡弹窗
const showPopover = ref(false);
const actions = [
    { text: '总览', icon: 'add-o' },
    { text: '设备概览', icon: 'music-o' },
    { text: '视频监控', icon: 'more-o' },
    { text: '返回首页', icon: 'home-o' },
];
</script>
<style>
.bubble {
    --van-floating-bubble-background: #18B495;
    --van-floating-bubble-size: 40px;
}
</style>