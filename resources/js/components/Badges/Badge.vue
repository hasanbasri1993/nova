<template>
  <span
    class="inline-flex items-center whitespace-nowrap min-h-6 px-2 rounded-full uppercase text-xs font-bold"
    :class="extraClasses"
  >
    <slot name="icon" />
    <slot>
      {{ label }}
    </slot>
  </span>
</template>

<script setup>
defineProps({
  label: { type: [Boolean, String], required: false },
  extraClasses: { type: [Array, String], required: false },
})
</script>
