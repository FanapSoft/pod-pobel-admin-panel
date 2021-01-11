<template>
  <div >
    <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            Transactions
            <v-spacer></v-spacer>
<!--            <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
            ></v-text-field>-->
          </v-card-title>
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

              item-key="objectId"
              class="elevation-1">
            <template v-slot:item.ind="{ item }">
              {{ (pagination.skip ? pagination.skip + transactions.indexOf(item) + 1 : transactions.indexOf(item) + 1) }}
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
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  data() {
    return {
      transactions: null,
      ownerId: null,
      datasetId: null,
      //search: null,
      listHeaders: [
        { text: "Row", value: "ind" },
        { text: "creditAmount", value: "creditAmount" },
        {
          text: "debitAmount",
          /*align: "left",*/
          sortable: false,
          value: "debitAmount"
        },
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
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Transactions", route: "transaction" }]);

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    }
  }
};
</script>
