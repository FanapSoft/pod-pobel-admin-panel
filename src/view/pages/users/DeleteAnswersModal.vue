<template>
  <v-dialog
      v-if="user"

      max-width="500"
      v-model="dialogVisibility">
    <v-card max-width="500" >
      <v-card-title>Delete answers of {{user.UserName}}</v-card-title>
      <v-card-text>
        <v-switch
            v-model="limitedPeriod"

            label="Only in this period" />
        <template v-if="limitedPeriod">
          <jalali-date-picker
              clearable

              v-model="dateFrom"

              :placeholder="$t('GENERAL.FROM')"
              :locale="$langIsFa ? 'fa,en': 'en,fa'"
              :locale-config="{
                      fa: {
                        displayFormat: 'jYYYY/jMM/jDD',
                        lang: { label: 'شمسی' }
                      },
                      en: {
                        displayFormat: 'YYYY/MM/DD',
                        lang: { label: 'Gregorian' }
                      }
                    }"
              :editable="true"
              :class="{'ltr-picker': !$langIsFa}"

              format="YYYY/MM/DD"></jalali-date-picker>

          <div class="my-2"></div>

          <jalali-date-picker
              clearable

              v-model="dateTo"

              :placeholder="$t('GENERAL.TO')"
              :locale="$langIsFa ? 'fa,en': 'en,fa'"
              :locale-config="{
                      fa: {
                        displayFormat: 'jYYYY/jMM/jDD',
                        lang: { label: 'شمسی' }
                      },
                      en: {
                        displayFormat: 'YYYY/MM/DD',
                        lang: { label: 'Gregorian' }
                      }
                    }"
              :editable="true"
              :class="{'ltr-picker': !$langIsFa}"

              format="YYYY/MM/DD"
          ></jalali-date-picker>
        </template>
        <v-switch
            v-model="limitToDataset"

            :loading="isLoadingDatasets"

            label="Only in selected dataset" />
        <template v-if="limitToDataset && datasets">
          <v-select
              v-model="selectedDatasetId"
            :items="datasets"
            item-text="Name"
            item-value="Id" />
        </template>

        <div class="py-2">{{ getDeleteStateString() }}</div>
      </v-card-text>

      <v-card-actions>
        <v-btn
            depressed

            :loading="isDeleting"
            @click="deleteItems"

            class="primary">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteAnswersModal",
  props: {
    value: {
      type: Boolean
    },
    user: null
  },
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      limitedPeriod: false,
      isDeleting: false,
      deleteState: 0,
      isLoadingDatasets: false,
      datasets: null,
      selectedDatasetId: null,
      limitToDataset: false
    }
  },
  computed: {
    dialogVisibility: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    async deleteItems() {
      this.isDeleting = true;
      this.deleteState = 1;

      const data = {
        UserId: this.user ? this.user.Id : null,
        From: this.limitedPeriod && this.dateFrom ? new Date(this.dateFrom).toISOString() : null,
        To: this.limitedPeriod && this.dateTo ? new Date(this.dateTo).toISOString() : null,
        DatasetId: this.limitToDataset && this.selectedDatasetId ? this.selectedDatasetId : null,
      };

      try {
        const answers = await this.$http.get(this.$utils.addParamsToUrl(`/api/Answers/RemoveAnswers`, data));
        if (answers.status < 400) {
          this.deleteState = 2;
          console.log(answers.data)
        }
      } catch (error) {
        console.log(error);
        this.deleteState = 3;
      } finally {
        this.isDeleting = false;
      }
    },
    getDeleteStateString() {
      switch (this.deleteState) {
        case 0:
          return '';
        case 1:
          return 'Process is running';
        case 2:
          return 'Succeed';
        case 3:
          return 'Failure, check the console'
      }
    },
    async getDatasets() {
      this.isLoadingDatasets = true;
      const data = {
        Limit: 100
      };

      try {
        const dss = await this.$http.get(this.$utils.addParamsToUrl(`/api/Datasets/GetAll`, data));
        if (dss.status < 400) {
          this.datasets = dss.data.items
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoadingDatasets = false;
      }
    }
  },
  mounted() {
  },
  watch: {
    deleteState(val){
      setTimeout(() => {
        this.deleteState = 0
      }, 5000);
    },
    limitToDataset(val){
      if(val && !this.datasets) {
        this.getDatasets()
      }
    }
  }
}
</script>

<style scoped>

</style>
