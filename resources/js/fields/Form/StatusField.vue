<template>
  <DefaultField
    :field="currentField"
    :errors="errors"
    :show-help-text="showHelpText"
    :full-width-content="fullWidthContent"
  >
    <template #field>
      <input
        :id="currentField.uniqueKey"
        :type="inputType"
        :min="inputMin"
        :max="inputMax"
        :step="inputStep"
        v-model="value"
        class="w-full form-control form-input form-control-bordered"
        :class="errorClasses"
        :placeholder="placeholder"
        :autocomplete="currentField.autocomplete"
      />
    </template>
  </DefaultField>
</template>

<script>
import { DependentFormField, HandlesValidationErrors } from '@/mixins'

export default {
  mixins: [HandlesValidationErrors, DependentFormField],

  computed: {
    inputType() {
      return this.currentField.type || 'text'
    },

    inputStep() {
      return this.currentField.step
    },

    inputMin() {
      return this.currentField.min
    },

    inputMax() {
      return this.currentField.max
    },
  },
}
</script>
