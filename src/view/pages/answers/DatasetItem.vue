<template>
  <div>
    <div
        v-if="dataset"

        @mouseover="getItem">{{datasetItemId}}</div>
    <router-link
        v-else

        :to="`/datasetitems?DatasetId=${dataset.id}`">{{}}</router-link>
  </div>
</template>

<script>
export default {
  name: "datasetITem",
  props: {
    datasetItemId: null,
    dataset: null
  },
  methods: {
    async getItem () {
      this.loading = true;
      try {
        const dataset = await this.$http.get(`/api/services/app/Dataset/Get?id=${this.datasetItemId}`);
        if(dataset.data && dataset.data.result) {
          this.dataset = dataset.data.result;
          this.$emit('dataset-details', dataset.data.result.name)
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    }
  },
  mounted() {

  }
}
</script>
