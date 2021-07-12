<template>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            {{ $t("DATASET.SELECTADATASET") }}
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
              <v-card :to="`${item.Id}/singleDataset`" :class="{'bg-warning lighten-2': !item.IsActive, 'bg-success lighten-2': item.IsActive}">
                <v-card-title>{{item.Name}}</v-card-title>
                <v-card-subtitle>{{item.Description}}</v-card-subtitle>
                <v-card-text>
                  <div>
                    {{ $t('DATASET.DATASETSTATUS2')}}:
                    <v-badge
                        dot

                        :color="item.IsActive ? 'success': 'error'"

                        class="mr-3"></v-badge>
                    {{ (item.IsActive ? $t("GENERAL.ACTIVE") : $t("GENERAL.INACTIVE")) }}
                  </div>
                  <div>
                    {{ $t('DATASET.LABELINGSTATUS2') }}:
                    <v-badge
                        dot

                        :color="item.LabelingStatus ? 'success': 'error'"

                        class="mr-3"></v-badge>
                    {{ (item.LabelingStatus ? $t("GENERAL.ACTIVE") : $t("GENERAL.INACTIVE")) }}</div>
                </v-card-text>
              </v-card>
            </v-col>
        </v-row>
        <v-row class="mx-9">
          <v-col cols="12" class="position-relative">
            <v-pagination
                v-if="pagination.realCount > 12"
                v-model="pagination.currentPage"
                :total-visible="($vuetify.breakpoint.width - $vuetify.application.left - 404) / 44 - 1"
                :length="pagination.count"

                class="mt-4 pb-2"></v-pagination>
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
      loading: false,
      pagination: {
        limit: 10,
        count: 0,
        realCount: 0,
        skip: 0,
        currentPage: 1,
        perPage: 10
      },
    };
  },
  methods:{
    async getItems() {
      this.loading = true;
      try {
        const datasets = await ApiService.get('/api/Datasets/GetAll', {Limit: 12});
        if(datasets.status < 400 && datasets.data.items.length) {
          this.datasets = datasets.data.items;

          this.pagination.count = datasets.data.totalCount ? Math.ceil(datasets.data.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = datasets.data.totalCount;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    calcCurrentPage(page) {
      if (!page || page == 1) {
        this.pagination.skip = 0;
        this.pagination.currentPage = 1;
      } else if (page > 1) {
        this.pagination.skip = this.pagination.limit * (page - 1);
        this.pagination.currentPage = page;
      }
    },
    async refreshList() {
      await this.getItems(this.pagination.currentPage);
    }
  },
  mounted() {
    this.$store.dispatch(SET_SUBHEADER_ACTION, [
      {
        title: this.$t("DATASET.CREATEDATASET"),
        link: `/dataset/create`
      }
    ]);
    this.$store.dispatch(SET_BREADCRUMB, [{ title: this.$t("DATASET.MANAGEDATASETS"), route: "/dataset/list" }]);
    this.getItems();
  },
  watch: {
    'pagination.currentPage'() {
      this.refreshList();
    }
  }
};
</script>
