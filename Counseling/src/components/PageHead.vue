<template>
  <div class="page-head">
    <p class="page-title">{{ currentTitle }}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentTitle = computed(() => {
  return route.meta.title || '默认标题'
})
</script>