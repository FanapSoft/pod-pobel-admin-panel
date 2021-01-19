<template>
  <v-app style="background-color: transparent">
    <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            Transactions
            <v-spacer></v-spacer>
            <span>{{pagination.realCount}}</span>
          </v-card-title>
          <v-row>
            <v-col cols="12" class="px-6">
              <v-chip
                  close

                  @click="$router.push('/users/list?showTransactionsBtn=true')"
                  @click:close="removeQueryItem('ownerId')">User: {{ownerId}}</v-chip>
              <v-chip
                  close

                  @click="$router.push('/dataset/list')"
                  @click:close="removeQueryItem('datasetId')">Dataset: {{datasetId}}</v-chip>
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
            <template v-slot:item.ind="{ item }">
              {{ (pagination.skip ? pagination.skip + transactions.indexOf(item) + 1 : transactions.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.creditAmount="{ item }">
              <div style="direction: ltr">
                <span class="d-inline-block mr-3">تومان</span>
                <span class="d-inline-block">{{ (item.creditAmount).toFixed(3) }}</span>
              </div>
            </template>
            <template v-slot:item.dateTime="{ item }">
              {{ new Date(item.creationTime).toLocaleDateString("fa-IR") }}
              <br>
              {{ new Date(item.creationTime).toLocaleTimeString().split(" ")[0] }}
            </template>
            <template v-slot:item.referenceDataSetId="{ item }">
              <div class="d-inline-block">
                <DatasetDetails
                    :key="item.referenceDataSetId"
                    :item="item"
                    @dataset-details="name => {item.datasetName = name}">

                </DatasetDetails>
              </div>
            </template>


          </v-data-table>
          <v-row class="ma-0">
            <v-col>
              <v-pagination
                  v-model="pagination.currentPage"
                  :length="pagination.count"></v-pagination>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import { SET_OWNER_ID, SET_DATASET_ID } from "@/core/services/store/transactionsList.module";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

import DatasetDetails from "./DatasetDetails";

export default {
  data() {
    return {
      transactions: null,
      listHeaders: [
        { text: "Row", value: "ind" },
        { text: "creditAmount", value: "creditAmount" },
        { text: "Date & Time", value: "dateTime"},
        { text: "Dataset", value: "referenceDataSetId"},

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
        "datasetId"
    ])
  },
  methods:{
    async getItems(page) {
      this.calcCurrentPage(page)
      this.loading = true;
      const data = {
        OwnerId: this.ownerId,
        DatasetId: this.datasetId,
        SkipCount: this.pagination.skip,
        MaxResultCount: this.pagination.perPage
      };

      try {
        const transactions = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Transactions/GetAll`, data));
        if(transactions.data && transactions.data.result) {

          this.transactions = transactions.data.result.items;
          this.pagination.count = transactions.data.result.totalCount ? Math.ceil(transactions.data.result.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = transactions.data.result.totalCount;
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
      if (item == 'ownerId')
        this.$store.commit(SET_OWNER_ID, null);
      if (item == 'datasetId')
        this.$store.commit(SET_DATASET_ID, null);

      this.refreshList()
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Transactions"}]);

    if(this.$route.query.OwnerId) {
      this.$store.commit(SET_OWNER_ID, this.$route.query.OwnerId);
      //this.ownerId = this.$route.query.OwnerId;
    }
    if(this.$route.query.DatasetId) {
      this.$store.commit(SET_DATASET_ID, this.$route.query.DatasetId);
    }

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    }
  }
};
</script>
