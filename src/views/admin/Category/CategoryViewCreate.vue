<script setup lang="ts">
import { useBreadcrumb } from '@/composables/useBreadcrumb'
import ButtonSave from '@/components/Admin/ButtonSave.vue';
import { Form, Field, ErrorMessage, type SubmissionHandler } from 'vee-validate';
import { createCategorySchema } from './schemas/createValidationSchema';
import CategoryService from '@/services/admin/CategoryService';
import type { categoryCreateDTO } from '@/DTOs/admin/category/CategoryCreateDTO';
import axios from 'axios';
import { ref } from 'vue';

useBreadcrumb([
  { name: 'Dashboard', route: 'admin.dashboard' },
  { name: 'Categorías', route: 'admin.categories' },
  { name: 'Crear' },
])

const serverErrors = ref<Record<string, string[]>>({});

const onSubmit: SubmissionHandler = async (values, {setErrors}) => {
  try {
    serverErrors.value = {}

    await CategoryService.create(values as categoryCreateDTO);
    console.log("creado")
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      const validationErrors = err.response.data.errors;
      serverErrors.value = validationErrors;
      const veeValidateErrors: Record<string, string> = {};
      Object.keys(validationErrors).forEach(field => {
        veeValidateErrors[field] = validationErrors[field][0];
      });
      setErrors(veeValidateErrors);
    }
    console.error(err)
  }
}
</script>
<template>
  <div class="block p-5 border rounded-lg shadow-sm bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <Form action="" method="POST" :validation-schema="createCategorySchema" @submit="onSubmit">
      <div class="mb-4">
        <label for="name" class="block mb-2 font-medium text-gray-900 dark:text-gray-200">Nombre</label>
        <Field name="name" id="name" type="text" class="mb-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-1" placeholder="Ingrese el nombre de la categoría"/>
        <ErrorMessage name = "name" class="text-red-400"/>
      </div>
      <div class="flex justify-end">
        <ButtonSave name="Guardar"/>
      </div>
    </Form>
  </div>
</template>
