<template>
    <svg t="1715937935158" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="5745" :width="iconwidth" :height="iconheight">
        <path
            d="M832 704V576h64V128H384v448h192v128H256V0h768v704h-192zM128 896h512V448H448V320h320v704H0V320h192v128H128v448z"
            :fill="iconcolor" p-id="5746"></path>
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