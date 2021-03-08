<template>
  <div>
    <v-card class="mb-5">
      <v-card-title>
        {{ $t("DATASET.DATASETSACTIVITIES") }}
      </v-card-title>
      <v-card-text>
        <v-select
            v-if="datasets"

            filled solo return-object  hide-details

            v-model="selectedItem"

            :items="datasets"

            :label="$t('DATASET.CHOOSEADATASET')">
          <template v-slot:selection="{ item }" >
            {{ (item? item.name : $t('DATASET.CHOOSEADATASET')) }}
          </template>
          <template v-slot:item="{ active, item, attrs, on }">
            <v-list-item
                v-on="on"
                v-bind="attrs"
                #default="{ active }">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row no-gutters>
                    <v-chip
                        label

                        :class="{'success': item.answersCount, 'error': !item.answersCount}"

                        class="mb-2"
                    >{{ item.name }}</v-chip>
                    <v-spacer></v-spacer>
                    {{ $t("BREADCRUMBS.ANSWERS") }}: {{ (item.answersCount ? item.answersCount : '0') }}
                  </v-row>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </v-card-text>
    </v-card>

    <v-row v-if="selectedItem">
      <v-col
          cols="12">
        <v-card>
          <v-card-title>
            <v-chip
                label

                :class="{'success': selectedItem.answersCount, 'error': !selectedItem.answersCount}"

                class="mb-2"
            >{{ selectedItem.name }}</v-chip>
            <v-spacer></v-spacer>
            <v-chip
                label small

                class="mr-1">{{ $t("BREADCRUMBS.TRANSACTIONS") }}: {{(selectedItem.transactionsCount ? selectedItem.transactionsCount : '0')}}</v-chip>
            <v-chip
                label small
            >{{ $t("BREADCRUMBS.ANSWERS") }}: {{ (selectedItem.answersCount ? selectedItem.answersCount : '0') }}</v-chip>

          </v-card-title>
          <v-card-subtitle>{{ selectedItem.description }}</v-card-subtitle>
          <v-divider class="mt-0"></v-divider>
          <user-answers-trend
              v-if="selectedItem"

              :key="selectedItem.id"
              :user="user"
              :dataset="selectedItem"
          ></user-answers-trend>
          <v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { LOAD_USER_OBJECT} from "@/core/services/store/profile.module";
import UserAnswersTrend from "./UserAnswersTrend";

export default {
  name: "custom-page",
  components: {UserAnswersTrend },
  computed: {
    ...mapGetters({user: "profile/user"})
  },
  data() {
    return {
      datasets: null,
      selectedItem: null
    }
  },
  methods: {
    async getItems() {
      this.loading = true;
      try {
        const datasets = await this.$http.get('/api/services/app/DataSets/GetAll');
        if(datasets.data && datasets.data.result && datasets.data.result.items && datasets.data.result.items.length) {
          this.datasets = datasets.data.result.items;
          await this.getanswersCountPerDataset();
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    async getanswersCountPerDataset() {
      for(let ds of this.datasets) {
        this.loading = true;
        const data = {
          UserId: this.$route.params.userId,
          DatasetId: ds.id,
          MaxResultCount: 1
        };

        try {
          const answers = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Answers/GetAll`, data));
          if (answers.data && answers.data.result) {
            this.$set(ds, 'answersCount', answers.data.result.totalCount)
            //ds.answersCount = answers.data.result.totalCount
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    async countTransactions() {
      this.loading = true;
      const data = {
        OwnerId: this.$route.params.userId,
        DatasetId: this.selectedItem.id,
        MaxResultCount: 1
      };
      try {
        const transactions = await this.$http.get(this.$utils.addParamsToUrl('/api/services/app/Transactions/GetAll', data));
        if(transactions.data && transactions.data.result && transactions.data.result.items && transactions.data.result.items.length) {
          this.$set(this.selectedItem, 'transactionsCount', transactions.data.result.totalCount)
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("USER.USERS"), route: `/users/list`},
      { title: this.user ? this.user.name : this.$route.params.userId, route: `/users/${this.user?.id}/profile/overview` },
      { title: this.$t("DATASET.DATASETS")}
    ]);

    this.getItems();
  },
  watch: {
    selectedItem() {
      this.countTransactions();
    }
  }
};
</script>
