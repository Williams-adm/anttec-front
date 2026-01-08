<script setup lang="ts">
import { useUIStore } from '@/stores/useUIStore'
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { adminSidebarLinks } from '@/config/adminSidebar'

const ui = useUIStore()
const links = adminSidebarLinks

const route = useRoute()
const activeRoutes = computed(() => {
  const currentName = typeof route.name === 'string' ? route.name : ''

  const map: Record<string, boolean> = {}

  links.forEach((link) => {
    // padre sin hijos
    if (!link.children) {
      map[link.route] = currentName.startsWith(link.route)
      return
    }

    // padre con hijos
    const isParentActive = currentName.startsWith(link.route)

    map[link.route] = isParentActive

    link.children.forEach((child) => {
      map[child.route] = currentName.startsWith(child.route)

      // activar padre si el hijo está activo
      if (map[child.route]) {
        map[link.route] = true
      }
    })
  })

  return map
})

const open = reactive<Record<string, boolean>>({})
</script>

<template>
  <aside
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
    :class="{ '-translate-x-full': !ui.isSidebarOpen }"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li v-for="link in links" :key="link.name">
          <div v-if="!link.children">
            <router-link
              :to="{ name: link.route }"
              :class="[
                'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
                activeRoutes[link.route] ? 'bg-gray-100 dark:bg-gray-700' : '',
              ]"
            >
              <font-awesome-icon
                :icon="link.icon"
                size="xl"
                :class="[
                  'transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white',
                  activeRoutes[link.route]
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-400',
                ]"
              />
              <span class="flex-1 ms-3 whitespace-nowrap">{{ link.name }}</span>
            </router-link>
          </div>

          <div v-else>
            <button
              @click="open[link.name] = !open[link.name]"
              type="button"
              :class="[
                'flex items-center w-full justify-between p-2 text-body rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
                activeRoutes[link.route] ? 'bg-gray-100 dark:bg-gray-700' : '',
              ]"
            >
              <font-awesome-icon
                :icon="link.icon"
                size="xl"
                :class="[
                  'transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white',
                  activeRoutes[link.route]
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-400',
                ]"
              />
              <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{{
                link.name
              }}</span>
              <font-awesome-icon
                :icon="open[link.name] ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"
                size="xl"
                :class="[
                  'transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white',
                  activeRoutes[link.route]
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-400',
                ]"
              />
            </button>

            <ul v-show="open[link.name]" class="py-2 space-y-2">
              <li v-for="child in link.children" :key="child.name">
                <router-link
                  :to="{ name: child.route }"
                  :class="[
                    'pl-6 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
                    activeRoutes[child.route] ? 'bg-gray-100 dark:bg-gray-700' : '',
                  ]"
                >
                  <font-awesome-icon
                    :icon="child.icon"
                    size="xl"
                    :class="[
                      'transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white',
                      activeRoutes[child.route]
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-400',
                    ]"
                  />
                  <span class="flex-1 ms-2 whitespace-nowrap">{{ child.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>
