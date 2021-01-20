<template>
  <v-app style="background-color: transparent">
    <v-row v-if="user">
    <v-col cols="4">
      <v-card
          class="mx-auto"
          width="256"
          tile
      >
        <v-navigation-drawer permanent>
          <v-system-bar></v-system-bar>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{user.fullName}}
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.emailAddress }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>mdi-menu-down</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list
              nav
              dense
          >
            <v-list-item-group
                v-model="selectedItem"
                color="primary"
            >
              <v-list-item
                  v-for="(item, i) in asideItems"
                  :to="item.link"
                  :key="i"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </v-col>
    <v-col cols="8">
      <router-view></router-view>
    </v-col>
  </v-row>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { LOAD_USER_OBJECT} from "@/core/services/store/profile.module";

export default {
  name: "custom-page",
  components: { },
  computed: {
    ...mapGetters({user: "profile/user"})
  },
  data() {
    return {
      selectedItem: 0,
      asideItems: null,
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
    },
    setupAsideLinks() {
      this.asideItems = [
        {text: 'Transactions', icon: 'mdi-folder', link: `/transaction/list?OwnerId=${this.user?.id}`},
        {text: 'Datasets', icon: 'mdi-account-multiple'},
        {text: 'Answers Trend', icon: 'mdi-star', link: `/reports/AnswerCountTrend?UserId=${this.user?.id}`},
      ]
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
        { title: "Users", route: `/users/list`},
      { title: `User ${this.$route.params.userId} Profile`}
    ]);

    this.setupThisUser();
    this.setupAsideLinks()
  },
  watch: {
    user(){
      this.setupAsideLinks()
    }
  }
};
</script>
