import i18n from "@/core/plugins/vue-i18n";

const i18nService = {
  defaultLanguage: "fa",

  languages: [
    {
      lang: "en",
      name: "English",
      translationKey: "GENERAL.ENGLISH",
      flag: process.env.BASE_URL + "media/svg/flags/226-united-states.svg"
    },
    /*{
      lang: "ch",
      name: "Mandarin",
      flag: process.env.BASE_URL + "/media/svg/flags/034-china.svg"
    },
    {
      lang: "es",
      name: "Spanish",
      flag: process.env.BASE_URL + "/media/svg/flags/128-spain.svg"
    },
    {
      lang: "jp",
      name: "Japanese",
      flag: process.env.BASE_URL + "/media/svg/flags/063-japan.svg"
    },
    {
      lang: "de",
      name: "German",
      flag: process.env.BASE_URL + "/media/svg/flags/162-germany.svg"
    },
    {
      lang: "fr",
      name: "French",
      flag: process.env.BASE_URL + "/media/svg/flags/195-france.svg"
    },*/
    {
      lang: "fa",
      name: "Persian",
      translationKey: "GENERAL.PERSIAN",
      flag: process.env.BASE_URL + "media/svg/flags/136-iran.svg"
    },

  ],

  /**
   * Keep the active language in the localStorage
   * @param lang
   */
  setActiveLanguage(lang) {
    localStorage.setItem("language", lang);
  },

  /**
   * Get the current active language
   * @returns {string | string}
   */
  getActiveLanguage() {
    return localStorage.getItem("language") || this.defaultLanguage;
  }
};

export default i18nService;
