<template>
  <ul class="navi navi-hover py-4 px-0">
    <template v-for="(item, i) in languages">
      <li
        class="navi-item"
        :class="{ 'navi-item-active': isActiveLanguage(item.lang) }"
        :key="i"
      >
        <a
          href="#"
          class="navi-link"
          :data-lang="item.lang"
          @click="selectedLanguage"
        >
          <span class="symbol symbol-20 mr-3">
            <img :src="item.flag" alt="" />
          </span>
          <span class="navi-text">{{ $t(item.translationKey) }}</span>
        </a>
      </li>
    </template>
  </ul>
</template>

<script>

export default {
  name: "KTDropdownLanguage",
  data() {
    return {
      languages: this.$i18nService.languages
    };
  },
  methods: {
    selectedLanguage(e) {
      const el = e.target.closest(".navi-link");
      const lang = el.getAttribute("data-lang");

      this.$i18nService.setActiveLanguage(lang);

      this.$emit(
        "language-changed",
        this.languages.find(val => {
          return val.lang === lang;
        })
      );

      window.location.reload();
    },
    isActiveLanguage(current) {
      return this.activeLanguage === current;
    }
  },
  computed: {
    activeLanguage() {
      return this.$i18nService.getActiveLanguage();
    }
  }
};
</script>
