<script setup lang="ts">
defineProps<{
  itemCount?: number
}>()
</script>

<template>
  <router-link :to="{ name: '' }" class="relative text-gray-700 hover:text-indigo-600">
    <font-awesome-icon icon="fa-solid fa-cart-shopping" class="text-3xl text-gray-200" />
    <span
      v-if="itemCount && itemCount > 0"
      class="absolute -top-1 -end-2 bg-indigo-600 text-white text-xs rounded-full px-1"
    >
      {{ itemCount }}
    </span>
  </router-link>
</template>
