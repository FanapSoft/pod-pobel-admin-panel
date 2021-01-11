<template>
  <div >
    <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            Users
            <v-spacer></v-spacer>
            <v-text-field
                single-line hide-details

                @click:append="refreshList"
                @keydown.enter="refreshList"

                v-model="search"
                append-icon="search"
                label="Search"></v-text-field>
          </v-card-title>
          <v-data-table
              v-if="users"

              disable-sort hide-default-footer disable-pagination

              :headers="listHeaders"
              :items="users"
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
              {{ (pagination.skip ? pagination.skip + users.indexOf(item) + 1 : users.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                  small

                  :to="`/transaction/list?OwnerId=${item.id}`">Transactions</v-btn>
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
      users: null,
      isActive: null,
      search: null,
      listHeaders: [
        { text: "Row", value: "ind" },
        { text: "Username", value: "userName" },
        {
          text: "Full Name",
          /*align: "left",*/
          sortable: false,
          value: "fullName"
        },
        { text: "Email", value: "emailAddress" },
        { text: "Actions", value: "actions" },
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
        Keyword: this.search,
        IsActive: this.isActive,
        SkipCount: this.pagination.skip,
        MaxResultCount: this.pagination.perPage
      };

      try {
        const users = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/User/GetAll`, data));
        if(users.data && users.data.result) {

          this.users = users.data.result.items;
          this.pagination.count = users.data.result.totalCount ? Math.ceil(users.data.result.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = users.data.result.totalCount;
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
      this.users = [];
      this.refreshList()
    },
    async refreshList() {
      await this.getItems(this.pagination.currentPage);
    },
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Users", route: "transaction" }]);

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    }
  }
};
</script>
