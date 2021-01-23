<template>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            Create new dataset
            <v-spacer></v-spacer>
                <v-btn
                    depressed

                    @click.prevent="saveItem"

                    class="btn btn-primary">Create</v-btn>
          </v-card-title>
        </v-card>
        <v-card v-if="loading">
          <v-skeleton-loader
              type="card-avatar, article, actions"
          ></v-skeleton-loader>
        </v-card>
        <v-card v-if="!loading && !datasetObject">
          Dataset Not Found
        </v-card>
        <v-row v-if="!loading && datasetObject">
          <v-col
              cols="12"
              class="pb-0">
            <v-card>
<!--              <v-card-title>Target {{datasetObject.name}}</v-card-title>-->
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.name"
                        style="direction: rtl"
                        label="Name" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.description"
                        style="direction: rtl"
                        label="description" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                        filled dense rounded

                        v-model="datasetObject.isActive"
                        label="Dataset Status" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                        filled dense rounded

                        v-model="datasetObject.labelingStatus"
                        label="Labeling Status" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.uMin"
                        label="uMin" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.uMax"
                        label="uMax" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.t"
                        label="T" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.answerBudgetCountPerUser"
                        label="answerBudgetCountPerUser" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.type"
                        label="Type" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.questionType"
                        label="QuestionType" />
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
        t: 0,
        uMin: 0,
        uMax: 0,
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
          this.$bvToast.toast('Dataset successfully saved', {
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
      { title: "Manage Datasets", route: "/dataset/list" },
      { title: `Create Dataset`, route: `` },
    ]);
  }
}
</script>

<style scoped>

</style>
