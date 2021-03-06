<template>
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
              <v-card :to="`${item.id}/singleDataset`" :class="{'bg-warning lighten-2': !item.isActive, 'bg-success lighten-2': item.isActive}">
                <v-card-title>{{item.name}}</v-card-title>
                <v-card-subtitle>{{item.description}}</v-card-subtitle>
                <v-card-text>
                  <div>
                    Dataset Status:
                    <v-badge
                        dot

                        :color="item.isActive ? 'success': 'error'"

                        class="mr-3"></v-badge>
                    {{ (item.isActive ? "Active" : "InActive") }}
                  </div>
                  <div>
                    Labeling Status:
                    <v-badge
                        dot

                        :color="item.labelingStatus ? 'success': 'error'"

                        class="mr-3"></v-badge>
                    {{ (item.labelingStatus ? "Active" : "InActive") }}</div>
                </v-card-text>
              </v-card>
            </v-col>
        </v-row>
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
    this.$store.dispatch(SET_BREADCRUMB, [{ title: this.$t("BREADCRUMBS.MANAGEDATASETS"), route: "/dataset/list" }]);
    this.getItems();
  }
};
</script>
