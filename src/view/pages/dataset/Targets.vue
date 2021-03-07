<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>

            {{ $t("TARGET.SELECTATARGETTOMODIFY") }}
            <v-spacer></v-spacer>

          </v-card-title>
        </v-card>
        <v-card v-if="loading">
          <v-skeleton-loader
              type="card-avatar, article, actions"
          ></v-skeleton-loader>
        </v-card>
        <v-card
            v-if="!loading && !targets"

            class="px-6 py-6">
          This dataset has no targets
        </v-card>
        <v-row v-if="!loading && targets">
          <v-col
              v-for="(item, index) in targets"
              :key="index"

              cols="4"
              class="pb-0">
            <v-card :to="`/dataset/${$route.params.DatasetId}/target/${item.id}/edit`">
              <v-card-title>{{ $t("TARGET.EDITTARGET") }} {{item.answerCount}}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { SET_SUBHEADER_ACTION } from "@/core/services/store/subheaderActions.module";

export default {
  name: "DatasetTargets",
  data() {
    return {
      targets: null,
      loading: false
    };
  },
  methods:{
    async getItems() {
      this.loading = true;
      try {
        const targets = await this.$http.get(`/api/services/app/TargetDefinitions/GetAll?DatasetId=${this.$route.params.DatasetId}`);
        if(targets.data && targets.data.result && targets.data.result.items && targets.data.result.items.length) {
          this.targets = targets.data.result.items
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    }
  },
  mounted() {
    const actions = [
      {
        title: this.$t("TARGET.CREATETARGET"),
        link: `/dataset/${this.$route.params.DatasetId}/target/create`
      },
    ];

    this.$store.dispatch(SET_SUBHEADER_ACTION, actions);
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("DATASET.MANAGEDATASETS"), route: "/dataset/list" },
      { title: `${this.$t("DATASET.DATASET")} ${this.$route.params.DatasetId.substr(0, 10)}...`, route: `/dataset/${this.$route.params.DatasetId}/singleDataset` },
      { title: this.$t("TARGET.TARGETS") },
    ]);
    //this.$store.dispatch(SET_BREADCRUMB, [{ title: `Dataset ${this.$route.params.DatasetId}`, route: `/dataset/${this.$route.params.DatasetId}/targets` }]);
    this.getItems();
  }
}
</script>

<style scoped>

</style>
