<template>
    <v-tooltip bottom>
      <template

          v-slot:activator="{ on, attrs }">
        <div
            v-on="on"
            v-bind="attrs"
            @mouseover="()=>{loadDataset(item.ReferenceDatasetId)}">
          <router-link

              :to="`/dataset/${item.ReferenceDatasetId}/singleDataset`"
              >
            {{ dataset ? dataset.Name : item.ReferenceDatasetId }}
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
        <span>{{dataset.Name}}</span>
        <br>
        <span>{{dataset.Description}}</span>
      </div>
    </v-tooltip>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {LOAD_DATASET} from "@/core/services/store/datasets.module";

export default {
  name: "DatasetDetails",
  props: {
    item: null
  },
  computed: {
    ...mapGetters({
      getDataset: `datasets/dataset`
    }),
    dataset() {
      return this.getDataset(this.item.ReferenceDatasetId)
    }
  },
  data () {
    return{
      tooltipText: 'No data to show',
      loading: false,
      show: true
    }
  },
  methods: {
    ...mapActions({
      loadDataset: `datasets/${LOAD_DATASET}`
    }),
  },
}
</script>

<style scoped>

</style>
