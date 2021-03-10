<template>
    <div class="row">
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            {{ $t("BREADCRUMBS.ANSWERS") }}
            <v-spacer></v-spacer>
            <span>{{ pagination.realCount }}</span>
          </v-card-title>
          <v-row class="mx-0 mb-0">
            <v-col cols="12" class="px-3">
              <v-chip
                  close
                  label
                  @click="$router.push('/users/list?showAnswersBtn=true')"
                  @click:close="removeQueryItem('userId')">{{ $t("USER.USER") }}: {{ userId }}
              </v-chip>
              <v-chip
                  close label

                  @click="$router.push('/dataset/list')"
                  @click:close="removeQueryItem('datasetId')"

              class="mx-1">{{ $t("DATASET.DATASET") }}: {{ datasetId }}
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
              <v-dialog
                  ref="dateFromDialog"
                  v-model="dateFromDialog"
                  :close-on-content-click="false"


                  transition="scale-transition"
                  width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      readonly solo clearable hide-details

                      v-model="$store.state['answersList/dateFrom']"
                      :label="$t('GENERAL.FROM')"
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="()=> {$store.state['answersList/dateFrom'] = ''; dateFromDialog = false; refreshList()}"

                      prepend-inner-icon="mdi-calendar"></v-text-field>
                </template>
                <v-date-picker
                    no-title scrollable

                    v-model="$store.state['answersList/dateFrom']">
                  <v-spacer></v-spacer>
                  <v-btn
                      text
                      color="primary"
                      @click="()=> {$store.state['answersList/dateFrom'] = ''; dateFromDialog = false; refreshList()}">
                    {{ $t("GENERAL.CANCEL") }}
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="()=>{$refs.dateFromDialog.save($store.state['answersList/dateFrom']); refreshList()}">
                    {{ $t("GENERAL.OK") }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>

            <v-col
                cols="12"
                sm="6"
                md="3">
              <v-dialog
                  v-model="dateToMenu"
                  :close-on-content-click="false"

                  ref="dateToMenu"
                  transition="scale-transition"
                  width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      readonly solo clearable hide-details

                      v-model="$store.state['answersList/dateTo']"
                      v-bind="attrs"
                      v-on="on"
                      :label="$t('GENERAL.TO')"
                      @click:clear="()=>{dateToMenu = false; $store.state['answersList/dateTo'] = null; refreshList()}"

                      prepend-inner-icon="mdi-calendar"

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
                    {{ $t("GENERAL.CANCEL") }}
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="()=>{$refs.dateToMenu.save($store.state['answersList/dateTo']); refreshList()}">
                    {{ $t("GENERAL.OK") }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
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
              {{ new Date(item.creationTime).toLocaleDateString("en-US") }}
              <br>
              {{ new Date(item.creationTime).toLocaleTimeString().split(" ")[0] }}
            </template>
            <template v-slot:item.dataset="{ item }">
              <DatasetDetails
                  :key="item.dataSetId"
                  :item="item"
                  @dataset-details="name => {item.datasetName = name}">
              </DatasetDetails>
            </template>
            <template v-slot:item.datasetItem="{ item }">
              <DatasetITem
                  :key="item.id"
                  :answer="item">
              </DatasetITem>
            </template>

            <template v-slot:item.ignored="{ item }">
              <v-chip x-small :class="{'success': item.ignored, 'error': !item.ignored}">{{item.ignored}}</v-chip>
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
import DatasetITem from "@/view/pages/answers/DatasetItem";

export default {
  data() {
    return {
      answers: null,
      dateFromDialog: false,
      dateToMenu: null,
      listHeaders: [
        {text: this.$t("GENERAL.ROW"), value: "ind"},
        //{ text: "creditAmount", value: "creditAmount" },
        {text: this.$t("GENERAL.DATEANDTIME"), value: "dateTime"},
        {text: this.$t("GENERAL.ANSWER"), value: "answer"},
        {text: "Is Ignored", value: "ignored"},
        {text: this.$t("DATASET.DATASET"), value: "dataset"},
        {text: this.$t("DATASET.DATASETITEM"), value: "datasetItem"},

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
    DatasetITem,
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
          this.answers.forEach(item => {
            item.referenceDataSetId = item.dataSetId;
            item.datasetName = item.datasetName;
          })
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
    this.$store.dispatch(SET_BREADCRUMB, [{title: this.$t("BREADCRUMBS.ANSWERS")}]);

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
