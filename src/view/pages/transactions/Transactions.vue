<template>
  <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            {{ $t("BREADCRUMBS.TRANSACTIONS") }}
            <v-spacer></v-spacer>
            <span>{{ pagination.realCount.toLocaleString() }}</span>
          </v-card-title>
          <v-row class="mb-0">
            <v-col cols="12" class="px-6">
              <v-chip
                  close label

                  @click="$router.push('/users/list?showTransactionsBtn=true')"
                  @click:close="removeQueryItem('ownerId')">{{ $t("USER.USER") }}: {{ownerId}}</v-chip>
              <v-chip
                  close label

                  @click="$router.push('/dataset/list')"
                  @click:close="removeQueryItem('datasetId')"
              class="mx-1">{{ $t("DATASET.DATASET") }}: {{datasetId && currentDataset ? currentDataset.Name : ''}}</v-chip>
            </v-col>
          </v-row>
          <v-data-table
              v-if="transactions"

              disable-sort hide-default-footer disable-pagination

              :headers="listHeaders"
              :items="transactions"
              :page.sync="pagination.currentPage"
              :loading="loading"
              :items-per-page="20"
              :footer-props="{
                            showFirstLastPage: true,
                            firstIcon: 'mdi-arrow-collapse-left',
                            lastIcon: 'mdi-arrow-collapse-right',
                            prevIcon: 'mdi-minus',
                            nextIcon: 'mdi-plus'
                        }"

              item-key="id"
              class="elevation-1">
            <template v-slot:header.amount="{ header }">
              <div class="text-center"> قابل برداشت | برداشت شده</div>
            </template>
            <template v-slot:item.ind="{ item }">
              {{ (pagination.skip ? pagination.skip + transactions.indexOf(item) + 1 : transactions.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.amount="{ item }">
              <div class="d-block text-center" >
                <span class="d-inline-block"> {{ (item.CreditAmount).toFixed(3) }} | {{ (item.DebitAmount).toFixed(3) }}</span>
                <br>
                <span class="d-inline-block mx-2">{{ $t("GENERAL.TOMAN") }}</span>
              </div>
            </template>
            <template v-slot:item.dateTime="{ item }">
              {{ new Date(item.CreatedAt).toLocaleDateString($langIsFa ? "fa-IR" : "en-US") }}
              <br>
              {{ new Date(item.CreatedAt).toLocaleTimeString().split(" ")[0] }}
            </template>
            <template v-slot:item.referenceDatasetId="{ item }">
              <div class="d-inline-block">
                <DatasetDetails
                    :key="Math.random()"
                    :item="item">
                </DatasetDetails>
              </div>
            </template>
          </v-data-table>
          <v-pagination
              v-model="pagination.currentPage"
              :total-visible="($vuetify.breakpoint.width - $vuetify.application.left - 404) / 44 - 1"
              :length="pagination.count"

              class="mt-4 pb-2"></v-pagination>
        </v-card>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { SET_OWNER_ID, SET_DATASET_ID } from "@/core/services/store/transactionsList.module";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

import DatasetDetails from "./DatasetDetails";
import {LOAD_DATASET} from "@/core/services/store/datasets.module";

export default {
  data() {
    return {
      transactions: null,
      listHeaders: [
        { text: this.$t("GENERAL.ROW"), value: "ind" },
        { text: this.$t("GENERAL.CREDITAMOUNT"), value: "amount" },
        { text: this.$t("GENERAL.DATEANDTIME"), value: "dateTime"},
        { text: this.$t("DATASET.DATASET"), value: "referenceDatasetId"},

      ],
      loading: false,
      pagination: {
        limit: 10,
        count: 0,
        realCount: 0,
        skip: 0,
        currentPage: 1,
        perPage: 10
      },
      expanded: [],
    };
  },
  components: {
    DatasetDetails
  },
  computed:{
    ...mapGetters([
        "ownerId",
        "datasetId",

    ]),
    ...mapGetters({
      currentDataset: `datasets/currentDataset`
    })
  },
  methods:{
    async getItems(page) {
      this.calcCurrentPage(page)
      this.loading = true;
      const data = {
        OwnerId: this.ownerId,
        ReferenceDatasetId: this.datasetId,
        Skip: this.pagination.skip,
        Limit: this.pagination.perPage
      };

      try {
        const transactions = await this.$http.get(this.$utils.addParamsToUrl(`/api/Transactions/GetAll`, data));
        if(transactions.data) {

          this.transactions = transactions.data.items;
          this.pagination.count = transactions.data.totalCount ? Math.ceil(transactions.data.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = transactions.data.totalCount;
        }
      } catch (error) {
        console.log(error);
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
    resetFields() {
      this.transactions = [];
      this.refreshList()
    },
    async refreshList() {
      await this.getItems(this.pagination.currentPage);
    },
    removeQueryItem(item){
      if (item == 'ownerId'){
        this.$store.commit(SET_OWNER_ID, null);
        let query = Object.assign({}, this.$route.query);
        delete query.OwnerId;
        this.$router.replace({ query });
      }
      if (item == 'datasetId'){
        this.$store.commit(SET_DATASET_ID, null);
        let query = Object.assign({}, this.$route.query);
        delete query.DatasetId;
        this.$router.replace({ query });
      }

      this.refreshList()
    }
  },
  async mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: this.$t("BREADCRUMBS.TRANSACTIONS")}]);

    if(this.$route.query.OwnerId) {
      this.$store.commit(SET_OWNER_ID, this.$route.query.OwnerId);
      //this.ownerId = this.$route.query.OwnerId;
    }
    if(this.$route.query.DatasetId) {
      this.$store.commit(SET_DATASET_ID, this.$route.query.DatasetId);
    }
    await this.$store.dispatch(`datasets/${LOAD_DATASET}`, this.datasetId);

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    }
  }
};
</script>
