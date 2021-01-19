<template>
  <v-app style="background-color: transparent">
    <div class="row">
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            Answers
            <v-spacer></v-spacer>
            <span>{{ pagination.realCount }}</span>
          </v-card-title>
          <v-row>
            <v-col cols="12" class="px-6">
              <v-chip
                  close

                  @click="$router.push('/users/list?showAnswersBtn=true')"
                  @click:close="removeQueryItem('userId')">User: {{ userId }}
              </v-chip>
              <v-chip
                  close

                  @click="$router.push('/dataset/list')"
                  @click:close="removeQueryItem('datasetId')">Dataset: {{ datasetId }}
              </v-chip>

              <!--              <v-date-picker v-model="dateTo"></v-date-picker>-->
              <!--              <v-chip
                                close

                                @click="$router.push('/dataset/list')"
                                @click:close="removeQueryItem('datasetId')">Dataset Item: {{datasetItemId}}</v-chip>-->
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="3"
            >
              <v-menu
                  ref="dateFromMenu"
                  v-model="dateFromMenu"
                  :close-on-content-click="false"

                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="$store.state['answersList/dateFrom']"
                      label="From"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    no-title scrollable

                    v-model="$store.state['answersList/dateFrom']">
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="()=> {$store.state['answersList/dateFrom'] = ''; dateFromMenu = false; refreshList()}">
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="()=>{$refs.dateFromMenu.save($store.state['answersList/dateFrom']); refreshList()}">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col
                cols="12"
                sm="6"
                md="3">
              <v-menu
                  ref="dateToMenu"
                  v-model="dateToMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="$store.state['answersList/dateTo']"
                      label="To"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    no-title scrollable

                    v-model="$store.state['answersList/dateTo']">
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="()=>{dateToMenu = false; $store.state['answersList/dateTo'] = null; refreshList()}">
                    Cancel
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="()=>{$refs.dateToMenu.save($store.state['answersList/dateTo']); refreshList()}">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-data-table
              v-if="answers"

              disable-sort hide-default-footer disable-pagination

              :headers="listHeaders"
              :items="answers"
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
              {{ (pagination.skip ? pagination.skip + answers.indexOf(item) + 1 : answers.indexOf(item) + 1) }}
            </template>
            <template v-slot:item.dateTime="{ item }">
              {{ new Date(item.creationTime).toLocaleDateString("fa-IR") }}
              <br>
              {{ new Date(item.creationTime).toLocaleTimeString().split(" ")[0] }}
            </template>
            <template v-slot:item.datasetItem="{ item }">
              <DatasetDetails
                  :key="item.dataSetId"
                  :item="{referenceDataSetId: item.dataSetId, datasetName: item.datasetName}"
                  @dataset-details="name => {item.datasetName = name}">
              </DatasetDetails>
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
import {mapState, mapGetters} from 'vuex'
import {
  SET_USER_ID,
  SET_DATASET_ID,
  SET_DATASETITEM_ID,
  SET_DATE_FROM,
  SET_DATE_TO
} from "@/core/services/store/answersList.module";
import {SET_BREADCRUMB} from "@/core/services/store/breadcrumbs.module";

import DatasetDetails from "../transactions/DatasetDetails";

export default {
  data() {
    return {
      answers: null,
      dateFromMenu: false,
      dateToMenu: null,
      listHeaders: [
        {text: "Row", value: "ind"},
        //{ text: "creditAmount", value: "creditAmount" },
        {text: "Date & Time", value: "dateTime"},
        {text: "Answer", value: "answer"},
        {text: "Is Ignored", value: "ignored"},
        {text: "Dataset Item", value: "datasetItem"},

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
  computed: {
    ...mapGetters({
      userId: "answersList/userId",
      datasetId: "answersList/datasetId",
    })
  },
  methods: {
    async getItems(page) {
      this.calcCurrentPage(page)
      this.loading = true;
      const data = {
        IncludeQuestion: true,
        UserId: this.userId,
        DatasetId: this.datasetId,
        From: this.$store.state['answersList/dateFrom'],
        To: this.$store.state['answersList/dateTo'],
        //DatasetItemId: this.datasetId,
        SkipCount: this.pagination.skip,
        MaxResultCount: this.pagination.perPage
      };

      try {
        const answers = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Answers/GetAll`, data));
        if (answers.data && answers.data.result) {

          this.answers = answers.data.result.items;
          this.pagination.count = answers.data.result.totalCount ? Math.ceil(answers.data.result.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = answers.data.result.totalCount;
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
      this.answers = [];
      this.refreshList()
    },
    async refreshList() {
      await this.getItems(this.pagination.currentPage);
    },
    removeQueryItem(item) {
      if (item == 'userId')
        this.$store.commit(`answersList/${SET_USER_ID}`, null);
      if (item == 'datasetId')
        this.$store.commit(`answersList/${SET_DATASET_ID}`, null);
      if (item == 'datasetItemId')
        this.$store.commit(`answersList/${SET_DATASETITEM_ID}`, null);

      this.refreshList()
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{title: "Answers"}]);

    if (this.$route.query.UserId) {
      this.$store.commit(`answersList/${SET_USER_ID}`, this.$route.query.UserId);
      //this.userId = this.$route.query.OwnerId;
    }
    if (this.$route.query.DatasetId) {
      this.$store.commit(`answersList/${SET_DATASET_ID}`, this.$route.query.DatasetId);
    }
    if (this.$route.query.DatasetItemId) {
      this.$store.commit(`answersList/${SET_DATASETITEM_ID}`, this.$route.query.DatasetItemId);
    }

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'(val) {
      this.refreshList();
    },
  }
};
</script>
