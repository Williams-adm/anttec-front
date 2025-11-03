<script setup lang="ts">
import AnimationLoader from '@/components/AnimationLoader.vue'
import AuthenticationCard from '@/components/auth/AuthenticationCard.vue'
import ButtonAuth from '@/components/auth/ButtonAuth.vue'
import { useSweetAlert } from '@/composables/useSweetAlert'
import type { loginDTO } from '@/DTOs/auth/LoginDTO'
import AuthService from '@/services/auth/AuthService'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginSchema } from '../../../schemas/auth/loginValidationSchema'

const router = useRouter()

const isLoading = ref(true)
const serverErrors = ref<Record<string, string[]>>({})

const { meta, handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema: loginSchema,
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    useSweetAlert({
      title: 'Iniciando sesión',
      text: 'Espere un momento',
      icon: 'loading',
    })

    await AuthService.login(values as loginDTO)
    Swal.close()
    router.push({ name: 'home' })
  } catch (err) {
    Swal.close()
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 422) {
        const validationErrors = err.response?.data.errors
        serverErrors.value = validationErrors
        const veeValidateErrors: Record<string, string> = {}
        Object.keys(validationErrors).forEach((field) => {
          veeValidateErrors[field] = validationErrors[field][0]
        })
        setErrors(veeValidateErrors)
      } else if (status === 401) {
        useSweetAlert({
          title: 'Credenciales inválidas',
          text: 'El correo o la contraseña no son correctos.',
          icon: 'error',
          timer: 0,
        })
      } else {
        useSweetAlert({
          title: 'Algo salió mal',
          text: 'Intenta de nuevo',
          icon: 'error',
          timer: 0,
        })
      }
    } else {
      useSweetAlert({
        title: 'Error desconocido',
        text: 'Algo salió mal. Intenta más tarde.',
        icon: 'error',
        timer: 0,
      })
    }
  }
})

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  isLoading.value = false
})
</script>

<template>
  <AnimationLoader v-if="isLoading" />
  <AuthenticationCard v-else>
    <form action="" method="POST" @submit="onSubmit">
      <div class="mb-4">
        <label for="email" class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
          >Correo Electronico</label
        >
        <input
          v-model="email"
          v-bind="emailAttrs"
          id="email"
          type="email"
          name="email"
          class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-1"
        />
        <span class="text-red-400">{{ errors.email }}</span>
      </div>

      <div class="mb-6">
        <label for="password" class="block mb-2 font-medium text-gray-700 dark:text-gray-300"
          >Contraseña</label
        >
        <input
          v-model="password"
          v-bind="passwordAttrs"
          id="password"
          name="password"
          type="password"
          class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 focus:outline-none focus:ring-1"
        />
        <span class="text-red-400">{{ errors.password }}</span>
      </div>

      <div class="flex justify-end">
        <ButtonAuth name="INICIAR SESIÓN" :disabled="!meta.valid" />
      </div>
    </form>
  </AuthenticationCard>
</template>
