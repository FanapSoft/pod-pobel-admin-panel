<template>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              {{ $t("USER.USERSETTINGS") }}
              <v-spacer></v-spacer>
              <v-btn
                  :loading="isSaving"
                  @click="saveChanges"
                  class="primary"
                     depressed>{{ $t("GENERAL.SAVE") }}</v-btn>
            </v-card-title>
            <v-divider class="my-0"></v-divider>
            <v-card-text>
              <v-simple-table v-if="user">
                <template v-slot:default>
                  <tr>
                    <th class="pa-3">{{$t('USER.ACCOUNT_STATE')}}</th>
                    <td class="pa-3">
                      <v-switch v-model="user.IsActive"></v-switch>
                      <v-badge
                          dot

                          :color="user.IsActive ? 'success': 'error'"

                          class="mr-3"></v-badge>
                      {{ (user.IsActive ? $t("GENERAL.ACTIVE") : $t("GENERAL.INACTIVE")) }}
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

      isSaving: false
    };

  },
  methods: {
    async saveChanges() {
      this.isSaving = true;

      try {
        const result = await this.$http.put(`/api/User/Update/${this.user.Id}`, {IsActive: this.user.IsActive});
        if(result.status < 400) {
          this.$bvToast.toast(this.$t('GENERAL.UPDATE_SUCCEED'),{
            title: `Success`,
            variant: 'success',
            solid: true
          })
        } else if(result.data[0]) {
          console.log(result);
          this.$bvToast.toast(this.$t('GENERAL.UPDATE_FAILED'), {
            title: `Error`,
            variant: 'danger',
            solid: true
          })
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isSaving = false;
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.$t("USER.USERS"), route: `/users/list`},
      { title: this.user ? this.user.Name : this.$route.params.userId, route: `/users/${this.user?.Id}/profile/overview` },
      { title: this.$t("USER.SETTINGS") }
    ]);

  }
};
</script>
