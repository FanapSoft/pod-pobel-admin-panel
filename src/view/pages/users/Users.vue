<template>
    <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            {{ $t("USER.USERS") }}
            <v-spacer></v-spacer>
            <span class="d-inline-block mr-3">{{ pagination.realCount.toLocaleString() }}</span>
            <v-text-field
                single-line hide-details filled dense rounded

                @click:append="refreshList"
                @keydown.enter="refreshList"

                v-model="search"
                append-icon="search"
                :label="$t('GENERAL.SEARCH')"></v-text-field>
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
            <template v-slot:item.fullName="{ item }">
              {{ item.Name + ' ' + item.Surname }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-menu
                  bottom
                  left
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      light
                      icon
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>

                <v-list>
                      <v-list-item
                          :key="0"
                          :to="`${item.Id}/profile/overview`"
                      >
                        <v-list-item-title>View Profile</v-list-item-title>
                      </v-list-item>

                  <v-list-item


                      :to="`/transaction/list?OwnerId=${item.Id}`"
                      :key="0"
                  >
                    <v-list-item-title>Transactions</v-list-item-title>
                  </v-list-item>
                  <v-list-item


                      :to="`/answers?UserId=${item.Id}`"
                      :key="0"
                  >
                    <v-list-item-title>User Answers</v-list-item-title>
                  </v-list-item>

                  <v-list-item


                      :to="`/reports/AnswerCountTrend?UserId=${item.Id}`"
                      :key="0"
                  >
                    <v-list-item-title>Answers Counts Trend</v-list-item-title>
                  </v-list-item>


                </v-list>
              </v-menu>
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
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  data() {
    return {
      users: null,
      isActive: null,
      search: null,
      listHeaders: [
        { text: this.$t("GENERAL.ROW"), value: "ind" },
        { text: this.$t("USER.USERNAME"), value: "UserName" },
        {
          text: this.$t("USER.FULLNAME"),
          /*align: "left",*/
          sortable: false,
          value: "fullName"
        },
        { text: this.$t("USER.EMAIL"), value: "Email" },
        { text: this.$t("GENERAL.ACTIONS"), value: "actions" },
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
        Skip: this.pagination.skip,
        Limit: this.pagination.perPage
      };

      try {
        const users = await this.$http.get(this.$utils.addParamsToUrl(`/api/User/GetAll`, data));
        if(users.data) {
          this.users = users.data.items;
          this.pagination.count = users.data.totalCount ? Math.ceil(users.data.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = users.data.totalCount;
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
    this.$store.dispatch(SET_BREADCRUMB, [{ title: this.$t("USER.USERS")}]);

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    }
  }
};
</script>
