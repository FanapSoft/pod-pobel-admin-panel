<template>
  <v-card size="50" class="bg-danger text-light px-5 py-3" style="font-size: 30px; line-height: 1">
    <h6 class="mb-0 text-uppercase" style="font-size: 13px;">{{ $t("BREADCRUMBS.TRANSACTIONS") }}</h6>
    <v-divider></v-divider>
    <v-icon size="35" class="text-light">mdi-cash-multiple</v-icon>
    {{ (transactionsCount? transactionsCount.toLocaleString() : '000') }}
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TransactionsWidget",
  props: {
    user: null
  },
  components: { },
  data() {
    return {
      transactionsCount: null,
    };

  },
  methods: {
    async getTransactionsCount() {
      this.loading = true;
      const data = {
        OwnerId: this.user.Id,
        Skip: 0,
        Limit: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/Transactions/GetAll`, data));
        if(items.data && items.data.items) {
          this.transactionsCount = items.data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getTransactionsCount();
  },
  watch: {
    user() {
      this.getTransactionsCount();
    }
  }
};
</script>
