<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            Select a dataset
            <v-spacer></v-spacer>
          </v-card-title>
        </v-card>
        <v-card v-if="loading">
          <v-skeleton-loader
              type="article, actions"
          ></v-skeleton-loader>
        </v-card>
        <v-card
            v-if="!loading && !datasets"

            class="px-6 py-6">
          No datasets available
        </v-card>
        <v-row v-else>
            <v-col
                v-for="(item, index) in datasets"
                :key="index"

                cols="4"
                class="pb-0">
              <v-card :to="`${item.id}/targets`">
                <v-card-title>{{item.name}}</v-card-title>
                <v-card-subtitle>{{item.description}}</v-card-subtitle>
              </v-card>
            </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "@/core/services/api.service";
import { SET_SUBHEADER_ACTION } from "@/core/services/store/subheaderActions.module";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  name: 'Datasets',
  data() {
    return {
      datasets: null,
      loading: false
    };
  },
  methods:{
    async getItems() {
      this.loading = true;
      try {
        const datasets = await ApiService.get('/api/services/app/DataSets/GetAll');
        if(datasets.data && datasets.data.result && datasets.data.result.items && datasets.data.result.items.length) {
          this.datasets = datasets.data.result.items
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    }
  },
  mounted() {
    this.$store.dispatch(SET_SUBHEADER_ACTION, [
      {
        title: 'Create Dataset',
        link: `/dataset/create`
      }
    ]);
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Manage Datasets", route: "/dataset/list" }]);
    this.getItems();
  }
};
</script>
