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
          <img :src="`${axios.defaults.baseURL}/api/File/Dataset/Item/${answer.DatasetItemId}`">
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
      if(this.answer && this.answer.QuestionObject) {
        return JSON.parse(this.answer.QuestionObject).Title
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
        const dataset = await this.$http.get(`/api/DatasetItems/Get/${this.itemId}`);
        if(dataset.data ) {
          this.datasetItem = dataset.data;
          this.$emit('dataset-item-details', dataset.data.Name)
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
