<template>
    <svg t="1721272464723" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4524" :width="iconwidth" :height="iconheight">
        <path
            d="M521.6 0h-384a64 64 0 0 0-64 64v896a64 64 0 0 0 64 64h384a64 64 0 0 0 64-64V64a64 64 0 0 0-64-64z m-64 837.12h-256v-92.8h256z m0-186.24h-256V558.08h256z m0-186.24h-256V371.84h256z m0-186.24h-256V185.6h256zM714.88 348.8L646.4 416.64A131.84 131.84 0 0 1 685.44 512a128 128 0 0 1-39.04 94.08l68.48 67.84a231.04 231.04 0 0 0 0-324.48z"
            :fill="iconcolor" p-id="4525"></path>
        <path d="M848 215.68l-67.84 67.84a320 320 0 0 1 0 455.68l67.84 67.84a417.28 417.28 0 0 0 0-591.36z"
        :fill="iconcolor" p-id="4526"></path>
    </svg>
</template>

<script setup>
defineProps({
    iconwidth: {
        type: Number,
        default: 32,
        required: true
    },
    iconheight: {
        type: Number,
        default: 32,
        required: true
    },
    iconcolor: {
        type: String,
        default: "#3B989A",
        required: false
    }
})
</script>