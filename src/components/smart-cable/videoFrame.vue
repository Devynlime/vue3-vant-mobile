<template>
    <div class="video-content" >
      <iframe :ref="refName" :src="videoUrl?videoUrl:'public/video/video-play-test.html'" style="width: 100%; height: 100%; border: 1px solid gray;"></iframe>
    </div>
  </template>
  
  <script>
  import { defineEmits } from 'vue'
  export default {
    props: {
      refName: {
        type: String,
        required: true
      },
      videoUrl: {
        type: String,
        required: true
      }
    },
  };
  </script>
  
  <style scoped>
  .video-content {
    height: 100%;
  }
  </style>