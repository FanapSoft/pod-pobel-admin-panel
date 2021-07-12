<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <v-card class="mb-2 mb-6">
          <v-card-title>
            {{ $t("TARGET.CREATENEWTARGETFORDATASET") }} <span style="margin-left:10px; color: #42A5F5">{{ $route.params.DatasetID }}</span>

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
        <v-card v-if="!loading && !targetObject">
          {{ $t("TARGET.TARGETNOTFOUND") }}
        </v-card>
        <v-row v-if="!loading && targetObject">
          <v-col
              cols="12"
              class="pb-0">
            <v-card class="mb-4">
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
                        label="UMin"

                        :hint="$t('TARGET.UMIN')"
                        dir="ltr"/>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.UMax"
                        :hint="$t('TARGET.UMAX')"

                        label="UMax"
                        dir="ltr" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.AnswerCount"
                        label="Answer Count"

                        dir="ltr"
                        :hint="$t('TARGET.ANSWERCOUNT')" />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                        filled dense rounded persistent-hint

                        v-model="targetObject.GoldenCount"
                        label="Golden Answers Count"

                        :hint="$t('TARGET.GOLDENANSWERSCOUNT')"
                        dir="ltr"/>
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

export default {
  name: "DatasetTargets",
  data() {
    return {
      targetObject: {
        T: 0,
        UMin: 0,
        UMax: 0,
        AnswerCount: 1000,
        GoldenCount: 0,
        BonusTruePositive: 0,
        BonusFalsePositive: 0,
        BonusTrueNegative: 0,
        BonusFalseNegative: 0,
      },
      loading: false,
    };
  },
  methods:{
    async saveItem() {
      this.loading = true;
      const data = {
        Type: 0,
        DatasetId: this.$route.params.DatasetId,
        ...this.targetObject
      }
      try {
        const result = await this.$http.post(`/api/TargetDefinitions/Create`, data);
        if(result.status == 200) {
          this.$bvToast.toast(this.$t('TARGET.TARGETSUCCESSFULLYSAVED'), {
            title: `Done`,
            variant: 'success',
            solid: true
          });
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
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("DATASET.MANAGEDATASETS"), route: "/dataset/list" },
      { title: `${this.$t("DATASET.DATASET")} ${this.$route.params.DatasetId.substr(0, 10)}...`, route: `/dataset/${this.$route.params.DatasetId}/singleDataset` },
      { title: this.$t("TARGET.TARGETS") , route: `/dataset/${this.$route.params.DatasetId}/targets` },
      { title: this.$t("TARGET.CREATETARGET") },
    ]);

  }
}
</script>

<style scoped>

</style>
