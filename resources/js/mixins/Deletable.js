import filter from 'lodash/filter'

export default {
  methods: {
    /**
     * Open the delete menu modal.
     */
    openDeleteModal() {
      this.deleteModalOpen = true
    },

    /**
     * Delete the given resources.
     *
     * @param {int[]|string[]} resources
     * @param {Function|null} [callback=null]
     */
    deleteResources(resources, callback = null) {
      if (this.viaManyToMany) {
        return this.detachResources(resources)
      }

      return Nova.request({
        url: '/nova-api/' + this.resourceName,
        method: 'delete',
        params: {
          ...this.deletableQueryString,
          ...{ resources: mapResources(resources) },
        },
      })
        .then(
          callback
            ? callback
            : () => {
                this.getResources()
              }
        )
        .then(() => {
          Nova.$emit('resources-deleted')
        })
        .finally(() => {
          this.deleteModalOpen = false
        })
    },

    /**
     * Delete the selected resources.
     */
    deleteSelectedResources() {
      this.deleteResources(this.selectedResources)
    },

    /**
     * Delete all of the matching resources.
     */
    deleteAllMatchingResources() {
      if (this.viaManyToMany) {
        return this.detachAllMatchingResources()
      }

      return Nova.request({
        url: this.deleteAllMatchingResourcesEndpoint,
        method: 'delete',
        params: {
          ...this.deletableQueryString,
          ...{ resources: 'all' },
        },
      })
        .then(() => {
          this.getResources()
        })
        .then(() => {
          Nova.$emit('resources-deleted')
        })
        .finally(() => {
          this.deleteModalOpen = false
        })
    },

    /**
     * Detach the given resources.
     */
    detachResources(resources) {
      return Nova.request({
        url: '/nova-api/' + this.resourceName + '/detach',
        method: 'delete',
        params: {
          ...this.deletableQueryString,
          ...{ resources: mapResources(resources) },
          ...{ pivots: mapPivots(resources) },
        },
      })
        .then(() => {
          this.getResources()
        })
        .then(() => {
          Nova.$emit('resources-detached')
        })
        .finally(() => {
          this.deleteModalOpen = false
        })
    },

    /**
     * Detach all of the matching resources.
     */
    detachAllMatchingResources() {
      return Nova.request({
        url: '/nova-api/' + this.resourceName + '/detach',
        method: 'delete',
        params: {
          ...this.deletableQueryString,
          ...{ resources: 'all' },
        },
      })
        .then(() => {
          this.getResources()
        })
        .then(() => {
          Nova.$emit('resources-detached')
        })
        .finally(() => {
          this.deleteModalOpen = false
        })
    },

    /**
     * Force delete the given resources.
     */
    forceDeleteResources(resources, callback = null) {
      return Nova.request({
        url: '/nova-api/' + this.resourceName + '/force',
        method: 'delete',
        params: {
          ...this.deletableQueryString,
          ...{ resources: mapResources(resources) },
        },
      })
        .then(
          callback
            ? callback
            : () => {
                this.getResources()
              }
        )
        .then(() => {
          Nova.$emit('resources-deleted')
        })
        .finally(() => {
          this.deleteModalOpen = false
        })
    },

    /**
     * Force delete the selected resources.
     */
    forceDeleteSelectedResources() {
      this.forceDeleteResources(this.selectedResources)
    },

    /**
     * Force delete all of the matching resources.
     */
    forceDeleteAllMatchingResources() {
      return Nova.request({
        url: this.forceDeleteSelectedResourcesEndpoint,
        method: 'delete',
        params: {
          ...this.deletableQueryString,
          ...{ resources: 'all' },
        },
      })
        .then(() => {
          this.getResources()
        })
        .then(() => {
          Nova.$emit('resources-deleted')
        })
        .finally(() => {
          this.deleteModalOpen = false
        })
    },

    /**
     * Restore the given resources.
     */
    restoreResources(resources, callback = null) {
      return Nova.request({
        url: '/nova-api/' + this.resourceName + '/restore',
        method: 'put',
        params: {
          ...this.deletableQueryString,
          ...{ resources: mapResources(resources) },
        },
      })
        .then(
          callback
            ? callback
            : () => {
                this.getResources()
              }
        )
        .then(() => {
          Nova.$emit('resources-restored')
        })
        .finally(() => {
          this.restoreModalOpen = false
        })
    },

    /**
     * Restore the selected resources.
     */
    restoreSelectedResources() {
      this.restoreResources(this.selectedResources)
    },

    /**
     * Restore all of the matching resources.
     */
    restoreAllMatchingResources() {
      return Nova.request({
        url: this.restoreAllMatchingResourcesEndpoint,
        method: 'put',
        params: {
          ...this.deletableQueryString,
          ...{ resources: 'all' },
        },
      })
        .then(() => {
          this.getResources()
        })
        .then(() => {
          Nova.$emit('resources-restored')
        })
        .finally(() => {
          this.restoreModalOpen = false
        })
    },
  },

  computed: {
    /**
     * Get the delete all matching resources endpoint.
     */
    deleteAllMatchingResourcesEndpoint() {
      if (this.lens) {
        return '/nova-api/' + this.resourceName + '/lens/' + this.lens
      }

      return '/nova-api/' + this.resourceName
    },

    /**
     * Get the force delete all of the matching resources endpoint.
     */
    forceDeleteSelectedResourcesEndpoint() {
      if (this.lens) {
        return (
          '/nova-api/' + this.resourceName + '/lens/' + this.lens + '/force'
        )
      }

      return '/nova-api/' + this.resourceName + '/force'
    },

    /**
     * Get the restore all of the matching resources endpoint.
     */
    restoreAllMatchingResourcesEndpoint() {
      if (this.lens) {
        return (
          '/nova-api/' + this.resourceName + '/lens/' + this.lens + '/restore'
        )
      }

      return '/nova-api/' + this.resourceName + '/restore'
    },

    /**
     * Get the query string for a deletable resource request.
     */
    deletableQueryString() {
      return {
        search: this.currentSearch,
        filters: this.encodedFilters,
        trashed: this.currentTrashed,
        viaResource: this.viaResource,
        viaResourceId: this.viaResourceId,
        viaRelationship: this.viaRelationship,
      }
    },
  },
}

function mapResources(resources) {
  return resources.map(resource => resource.id.value)
}

function mapPivots(resources) {
  return filter(resources.map(resource => resource.id.pivotValue))
}
