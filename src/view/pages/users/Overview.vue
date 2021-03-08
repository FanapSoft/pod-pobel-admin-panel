<template>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-chip
                  label

                  color="gray">{{ $t("USER.USEROVERVIEW")}}</v-chip>
            </v-card-title>
            <v-card-text>
              <v-simple-table v-if="user">
                <template v-slot:default>
                  <tr :key="index" v-for="(item, index) in userDetails">
                    <th class="pa-3">{{ item.title }}</th>
                    <td class="pa-3">{{ item.value }}</td>
                  </tr>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <transactions-widget
              :key="$route.params.userId"
              :user="user"></transactions-widget>
        </v-col>
        <v-col cols="6">
          <answers-widget
              :key="$route.params.userId"
              :user="user"></answers-widget>
        </v-col>
        <v-col cols="12">
          <user-answers-trend
              :key="$route.params.userId"
              :user="user"></user-answers-trend>
        </v-col>
      </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { LOAD_USER_OBJECT, EMPTY_LOCAL_OBJECT } from "@/core/services/store/profile.module";
import AnswersWidget from "./AnswersWidget";
import TransactionsWidget from "./TransactionsWidget";
import UserAnswersTrend from "./UserAnswersTrend";

export default {
  name: "custom-page",
  components: {
    TransactionsWidget,
    AnswersWidget,
    UserAnswersTrend
  },
  computed: {
    ...mapGetters({user: "profile/user"})
  },
  data() {
    return {
      selectedItem: 0,
      items: [
        {text: 'Transactions', icon: 'mdi-folder'},
        {text: 'Datasets', icon: 'mdi-account-multiple'},
        {text: 'Answers', icon: 'mdi-star'},
      ],
      userDetails: [],

    };

  },
  methods: {
    async setupThisUser() {
      await this.$store.dispatch(`profile/${EMPTY_LOCAL_OBJECT}`);
      await this.$store.dispatch(`profile/${LOAD_USER_OBJECT}`, this.$route.params.userId);
      this.userDetails = [
        {
          title: this.$t("USER.NAME"),
          value: this.user?.name
        },
        {
          title: this.$t("USER.SURNAME"),
          value: this.user?.surname
        },
        {
          title: this.$t("USER.FULLNAME"),
          value: this.user?.fullName
        },
        {
          title: this.$t("USER.JOINEDAT"),
          value: new Date(this.user?.creationTime).toLocaleDateString("en-US")
        },
        {
          title: this.$t("USER.EMAIL"),
          value: this.user?.emailAddress
        },
        {
          title: 'POD Contact ID',
          value: this.user?.podContactId
        },
        {
          title: this.$t("USER.ROLES"),
          value: this.user?.roleNames?.join(', ')
        },

      ]
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("USER.USERS"), route: `/users/list`},
      { title: this.user ? this.user.name : this.$route.params.userId }
    ]);

    this.setupThisUser();
  }
};
</script>
