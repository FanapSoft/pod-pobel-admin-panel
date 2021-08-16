<template>
    <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            {{ $t("DATASET.DATASETSITEMS") }}
            <v-spacer></v-spacer>
            <span class="d-inline-block mr-3">{{pagination.realCount.toLocaleString()}}</span>
            <v-text-field
                single-line hide-details filled dense rounded

                v-model="LabelName"

                @click:append="refreshList"
                @keydown.enter="refreshList"

                append-icon="search"
                :label="$t('DATASET.ITEMLABELNAME')"></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" style="vertical-align: middle">
                <v-chip
                    close label

                    @click="$router.push('/dataset/list')"
                    @click:close="()=>{$router.push('/datasetItems'); refreshList()}">{{ $t("DATASET.DATASET")}}: {{$route.query.DatasetId && currentDataset ? currentDataset.Name : ''}}</v-chip>
              </v-col>
              <v-col cols="3">
                <v-switch
                    v-model="IsGoldenData"

                    :label="$t('DATASET.ONLYGOLDENS')"
                    class="mt-0"></v-switch>
              </v-col>
            </v-row>
            <v-data-table
                v-if="datasetItems"

                disable-sort hide-default-footer disable-pagination

                :headers="listHeaders"
                :items="datasetItems"
                :page.sync="pagination.currentPage"
                :loading="loading"
                :items-per-page="10"
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
                {{ (pagination.skip ? pagination.skip + datasetItems.indexOf(item) + 1 : datasetItems.indexOf(item) + 1) }}
              </template>
              <template v-slot:item.content="{ item }">
                <v-avatar v-if="item.Type === 0" class="my-2" rounded>
                  <img :src="`${axios.defaults.baseURL}/api/File/Dataset/Item/${item.Id}`">
                </v-avatar>
                <span
                    v-else-if="item.Type === 1" style="max-width: 300px; display: inline-block;">{{ item.Content }}</span>
              </template>
              <template v-slot:item.labelName="{ item }">
                {{ (item.Name ? item.Name : 'No label')}}
              </template>
              <template v-slot:item.datasetItem="{ item }">
                <DatasetDetails
                    :key="item.DatasetId"
                    :item="item">
                </DatasetDetails>
              </template>

              <template v-slot:item.actions="{ item }">

              </template>
            </v-data-table>
            <v-row class="mx-9">
              <v-col cols="12" class="position-relative">
                <v-pagination
                    v-model="pagination.currentPage"
                    :total-visible="($vuetify.breakpoint.width - $vuetify.application.left - 404) / 44 - 1"
                    :length="pagination.count"

                    class="mt-4 pb-2"></v-pagination>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { SET_DATASET_ID } from "@/core/services/store/transactionsList.module";
import DatasetDetails from "../transactions/DatasetDetails";
import {LOAD_DATASET} from "@/core/services/store/datasets.module";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      datasetItems: null,
      LabelName: null,
      DatasetId: null,
      IsGoldenData: false,
      OnlyNonDecidedGoldens: false,

      listHeaders: [
        { text: this.$t("GENERAL.ROW"), value: "ind" },
        { text: this.$t("GENERAL.CONTENT"), value: "content" },
        { text: this.$t("GENERAL.LABEL"), value: "labelName" },
        { text: this.$t("DATASET.ANSWERSCOUNT"), value: "AnswersCount" },
        { text: this.$t("DATASET.ISGOLDEN"), value: "IsGoldenData" },
        { text: this.$t("DATASET.DATASET"), value: "datasetItem" },
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
  computed: {
    ...mapGetters({
      currentDataset: `datasets/currentDataset`
    })
  },
  components: {
    DatasetDetails
  },
  methods:{
    async getItems(page) {
      this.calcCurrentPage(page)
      this.loading = true;
      const data = {
        LabelName: this.LabelName,
        DatasetId: this.$route.query.DatasetId ? this.$route.query.DatasetId : null,
        IsGoldenData: this.IsGoldenData,

        Skip: this.pagination.skip,
        Limit: this.pagination.perPage
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/DatasetItems/GetAll`, data));
        if(items.status < 400 && items.data.items) {
          this.datasetItems = items.data.items;
          this.datasetItems.forEach(item => {
            item.ReferenceDatasetId = item.DatasetId;
            //item.datasetName = item.datasetName;
          });
          this.pagination.count = items.data.totalCount ? Math.ceil(items.data.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = items.data.totalCount;
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
      this.datasetItems = [];
      this.refreshList()
    },
    async refreshList() {
      await this.getItems(this.pagination.currentPage);
    }
  },
  async mounted() {
    await this.$store.dispatch(`datasets/${LOAD_DATASET}`, this.$route.query.DatasetId);

    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("DATASET.DATASETSITEMS")},
      //{ title: `Dataset ${this.$route.params.DatasetId.substr(0, 10)}...`, route: `/dataset/${this.$route.params.DatasetId}/singleDataset` },
      //{ title: `Items` },
    ]);

    this.refreshList()
  },
  watch: {
    'pagination.currentPage'() {
      this.refreshList();
    },
    IsGoldenData(){
      this.refreshList()
    },
    OnlyNonDecidedGoldens(){
      this.refreshList()
    },
  }
};
</script>
