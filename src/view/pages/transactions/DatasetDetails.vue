<template>
    <v-tooltip bottom>
      <template

          v-slot:activator="{ on, attrs }">
        <div
            v-on="on"
            v-bind="attrs"
            @mouseover="()=>{if(!dataset) getItem()}">
          <router-link

              :to="`/dataset/${item.referenceDataSetId}/singleDataset`"
              >
            {{ item.datasetName ? item.datasetName : item.referenceDataSetId }}
          </router-link>
        </div>
      </template>
      <span
          v-if="loading">
        Loading..
      </span>
      <span
          v-if="!loading && !dataset"

          class="px-6 py-6">
        No details available
      </span>
      <div
          v-if="dataset">
        <span>{{dataset.name}}</span>
        <br>
        <span>{{dataset.description}}</span>
      </div>
    </v-tooltip>
</template>

<script>
export default {
  name: "DatasetDetails",
  props: {
    item: null
  },
  data () {
    return{
      dataset: null,
      tooltipText: 'No data to show',
      loading: false,
      show: true
    }
  },
  methods: {
    async getItem () {
      this.loading = true;
      try {
        const dataset = await this.$http.get(`/api/services/app/Datasets/Get?id=${this.item.referenceDataSetId}`);
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

  },
}
</script>

<style scoped>

</style>
