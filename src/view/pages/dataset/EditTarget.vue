<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            {{ this.$t("TARGET.EDITTARGET") }} <span class="mx-1" style=" color: #42A5F5">{{ $route.params.TargetId }}</span>

            <v-spacer></v-spacer>

                <v-btn
                    depressed light

                    @click.prevent="saveItem"

                    class="btn btn-primary text-dark text-hover-light">{{ $t("GENERAL.SAVECHANGES")}}</v-btn>

          </v-card-title>
        </v-card>
        <v-card v-if="loading">
          <v-skeleton-loader
              type="card-avatar, article, actions"
          ></v-skeleton-loader>
        </v-card>
        <v-card
            v-if="!loading && !targetObject"

            class="pa-3">
          {{ $t("TARGET.TARGETNOTFOUND") }}
        </v-card>
        <v-row v-if="!loading && targetObject">
          <v-col
              cols="12"
              class="pb-0">
            <v-card>
              <v-card-title>{{ $t("TARGET.TARGET") }}: {{targetObject.AnswerCount}}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.T"

                        :hint="$t('TARGET.CONFIDENCELEVEL')"

                        label="T"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.UMin"
                        label="uMin"

                        :hint="$t('TARGET.UMIN')"
                        dir="ltr"/>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.UMax"
                        label="uMax"

                        :hint="$t('TARGET.UMAX')"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.AnswerCount"
                        label="Answer Count "
                        :hint="$t('TARGET.ANSWERCOUNT')"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.GoldenCount"
                        label="Golden Answers Count "

                        :hint="$t('TARGET.GOLDENANSWERSCOUNT')"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.BonusFalsePositive"
                        label="BonusFalsePositive"

                        :hint="$t('TARGET.DEDUCTIONCOEFFICIENT')"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.BonusTruePositive"
                        label="BonusTruePositive"

                        :hint="$t('TARGET.ADDITIVECOEFFICIENT')"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.BonusFalseNegative"
                        label="BonusFalseNegative"

                        :hint="$t('TARGET.DEDUCTIONCOEFFICIENT')"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.BonusTrueNegative"
                        label="BonusTrueNegative"

                        :hint="$t('TARGET.ADDITIVECOEFFICIENT')"
                        dir="ltr" />
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
import { SET_SUBHEADER_ACTION } from "@/core/services/store/subheaderActions.module";
import { LOAD_DATASET } from "@/core/services/store/datasets.module";
import { mapGetters } from "vuex";

export default {
  name: "DatasetTargets",
  data() {
    return {
      targetObject: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      currentDataset: `datasets/currentDataset`
    })
  },
  methods:{
    async getItem() {
      this.loading = true;
      try {
        const target = await this.$http.get(`/api/TargetDefinitions/Get/${this.$route.params.TargetId}`);
        if(target.status < 400 ) {
          this.targetObject = target.data;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async saveItem() {
      this.loading = true;
      const data = {
        ...this.targetObject
      }
      try {
        const result = await this.$http.put(`/api/TargetDefinitions/Update/${this.targetObject.Id}`, data);
        if(result.status == 200) {
          this.$bvToast.toast(this.$t('TARGET.TARGETSUCCESSFULLYUPDATED'), {
            title: `Done`,
            variant: 'success',
            solid: true
          })
        }
      } catch (error) {
        console.log(error);
        this.$bvToast.toast(this.$t('TARGET.TARGETUPDATEFAILED'), {
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
        const result = await this.$http.delete(`/api/TargetDefinitions/Delete/${this.targetObject.Id}`);
        if(result.status == 200) {
          this.$bvToast.toast('Target successfully deleted', {
            title: `Done`,
            variant: 'success',
            solid: true
          });
          this.$router.back();
        }
      } catch (error) {
        console.log(error);
        this.$bvToast.toast('Target delete failed. Check your console for more', {
          title: `Error`,
          variant: 'danger',
          solid: true
        });
      }
      this.deleting = false;
    }
  },
  async mounted() {
    await this.$store.dispatch(`datasets/${LOAD_DATASET}`, this.$route.params.DatasetId);
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("DATASET.MANAGEDATASETS"), route: "/dataset/list" },
      {
        title: `${this.$t("DATASET.DATASET")} ${ this.currentDataset ? this.currentDataset.Name : this.$route.params.DatasetId.substr(0, 10) + '...'}`,
        route: `/dataset/${this.$route.params.DatasetId}/singleDataset`
      },
      { title: this.$t("TARGET.TARGETS") , route: `/dataset/${this.$route.params.DatasetId}/targets` },
      { title: this.$t("TARGET.EDITTARGET") },
    ]);

    const actions = [
      {
        title: this.$t("TARGET.DELETETARGET"),
        onClick: () => {
          this.deleteItem()
        }
      },
    ];

    this.$store.dispatch(SET_SUBHEADER_ACTION, actions);

    this.getItem();
  }
}
</script>

<style scoped>

</style>
