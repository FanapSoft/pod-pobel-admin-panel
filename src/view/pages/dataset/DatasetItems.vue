<template>
    <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            Dataset Items
            <v-spacer></v-spacer>
            <span class="d-inline-block mr-3">{{pagination.realCount}}</span>
            <v-text-field
                single-line hide-details filled dense rounded

                @click:append="refreshList"
                @keydown.enter="refreshList"

                v-model="LabelName"
                append-icon="search"
                label="Label Name"></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" style="vertical-align: middle">
                <v-chip
                    close

                    @click="$router.push('/dataset/list')"
                    @click:close="()=>{$router.push('/datasetItems'); refreshList()}">Dataset: {{$route.query.DatasetId}}</v-chip>
              </v-col>
              <v-col cols="3">
                <v-switch
                    v-model="IsGoldenData"

                    label="Only Goldens"
                    class="mt-0"></v-switch>
              </v-col>
              <v-col cols="4">
                <v-switch
                    v-model="OnlyNonDecidedGoldens"

                    label="Only Non Decided Goldens"
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
              <template v-slot:item.file="{ item }">
                <v-avatar class="my-2" rounded>
                  <img :src="`${axios.defaults.baseURL}/file/dataset/item/${item.id}`">
                </v-avatar>
              </template>
              <template v-slot:item.labelName="{ item }">
                {{ (item.label ? item.label.name : 'No label')}}
              </template>
              <template v-slot:item.datasetItem="{ item }">
                <DatasetDetails
                    :key="item.datasetID"
                    :item="item"
                    @dataset-details="name => {item.datasetName = name}">
                </DatasetDetails>
              </template>

              <template v-slot:item.actions="{ item }">

              </template>
            </v-data-table>
            <v-row class="mx-9">
              <v-col cols="12" class="position-relative">
                <v-pagination

                    :key="pagination.currentPage"
                    v-model="pagination.currentPage"
                    :length="pagination.count"></v-pagination>
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

export default {
  data() {
    return {
      datasetItems: null,
      LabelName: null,
      DataSetId: null,
      IsGoldenData: false,
      OnlyNonDecidedGoldens: false,

      listHeaders: [
        { text: "Row", value: "ind" },
        { text: "File", value: "file" },
        { text: "Label", value: "labelName" },
        { text: "Dataset", value: "datasetItem"},
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
  computed: {
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
        DataSetId: this.$route.query.DatasetId ? this.$route.query.DatasetId : null,
        IsGoldenData: this.IsGoldenData,
        OnlyNonDecidedGoldens: this.OnlyNonDecidedGoldens,

        SkipCount: this.pagination.skip,
        MaxResultCount: this.pagination.perPage
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/DataSetItems/GetAll`, data));
        if(items.data && items.data.result && items.data.result.items) {
          this.datasetItems = items.data.result.items;
          this.datasetItems.forEach(item => {
            item.referenceDataSetId = item.datasetID;
            item.datasetName = item.datasetName;
          })
          this.pagination.count = items.data.result.totalCount ? Math.ceil(items.data.result.totalCount / this.pagination.limit) : 1;
          this.pagination.realCount = items.data.result.totalCount;
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
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Datasets Items" },
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
