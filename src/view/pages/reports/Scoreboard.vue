<template>
  <div class="row">
    <div class="col-md-12">
      <v-card>
        <v-card-title>
          Answers
          <v-spacer></v-spacer>

        </v-card-title>
        <v-row>
          <v-col cols="12" class="px-6">
            <v-chip
                close

                @click="$router.push('/dataset/list')"
                @click:close="removeQueryItem('datasetId')">Dataset: {{ datasetId }}
            </v-chip>
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
                    v-model="$store.state['scoreboard/dateFrom']"
                    label="From"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  no-title scrollable

                  v-model="$store.state['scoreboard/dateFrom']">
                <v-spacer></v-spacer>
                <v-btn
                    text
                    color="primary"
                    @click="()=> {$store.state['scoreboard/dateFrom'] = ''; dateFromMenu = false; refreshList()}">
                  Cancel
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="()=>{$refs.dateFromMenu.save($store.state['scoreboard/dateFrom']); refreshList()}">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-data-table
            v-if="scoreboardItems"

            disable-sort hide-default-footer disable-pagination

            :headers="listHeaders"
            :items="scoreboardItems"
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
            {{ (scoreboardItems.indexOf(item) + 1) }}
          </template>
          <template v-slot:item.dateTime="{ item }">
            {{ new Date(item.creationTime).toLocaleDateString("fa-IR") }}
            <br>
            {{ new Date(item.creationTime).toLocaleTimeString().split(" ")[0] }}
          </template>
          <template v-slot:item.name="{ item }">
            {{ item.name }} - {{ item.surname }}
          </template>
          <template v-slot:item.count="{ item }">
            {{ (item.count? item.count.toLocaleString("fa-IR") : ':/') }}
          </template>

        </v-data-table>
        <v-layout align="center">
            <v-btn
                v-if="pagination.count === 10"
                :loading="loading"
                @click="()=>{pagination.currentPage++; refreshList()}"
            >Load More...</v-btn>
        </v-layout>
<!--        <v-row class="mx-9">
          <v-col>
            <v-pagination
                v-model="pagination.currentPage"
                :length="pagination.count"></v-pagination>
          </v-col>
        </v-row>-->
      </v-card>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {
  SET_DATASET_ID,
} from "@/core/services/store/scoreboard.module";
import {SET_BREADCRUMB} from "@/core/services/store/breadcrumbs.module";

import DatasetDetails from "../transactions/DatasetDetails";

export default {
  name: "Scoreboard",
  data() {
    return {
      scoreboardItems: null,
      dateFromMenu: false,
      dateToMenu: null,
      listHeaders: [
        {text: "Row", value: "ind"},
        //{ text: "creditAmount", value: "creditAmount" },
        {text: "Date & Time", value: "dateTime"},
        {text: "User", value: "name"},
        {text: "Answers", value: "count"},

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
      datasetId: "scoreboard/datasetId",
    })
  },
  methods: {
    async getItems(page) {
      this.calcCurrentPage(page)
      this.loading = true;
      const data = {
        DatasetId: this.datasetId,
        From: this.$store.state['scoreboard/dateFrom'],
        //DatasetItemId: this.datasetId,
        SkipCount: this.pagination.skip,
        MaxResultCount: this.pagination.perPage
      };

      try {
        const scoreboardItems = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Reports/Scoreboard`, data));
        if (scoreboardItems.data && scoreboardItems.data.result) {
          this.scoreboardItems = this.scoreboardItems ? [
              ...this.scoreboardItems,
            scoreboardItems.data.result
          ] : scoreboardItems.data.result;



          this.pagination.count = this.scoreboardItems.length;
          this.pagination.realCount = this.pagination.realCount + this.pagination.count;
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
      this.scoreboardItems = [];
      this.refreshList()
    },
    async refreshList() {
      await this.getItems(this.pagination.currentPage);
    },
    removeQueryItem(item) {
      if (item == 'datasetId')
        this.$store.commit(`scoreboard/${SET_DATASET_ID}`, null);
      this.refreshList()
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{title: "Score Board"}]);

    if (this.$route.query.DatasetId) {
      this.$store.commit(`scoreboard/${SET_DATASET_ID}`, this.$route.query.DatasetId);
    }

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'() {
      this.refreshList();
    },
  }
};
</script>
