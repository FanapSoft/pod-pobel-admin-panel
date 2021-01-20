<template>
  <v-card size="50" class="bg-gray-600 text-light px-5 py-3" style="font-size: 30px; line-height: 1">
    <h6 class="mb-0" style="font-size: 13px">ANSWERS</h6>
    <v-divider></v-divider>
    <v-icon size="35" class="text-light">mdi-help-box</v-icon>
    {{ (answersCount ? answersCount : '000') }}
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AnswersWidget",
  components: { },
  computed: {
    ...mapGetters({user: "profile/user"})
  },
  data() {
    return {
      answersCount: null,
    };

  },
  methods: {
    async getTransactionsCount() {
      this.loading = true;
      const data = {
        UserId: this.user.id,
        SkipCount: 0,
        MaxResultCount: 1
      };

      try {
        const items = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Answers/GetAll`, data));
        if(items.data && items.data.result && items.data.result.items) {
          this.answersCount = items.data.result.totalCount;
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

  }
};
</script>
