<template>
  <v-app>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            {{ $t("DATASET.EDITDATASET") }} <span class="mx-1" style="color: #42A5F5">{{ !loading && datasetObject ? datasetObject.name : $route.params.DatasetId }}</span>

            <v-spacer></v-spacer>
            <v-btn
                depressed

                @click.prevent="saveItem"

                class="btn btn-primary mr-4 text-dark text-hover-light">{{ $t("GENERAL.SAVECHANGES")}}</v-btn>

            <v-btn
                depressed

                @click.stop="deleteDialog = true"

                class="btn btn-danger text-dark text-hover-light">{{ $t("DATASET.DELETEDATASET")}}</v-btn>
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
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.name"
                        style=""
                        :label="$t('USER.NAME')" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                        filled dense rounded

                        v-model="datasetObject.description"
                        style=""
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

                        label="Type"
                        :hint="$t('GENERAL.TYPE')"

                        dir="ltr"/>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="datasetObject.questionType"



                        :hint="$t('GENERAL.QUESTIONTYPE')"

                        label="Question Type"
                        dir="ltr"/>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="datasetObject.answerReplicationCount"


                        :hint="$t('DATASET.ANSWERREPLICATIONCOUNT')"

                        label="Answer Replication Count"
                        dir="ltr" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <div data-app>
      <v-dialog
          v-model="deleteDialog"
          max-width="290"
      >
        <v-card>
          <v-card-title class="headline">{{ $t("GENERAL.DELETE") }}</v-card-title>

          <v-card-text>
            {{ $t("DATASET.YOUAREDELETINGDATASET") }}: {{datasetObject.name}}
            <br>
            {{ $t("GENERAL.NOTICE") }}: {{ $t("DATASET.YOUCANNOTRESTOREYOURDATASET") }}
            <br>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                text

                :loading="deleting"
                @click="deleteItem"

                color="error"
            >
              {{ $t("GENERAL.YESDELETE") }}
            </v-btn>

            <v-btn
                color="green darken-1"
                text
                @click="deleteDialog = false"
            >
              {{ $t("GENERAL.NO") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

  </v-app>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  name: "DatasetTargets",
  data() {
    return {
      datasetObject: {
        questionType: 0,
        answerBudgetCountPerUser: 100,
        isActive: false,
        labelingStatus: false
      },
      deleteDialog: false,
      loading: false,
      deleting: false
    };
  },
  methods:{
    async getItem() {
      this.loading = true;
      try {
        const dataset = await this.$http.get(`/api/services/app/Datasets/Get?id=${this.$route.params.DatasetId}`);
        if(dataset.data && dataset.data.result) {

          this.$set(this, "datasetObject", {
            ...this.datasetObject,
            ...dataset.data.result
          });

        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async saveItem() {
      this.loading = true;
      const data = {
        type: 0,
        dataSetId: this.$route.params.DatasetId,
        dataSet: null,
        ...this.datasetObject
      }

      try {
        const result = await this.$http.put(`/api/services/app/DataSets/Update`, data);
        if(result.status == 200) {
          this.$bvToast.toast(this.$t("DATASET.DATASETSUCCESSFULLYUPDATED"), {
            title: `Done`,
            variant: 'success',
            solid: true
          })
        }
      } catch (error) {
        console.log(error);
        this.$bvToast.toast('Dataset update failed. Check your console for more', {
          title: `Error`,
          variant: 'danger',
          solid: true
        });
      }
      this.loading = false;
    },
    async deleteItem() {
      this.deleting = true;

      try {
        const result = await this.$http.delete(`/api/services/app/DataSets/Delete?id=${this.datasetObject.id}`);
        if(result.status == 200) {
          this.$bvToast.toast('Dataset successfully deleted', {
            title: `Done`,
            variant: 'success',
            solid: true
          });
          this.$router.back();
          this.$router.back();
        }
      } catch (error) {
        console.log(error);
        this.$bvToast.toast('Dataset delete failed. Check your console for more', {
          title: `Error`,
          variant: 'danger',
          solid: true
        });
      }
      this.deleting = false;
    },
    setBreadcrumbs() {
      this.$store.dispatch(SET_BREADCRUMB, [
        { title: this.$t("DATASET.MANAGEDATASETS"), route: "/dataset/list" },
        { title: `${this.$t("DATASET.DATASET")} ${this.datasetObject && this.datasetObject.name ? this.datasetObject.name : this.$route.params.DatasetId.substr(0, 10) + "..."}`, route: `/dataset/${this.$route.params.DatasetId}/singleDataset` },
        { title: this.$t("DATASET.EDITDATASET")},
      ]);
    }
  },
  mounted() {
    this.setBreadcrumbs();
    this.getItem();
  },
  watch: {
    datasetObject() {
      this.setBreadcrumbs();
    }
  }
}
</script>

<style scoped>

</style>
