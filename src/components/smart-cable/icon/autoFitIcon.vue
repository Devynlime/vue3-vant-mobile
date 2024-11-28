<template>
    <svg t="1724142709818" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4344" :width="iconwidth" :height="iconheight">
        <path
            d="M888.3 907H149.6c-18.5 0-34.6-16.2-34.6-34.6V133.7c0-18.5 16.2-34.6 34.6-34.6h738.7c18.5 0 34.6 16.2 34.6 34.6v738.7c0 18.4-16.1 34.6-34.6 34.6z m-704.1-69.3h669.5V168.3H184.2v669.4z"
            :fill="iconcolor" p-id="4345"></path>
        <path
            d="M761.3 406.1c-16.2 0-30-13.9-30-30v-85.4h-85.4c-16.2 0-30-13.9-30-30s13.9-30 30-30h115.4c16.2 0 30 13.9 30 30v115.4c0 16.1-13.8 30-30 30z m-484.7 0c-16.2 0-30-13.9-30-30V260.6c0-16.2 13.9-30 30-30H392c16.2 0 30 13.9 30 30s-13.9 30-30 30h-85.4V376c0 16.2-13.9 30.1-30 30.1zM392 775.4H276.6c-16.2 0-30-13.9-30-30V630c0-16.2 13.9-30 30-30 16.2 0 30 13.9 30 30v85.4H392c16.2 0 30 13.9 30 30 0 16.2-13.9 30-30 30z m369.3 0H645.9c-16.2 0-30-13.9-30-30 0-16.2 13.9-30 30-30h85.4V630c0-16.2 13.9-30 30-30s30 13.9 30 30v115.4c0 16.2-13.8 30-30 30z"
            :fill="iconcolor" p-id="4346"></path>
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
        default: "#1296DB"
    }
})
</script>