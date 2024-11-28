<template>
    <svg t="1715143108909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="13051" :width="iconwidth" :height="iconheight">
        <path
            d="M831.89 192l0.11 0.11v639.78l-0.11 0.11H192.11l-0.11-0.11V192.11l0.11-0.11h639.78m0.11-64H192a64.19 64.19 0 0 0-64 64v640a64.19 64.19 0 0 0 64 64h640a64.19 64.19 0 0 0 64-64V192a64.19 64.19 0 0 0-64-64z"
            p-id="13052"></path>
        <path d="M800 224H512v64h288v-64z" p-id="13053"></path>
        <path d="M800 224h-64v288h64V224z" p-id="13054"></path>
        <path d="M745.37 233.37L512 466.75 557.25 512l233.38-233.37-45.26-45.26zM512 736H224v64h288v-64z" p-id="13055">
        </path>
        <path d="M288 512h-64v288h64V512z" p-id="13056"></path>
        <path d="M466.75 512L233.37 745.37l45.26 45.26L512 557.25 466.75 512z" p-id="13057"></path>
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