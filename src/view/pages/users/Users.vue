<template>
    <div class="row" >
      <div class="col-md-12">
        <v-card>
          <v-card-title>
            {{ $t("USER.USERS") }}
            <b-form-group class="mb-0 mx-2" v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                  id="btn-radios-1"
                  v-model="selectedListingType"
                  :options="listingTypes"
                  :aria-describedby="ariaDescribedby"
                  name="radios-btn-default"
                  buttons
              ></b-form-radio-group>
            </b-form-group>
            <v-spacer></v-spacer>
            <span class="d-inline-block mr-3">{{ totalItems }}</span>
            <v-text-field
                single-line hide-details filled dense rounded

                @click:append="refreshKey++"
                @keydown.enter="refreshKey++"

                v-model="search"
                append-icon="search"
                :label="$t('GENERAL.SEARCH')"></v-text-field>
          </v-card-title>

          <list-normal
              v-if="selectedListingType == 'normal'"

              :key="refreshKey"
              :refreshKey="refreshKey"
              :search="search"
              @totalItems="total => totalItems = total"
          ></list-normal>
          <list-advanced
              v-else

              :key="refreshKey"
              :refreshKey="refreshKey"
              :search="search"
              @totalItems="total => totalItems = total"
          ></list-advanced>
        </v-card>
      </div>
    </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ListNormal from "@/view/pages/users/ListNormal";
import ListAdvanced from "@/view/pages/users/ListAdvanced";

export default {
  data() {
    return {
      search: null,
      refreshKey: 0,
      totalItems: 0,

      listingTypes: [
        { text: 'Normal', value: 'normal' },
        { text: 'Advanced', value: 'advanced' },
      ],
      selectedListingType: 'normal'
    };
  },
  components: {
    ListNormal, ListAdvanced
  },
  methods: {},
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: this.$t("USER.USERS")}]);

    if(this.$route.query.userName) {
      this.search = this.$route.query.userName;
      this.refreshKey++;
    }
  }
};
</script>
