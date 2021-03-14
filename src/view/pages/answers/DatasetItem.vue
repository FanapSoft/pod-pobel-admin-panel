<template>
  <div>
    <v-tooltip
        bottom >
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
            rounded
            v-bind="attrs"
            v-on="on"
            class="my-2">
          <img :src="`${axios.defaults.baseURL}/file/dataset/item/${answer.dataSetItemId}`">
        </v-avatar>
      </template>
      <span>{{ datasetItemName }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "DatasetItem",
  props: {
    answer: null
  },
  data(){
    return{
      datasetItem: null,
      loading: false
    }
  },
  computed: {
    datasetItemName(){
      if(this.answer && this.answer.questionObject) {
        return JSON.parse(this.answer.questionObject).Title
      }
      else if(this.loading) {
        return 'Loading...'
      } else {
        return 'بی نام'
      }
    }
  },
  methods: {
    /*async getItem () {
      if(this.datasetItem)
        return;

      this.loading = true;
      try {
        const dataset = await this.$http.get(`/api/services/app/DataSetItems/Get?id=${this.itemId}`);
        if(dataset.data && dataset.data.result) {
          this.datasetItem = dataset.data.result;
          this.$emit('dataset-item-details', dataset.data.result.name)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false;
      }
    }*/
  },
  mounted() {

  }
}
</script>
