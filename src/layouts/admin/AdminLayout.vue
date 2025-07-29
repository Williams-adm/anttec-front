<script setup lang="ts">
import AdminHeader from '@/layouts/admin/components/AdminHeader.vue';
import AdminAsideHeader from '@/layouts/admin/components/AdminAsideHeader.vue';
</script>

<template>
  <AdminHeader/>
  <AdminAsideHeader/>
  <div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
      <router-view></router-view>
    </div>
  </div>
</template>
