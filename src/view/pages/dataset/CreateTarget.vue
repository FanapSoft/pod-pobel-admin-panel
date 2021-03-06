<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            Create New Target for Dataset <span style="margin-left:10px; color: #42A5F5">{{ $route.params.DatasetID }}</span>

            <v-spacer></v-spacer>

                <v-btn
                    depressed

                    @click.prevent="saveItem"

                    class="btn btn-primary text-dark text-hover-light">Create</v-btn>

          </v-card-title>
        </v-card>
        <v-card v-if="loading">
          <v-skeleton-loader
              type="card-avatar, article, actions"
          ></v-skeleton-loader>
        </v-card>
        <v-card v-if="!loading && !targetObject">
          Target Not Found
        </v-card>
        <v-row v-if="!loading && targetObject">
          <v-col
              cols="12"
              class="pb-0">
            <v-card>
              <v-card-title>Target {{targetObject.answerCount}}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded

                        v-model="targetObject.t"
                        label="T" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded

                        v-model="targetObject.uMax"
                        label="uMax" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded

                        v-model="targetObject.answerCount"
                        label="Answer Count" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded

                        v-model="targetObject.bonusFalse"
                        label="Bonus False" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded

                        v-model="targetObject.uMin"
                        label="uMin" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded

                        v-model="targetObject.goldenCount"
                        label="Golden Answers Count" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  name: "DatasetTargets",
  data() {
    return {
      targetObject: {
        t: 0,
        uMin: 0,
        uMax: 0,
        answerCount: 1000,
        bonusFalse: 0,
        goldenCount: 0,
        bonusTrue: 0,
      },
      loading: false,
    };
  },
  methods:{
    async saveItem() {
      this.loading = true;
      const data = {
        type: 0,
        datasetId: this.$route.params.DatasetId,
        dataSet: null,
        ...this.targetObject
      }
      try {
        const result = await this.$http.post(`/api/services/app/TargetDefinitions/Create`, data);
        if(result.status == 200) {
          this.$bvToast.toast('Target successfully saved', {
            title: `Done`,
            variant: 'success',
            solid: true
          });
        }
      } catch (error) {
        console.log(error);
        this.$bvToast.toast('Target save failed. Check your console for more', {
          title: `Error`,
          variant: 'danger',
          solid: true
        });
      }
      this.loading = false;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("BREADCRUMBS.MANAGEDATASETS"), route: "/dataset/list" },
      { title: `${this.$t("BREADCRUMBS.DATASET")} ${this.$route.params.DatasetId.substr(0, 10)}...`, route: `/dataset/${this.$route.params.DatasetId}/singleDataset` },
      { title: this.$t("BREADCRUMBS.TARGETS") , route: `/dataset/${this.$route.params.DatasetId}/targets` },
      { title: `Create Target` },
    ]);

  }
}
</script>

<style scoped>

</style>
