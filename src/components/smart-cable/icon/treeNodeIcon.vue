<template>
    <svg t="1714477937816" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="5189" :width="iconwidth" :height="iconheight">
        <path
            d="M473.6 499.072V395.648H302.272a12.8 12.8 0 0 1-12.8-12.8v-294.4c0-7.04 5.76-12.8 12.8-12.8h422.4c7.04 0 12.8 5.76 12.8 12.8v294.4a12.8 12.8 0 0 1-12.8 12.8H550.4v103.424h279.04c7.04 0 12.8 5.696 12.8 12.8v165.44h135.04c7.04 0 12.8 5.76 12.8 12.8v230.4a12.8 12.8 0 0 1-12.8 12.8h-358.4a12.8 12.8 0 0 1-12.8-12.8v-230.4c0-7.04 5.76-12.8 12.8-12.8h146.56v-101.44h-499.2v101.44h140.8c7.04 0 12.8 5.76 12.8 12.8v230.4a12.8 12.8 0 0 1-12.8 12.8H48.64a12.8 12.8 0 0 1-12.8-12.8v-230.4c0-7.04 5.76-12.8 12.8-12.8h140.8v-165.44c0-7.104 5.76-12.8 12.8-12.8H473.6z"
            fill="#138D75" p-id="5190"></path>
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