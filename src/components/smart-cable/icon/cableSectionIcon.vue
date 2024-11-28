<template>
    <svg t="1721754161960" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="23833" :width="iconwidth" :height="iconheight">
        <path
            d="M1024 304.27671l-128.737892-128.737893-14.634126 14.634126-17.550347-17.550346 43.884704-43.884705L778.242121 0l-254.506542 254.506541-49.73482-49.73482L0 678.684111l345.227519 345.315889L819.19293 550.034589l-20.484241-20.484242z m-272.092237 178.50806l-26.334357-26.334357 178.50806-178.508061 26.334358 26.334358z m81.919294-245.757879l-163.838587 163.838586-17.550346-17.550347 163.838586-163.838586 17.550347 17.550347zM778.242121 93.672547l26.334357 26.334357-207.740964 207.670268-26.334358-26.334357L778.242121 93.672547z"
            :fill="iconcolor" p-id="23834"></path>
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
        default: "#089BAB"
    }
})
</script>