<template>
    <svg t="1715142904654" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="7214"  :width="iconwidth" :height="iconheight">
        <path d="M61.957097 472.954729 958.330348 472.954729l0 74.705446L61.957097 547.660174 61.957097 472.954729z"
        :fill="iconcolor" p-id="7215"></path>
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