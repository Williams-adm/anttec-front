<script setup lang="ts">
import { useBreadcrumb } from '@/composables/useBreadcrumb';

useBreadcrumb([
  { name: 'Dashboard', route: 'admin.dashboard' },
  { name: 'Category'}
])
</script>

<template>
  <h1>Aqui va la categoria</h1>
</template>
