<script setup lang="ts">
import { useBreadcrumb } from '@/composables/useBreadcrumb'
import AnimationLoader from '@/components/AnimationLoader.vue'
import { useSweetAlert } from '@/composables/useSweetAlert'
import type { productCreateDTO } from '@/DTOs/admin/product/ProductCreateDTO'
import { createProductSchema } from '@/schemas/admin/product/createProductValidationSchema'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import ButtonSave from '@/components/Admin/ButtonSave.vue'
import type { brandI } from '@/interfaces/admin/BrandInterface'
import BrandService from '@/services/admin/BrandService'
import ProductService from '@/services/admin/ProductService'
import type { subcategoryI } from '@/interfaces/admin/SubcategoryInterface'
import SubcategoryService from '@/services/admin/SubcategoryService'

useBreadcrumb([
  { name: 'Dashboard', route: 'admin.dashboard' },
  { name: 'Productos', route: 'admin.catalog.products' },
  { name: 'Crear' },
])

const brands = ref<brandI[] | null>(null)
const subcategories = ref<subcategoryI[] | null>(null)
const error = ref<string | null>(null)

const isLoading = ref(true)
const serverErrors = ref<Record<string, string[]>>({})

const loadBrands = async () => {
  try {
    brands.value = await BrandService.getAllList()
  } catch (err) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    error.value = 'No se pudieron cargar las categorías.'
    console.error(err)
  }
}

const loadSubcategories = async () => {
  try {
    subcategories.value = await SubcategoryService.getAllList()
  } catch (err) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    error.value = 'No se pudieron cargar las categorías.'
    console.error(err)
  }
}

const { meta, handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema: createProductSchema,
  initialValues: {
    brand_id: '',
    subcategory_id: '',
    name: '',
    model: '',
    description: '',
  },
})
const [name, nameAttrs] = defineField('name')
const [brandId, brandIdAttrs] = defineField('brand_id')
const [subcategoryId, subcategoryIdAttrs] = defineField('subcategory_id')
const [model, modelAttrs] = defineField('model')
const [description, descriptionAttrs] = defineField('description')

onMounted(async () => {
  isLoading.value = true
  await Promise.all([loadBrands(), loadSubcategories()])
  isLoading.value = false
})

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    useSweetAlert({
      title: 'Enviando...',
      text: 'Procesando el formulario',
      icon: 'loading',
    })

    await ProductService.create(values as productCreateDTO)
    Swal.close()

    useSweetAlert({
      title: 'Producto creado',
      text: 'El producto ha sido creado con éxito',
      icon: 'success',
    })
    resetForm()
  } catch (err) {
    Swal.close()
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      const validationErrors = err.response.data.errors
      serverErrors.value = validationErrors
      const veeValidateErrors: Record<string, string> = {}
      Object.keys(validationErrors).forEach((field) => {
        veeValidateErrors[field] = validationErrors[field][0]
      })
      setErrors(veeValidateErrors)
    }
    useSweetAlert({
      title: 'Algo salió mal',
      text: 'Verifica los datos e intenta de nuevo',
      icon: 'error',
      timer: 0,
    })
  }
})
</script>

<template>
  <AnimationLoader v-if="isLoading" />
  <div
    v-else
    class="block p-5 border rounded-lg shadow-sm bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <form action="" method="POST" @submit="onSubmit">
      <div class="mb-4">
        <label for="brand_id" class="block mb-2 font-medium text-gray-900 dark:text-gray-200">
          Marcas
        </label>
        <select
          v-model="brandId"
          v-bind="brandIdAttrs"
          id="brand_id"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:cursor-not-allowed focus:outline-none focus:ring-1"
        >
          <option disabled selected value="">Selecciona una marca</option>
          <option :value="brand.id" v-for="(brand, index) in brands" :key="index">
            {{ brand.name }}
          </option>
        </select>
        <span class="text-red-400">{{ errors.brand_id }}</span>
      </div>
      <div class="mb-4">
        <label for="subcategory_id" class="block mb-2 font-medium text-gray-900 dark:text-gray-200">
          Subcategorias
        </label>
        <select
          v-model="subcategoryId"
          v-bind="subcategoryIdAttrs"
          id="subcategory_id"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:cursor-not-allowed focus:outline-none focus:ring-1"
        >
          <option disabled selected value="">Selecciona una subcategoría</option>
          <option :value="subcategory.id" v-for="(subcategory, index) in subcategories" :key="index">
            {{ subcategory.name }}
          </option>
        </select>
        <span class="text-red-400">{{ errors.subcategory_id }}</span>
      </div>
      <div class="mb-4">
        <label for="name" class="block mb-2 font-medium text-gray-900 dark:text-gray-200">
          Nombre
        </label>
        <input
          v-model="name"
          v-bind="nameAttrs"
          id="name"
          type="text"
          class="mb-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-1"
          placeholder="Ingrese el nombre del producto"
        />
        <span class="text-red-400">{{ errors.name }}</span>
      </div>
      <div class="mb-4">
        <label for="model" class="block mb-2 font-medium text-gray-900 dark:text-gray-200">
          Modelo
        </label>
        <input
          v-model="model"
          v-bind="modelAttrs"
          id="model"
          type="text"
          class="mb-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-1"
          placeholder="Ingrese el modelo del producto"
        />
        <span class="text-red-400">{{ errors.model }}</span>
      </div>
      <div class="mb-4">
        <label for="description" class="block mb-2 font-medium text-gray-900 dark:text-gray-200">
          Descripción
        </label>
        <textarea
          v-model="description"
          v-bind="descriptionAttrs"
          id="description"
          rows="4"
          class="block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:outline-none focus:ring-1"
          placeholder="Ingrese una descripción para el producto"
        ></textarea>
        <span class="text-red-400">{{ errors.description }}</span>
      </div>
      <div class="flex justify-end">
        <ButtonSave name="Guardar" :disabled="!meta.valid" />
      </div>
    </form>
  </div>
</template>
