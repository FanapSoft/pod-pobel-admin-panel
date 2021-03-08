<template>
  <v-row v-if="user">
    <v-col cols="4" class="pl-0">
      <v-card
          class="mx-0"
          tile
      >
        <v-navigation-drawer width="100%" permanent>
          <v-system-bar></v-system-bar>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <inline-svg class="symbol-label" :src="$adminPrefix +'/media/svg/icons/General/User.svg'" />
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link to="overview">
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{user.fullName}}
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.emailAddress }}</v-list-item-subtitle>
              </v-list-item-content>

<!--              <v-list-item-action>
                <v-icon>mdi-menu-down</v-icon>
              </v-list-item-action>-->
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
      <router-view :key="$route.path"></router-view>
    </v-col>
  </v-row>
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
        {text: this.$t('BREADCRUMBS.TRANSACTIONS'), icon: 'mdi-cash-multiple', link: `/transaction/list?OwnerId=${this.user?.id}`},
        {text: 'Answers Trend', icon: 'mdi-chart-timeline-variant', link: `/reports/AnswerCountTrend?UserId=${this.user?.id}`},
        {text: this.$t('DATASET.DATASETS'), icon: 'mdi-database', link: `datasets`},
        {text: this.$t('USER.SETTINGS'), icon: 'mdi-cogs', link: `settings`},
      ]
    },
    setBreadcrumbs() {
      this.$store.dispatch(SET_BREADCRUMB, [
        { title: this.$t("USER.USERS"), route: `/users/list`},
        { title: this.user ? this.user.name : this.$route.params.userId }
      ]);
    }
  },
  mounted() {
    this.setupThisUser();
    this.setupAsideLinks();
    this.setBreadcrumbs();
  },
  watch: {
    user(){
      this.setupAsideLinks();
      this.setBreadcrumbs();
    }
  }
};
</script>
