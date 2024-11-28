<template>
    <svg t="1719901380174" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="7431" :width="iconwidth" :height="iconheight">
        <path d="M1024 1024H0V0h1024zM78.769231 945.230769h866.461538V78.769231H78.769231z" fill="#1262B3" p-id="7432">
        </path>
        <path
            d="M315.076923 787.692308a118.153846 118.153846 0 1 1 118.153846-118.153846 118.289231 118.289231 0 0 1-118.153846 118.153846z m0-157.538462a39.384615 39.384615 0 1 0 39.384615 39.384616 39.384615 39.384615 0 0 0-39.384615-39.384616z"
            fill="#FF584D" p-id="7433"></path>
        <path
            d="M551.384615 630.153846h315.076923v78.769231H551.384615zM551.384615 334.769231h315.076923v78.769231H551.384615z"
            fill="#1262B3" p-id="7434"></path>
        <path
            d="M291.692308 484l-100.467693-100.455385 55.704616-55.704615L291.692308 372.615385l116.147692-116.16 55.704615 55.704615L291.692308 484z"
            fill="#FF584D" p-id="7435"></path>
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