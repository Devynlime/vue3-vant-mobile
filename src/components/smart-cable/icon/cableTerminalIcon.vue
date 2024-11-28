<template>
    <svg t="1721754649257" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="29525" :width="iconwidth" :height="iconheight">
        <path d="M806.4 215.04v591.872H215.04V215.04h591.36m59.392-59.392H155.648v710.144h710.144V155.648z" p-id="29526"
        :fill="iconcolor"></path>
        <path d="M492.544 538.624l-107.52 150.016-107.52-150.016h215.04z m0 0" p-id="29527" :fill="iconcolor"></path>
        <path d="M377.856 332.8h13.824v206.336h-13.824z" p-id="29528" :fill="iconcolor"></path>
        <path d="M743.936 538.624l-107.52 150.016-107.52-150.016h215.04z m0 0" p-id="29529" :fill="iconcolor"></path>
        <path d="M629.76 332.8h13.824v206.336H629.76z" p-id="29530" :fill="iconcolor" ></path>
    </svg>
</template>

<script setup>
defineProps({
    iconwidth: {
        type: Number,
        required: true,
        default: 32
    },
    iconheight: {
        type: Number,
        required: true,
        default: 32
    },
    iconcolor: {
        type: String,
        required: false,
        default: "#13227a"
    }
})
</script>