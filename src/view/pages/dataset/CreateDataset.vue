<template>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            {{ $t("DATASET.CREATENEWDATASET") }}
            <v-spacer></v-spacer>
                <v-btn
                    depressed

                    @click.prevent="saveItem"

                    class="btn btn-primary text-dark text-hover-light">{{ $t("GENERAL.CREATE") }}</v-btn>
          </v-card-title>
        </v-card>
        <v-card v-if="loading">
          <v-skeleton-loader
              type="card-avatar, article, actions"
          ></v-skeleton-loader>
        </v-card>
        <v-card v-if="!loading && !datasetObject">
          {{ $t('DATASET.DATASETNOTFOUND') }}
        </v-card>
        <v-row v-if="!loading && datasetObject">
          <v-col
              cols="12"
              class="pb-0">
            <v-card class="mb-4">
<!--              <v-card-title>Target {{datasetObject.name}}</v-card-title>-->
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.name"

                        :label="$t('USER.NAME')" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.description"

                        :label="$t('GENERAL.DESCRIPTION')" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                        filled dense rounded

                        v-model="datasetObject.isActive"
                        :label="$t('DATASET.DATASETSTATUS')" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                        filled dense rounded

                        v-model="datasetObject.labelingStatus"
                        :label="$t('DATASET.LABELINGSTATUS')" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="datasetObject.answerBudgetCountPerUser"
                        label="Answer Budget Count"
                        :hint="$t('DATASET.ANSWERBUDGETCOUNT')"
                        dir="ltr"/>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="datasetObject.type"

                        :hint="$t('GENERAL.TYPE')"

                        label="Type"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="datasetObject.questionType"

                        :hint="$t('GENERAL.QUESTIONTYPE')"

                        label="Question Type"
                        dir="ltr" />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="datasetObject.answerReplicationCount"

                        :label="$t('DATASET.ANSWERREPLICATIONCOUNT')"

                        hint="Answer Replication Count"
                        dir="ltr" />
                  </v-col>

                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
</template>

<script>
import { SET_BREADCRUMB, ADD_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  name: "DatasetTargets",
  data() {
    return {
      datasetObject: {
        name: '',
        description: '',
        questionType: 0,
        answerBudgetCountPerUser: 100,
        type: 0
      },
      loading: false,
    };
  },
  methods:{
    async saveItem() {
      this.loading = true;
      const data = {
        type: 0,
        dataSetId: this.$route.params.DatasetId,
        dataSet: null,
        ...this.datasetObject
      }

      try {
        const result = await this.$http.post(`/api/services/app/DataSets/Create`, data);
        if(result.status == 200) {
          this.$bvToast.toast(this.$t("DATASET.DATASETSUCCESSFULLYSAVED"), {
            title: `Done`,
            variant: 'success',
            solid: true
          })
        }
      } catch (error) {
        console.log(error);
        this.$bvToast.toast('Dataset creation failed. Check your console for more', {
          title: `Error`,
          variant: 'danger',
          solid: true
        });
      }
      this.loading = false;
    }
  },
  mounted() {
    //this.$store.dispatch(ADD_BREADCRUMB, [{ title: `Create Dataset`, route: `/dataset/create` }]);
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("DATASET.MANAGEDATASETS"), route: "/dataset/list" },
      { title: this.$t("DATASET.CREATEDATASET") },
    ]);
  }
}
</script>

<style scoped>

</style>
