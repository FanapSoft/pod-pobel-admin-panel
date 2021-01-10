<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            Users
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
              disable-sort hide-default-footer show-expand disable-pagination

              :headers="listHeaders"
              :items="users"
              :page.sync="pagination.currentPage"
              :loading="loading"
              :items-per-page="20"
              :expanded.sync="expanded"
              :footer-props="{
                            showFirstLastPage: true,
                            firstIcon: 'mdi-arrow-collapse-left',
                            lastIcon: 'mdi-arrow-collapse-right',
                            prevIcon: 'mdi-minus',
                            nextIcon: 'mdi-plus'
                        }"
              @item-expanded="getUserOfAnItem"

              item-key="objectId"
              class="elevation-1">
            <template v-slot:item.ind="{ item }">
              {{ (pagination.skip ? pagination.skip + messages.indexOf(item) + 1 : messages.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.message="{ item }">
              <p class="mb-0 mt-1">{{ `${item.message}` }}</p>
              <p
                  v-if="item.description && item.description.length"
                  class="mb-0 mb-1" style="color: #203452">
                <v-divider class="my-2"></v-divider>
                <strong style="color: #3F51B5">نتیجه پیگیری:</strong>
                {{ `${item.description}` }}
              </p>
            </template>
            <template v-slot:item.contact_phone="{ item }">
              <v-chip
                  :href="'tel:' + item.contact_phone"
                  @click="$utils.copyText(item.contact_phone)">
                {{ item.contact_phone }}
              </v-chip>
            </template>
            <template v-slot:item.vehicle="{ item }">
              {{ `${item.vehicle} - ${item.barbar}` }}
            </template>
            <template v-slot:item.date="{ item }">
              {{$utils.getJDate(item.createdAt, false)}}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                  block

                  :depressed="item.answered"
                  :color="(item.answered ? '' : 'error')"
                  @click.prevent="switchItemStatus(item)">
                {{(item.answered ? 'بررسی شده' : 'بررسی نشده')}}
              </v-btn>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-row class="d-flex align-center pa-5">

                  <v-text-field
                      outlined hide-details

                      v-model="item.description"
                      label="نتیجه پیگیری"></v-text-field>
                  <v-btn
                      :loading="item.isSavingChanges"
                      @click="updateDescription(item)"

                      class="mr-4"
                      color="primary">ذخیره
                  </v-btn>
                </v-row>
                <v-simple-table
                    v-if="item.userData"

                    class="my-5">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>ستون</th>
                      <th>مقدار</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in userInfoList(item.userData)">
                      <td>{{item.name}}</td>
                      <td>{{ item.value }}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </td>
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
import ApiService from "@/core/services/api.service";

export default {
  data() {
    return {
      users: null,
      search: null,
      listHeaders: [
        { text: "Username", value: "calories" },
        {
          text: "Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Answers", value: "answerCount" },
      ],
      loading: false,
      pagination: {
        limit: 20,
        count: 0,
        realCount: 0,
        skip: 0,
        currentPage: 1,
        perPage: 20
      },
      expanded: [],
    };
  },
  components: {
  },
  methods:{
    async getUsers() {
      this.loading = true;
      try {
        const users = await this.$http.get(`/api/services/app/User/GetAll`);
        if(users.data && users.data.result) {
          this.users = {
            ...this.users,
            ...users.data.result
          };
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;

    },
    resetFields() {
      this.users = [];
      this.refreshList()
    },
    async refreshList() {
      await this.getUsers(this.pagination.currentPage);
    },
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Users", route: "users" }]);

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    }
  }
};
</script>
