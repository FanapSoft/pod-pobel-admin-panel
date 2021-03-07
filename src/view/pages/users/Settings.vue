<template>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              User Settings
              <v-spacer></v-spacer>
              <v-btn class="primary" depressed>Save</v-btn>
            </v-card-title>
            <v-divider class="my-0"></v-divider>
            <v-card-text>
              <v-simple-table v-if="user">
                <template v-slot:default>
                  <tr>
                    <th class="pa-3">User active</th>
                    <td class="pa-3">
                      <v-switch v-model="user.isActive"></v-switch>
                    </td>
                  </tr>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { LOAD_USER_OBJECT} from "@/core/services/store/profile.module";
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

    };

  },
  methods: {
    async setupThisUser() {
      await this.$store.dispatch(`profile/${LOAD_USER_OBJECT}`, this.$route.params.userId);
      this.userDetails = [
        {
          title: 'Name',
          value: this.user?.name
        },
        {
          title: 'Surname',
          value: this.user?.surname
        },
        {
          title: 'Full Name',
          value: this.user?.fullName
        },
        {
          title: 'Joined At',
          value: new Date(this.user?.creationTime).toLocaleDateString("fa-IR")
        },
        {
          title: 'Email',
          value: this.user?.emailAddress
        },
        {
          title: 'POD Contact ID',
          value: this.user?.podContactId
        },
        {
          title: 'Roles',
          value: this.user?.roleNames?.join(', ')
        },

      ]
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("USER.USERS"), route: `/users/list`},
      { title: this.user ? this.user.name : this.$route.params.userId, route: `/users/${this.user?.id}/profile/overview` },
      { title: this.$t("USER.SETTINGS") }
    ]);

    this.setupThisUser();
  }
};
</script>
