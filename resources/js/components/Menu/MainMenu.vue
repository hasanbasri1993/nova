<template>
  <div
    v-if="hasItems"
    class="sidebar-menu space-y-6"
    dusk="sidebar-menu"
    role="navigation"
  >
    <component
      :key="item.key"
      :is="item.component"
      v-for="(item, index) in mainMenu"
      :item="item"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({
  name: 'MainMenu',
})

const store = useStore()

const mainMenu = computed(() => store.getters.mainMenu)
const hasItems = computed(() => mainMenu.value.length > 0)
</script>
