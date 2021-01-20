<template>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-card-text>User Overview</v-card-text>
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
          <transactions-widget></transactions-widget>
        </v-col>
        <v-col cols="6">
          <answers-widget></answers-widget>
        </v-col>

      </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { LOAD_USER_OBJECT} from "@/core/services/store/profile.module";
import AnswersWidget from "./AnswersWidget";
import TransactionsWidget from "./TransactionsWidget";

export default {
  name: "custom-page",
  components: {
    TransactionsWidget,
    AnswersWidget,
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
      userDetails: []
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
        { title: "Users", route: `/users/list`},
      { title: `User ${this.$route.params.userId} Profile`}
    ]);

    this.setupThisUser();
  }
};
</script>
