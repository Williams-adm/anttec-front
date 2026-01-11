<script setup lang="ts">
import BannerShort from './components/BannerShort.vue'
import FooterShop from './components/FooterShop.vue'
import HeaderShop from './components/HeaderShop.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <BannerShort />
    <HeaderShop />
    <main class="flex-1">
      <router-view></router-view>
    </main>
    <FooterShop />
  </div>
</template>
