<template>
    <svg t="1716432877232" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="6802" :width="iconwidth" :height="iconheight">
        <path
            d="M230.4 409.6v384h384V409.6H230.4z m384-76.8h22.1184l102.4-102.4H364.6208l-102.4 102.4H614.4z m76.8 53.9392v375.04l102.4-102.4v-375.04l-102.4 102.4zM691.2 870.4H153.6V332.8l179.2-179.2h537.6v537.6l-179.2 179.2z"
            :fill="iconcolor" p-id="6803"></path>
    </svg>
</template>
<script setup>
defineProps({
    iconwidth: {
        type: Number,
        required: true
    },
    iconheight: {
        type: Number,
        required: true
    },
    iconcolor: {
        type: String,
        required: false
    }
})
</script>