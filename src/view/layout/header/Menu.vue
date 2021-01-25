<template>
  <ul class="menu-nav">
    <router-link
      to="/dashboard"
      v-slot="{ href, navigate, isActive, isExactActive }"
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Dashboard </span>
        </a>
      </li>
    </router-link>

    <li
        aria-haspopup="true"
        data-menu-toggle="click"
        class="menu-item menu-item-submenu menu-item-open-dropdown"
        v-bind:class="{ 'menu-item-active': hasActiveChildren('/dataset') }"
    >
      <a href="#" class="menu-link menu-toggle">
        <span class="menu-text">Dataset</span>
      </a>
      <div class="menu-submenu menu-submenu-fixed">
        <div class="menu-subnav megamenu" style="max-width: 1000px;">
          <h3></h3>
          <ul class="menu-content">
            <li class="menu-item">
              <ul class="menu-inner">
                <router-link
                    to="/dataset/list"
                    v-slot="{ href, navigate, isActive, isExactActive }"
                >
                  <li
                      aria-haspopup="true"
                      class="menu-item"
                      :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Datasets </span>
                    </a>
                  </li>
                </router-link>
                <router-link
                    to="/datasetItems"
                    v-slot="{ href, navigate, isActive, isExactActive }"
                >
                  <li
                      aria-haspopup="true"
                      class="menu-item"
                      :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Dataset Items </span>
                    </a>
                  </li>
                </router-link>
                <router-link
                    to="/answers"
                    v-slot="{ href, navigate, isActive, isExactActive }"
                >
                  <li
                      aria-haspopup="true"
                      class="menu-item"
                      :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Answers </span>
                    </a>
                  </li>
                </router-link>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </li>

    <router-link
        to="/users/list"
        v-slot="{ href, navigate, isActive, isExactActive }"
    >
      <li
          aria-haspopup="true"
          data-menu-toggle="hover"
          class="menu-item"
          :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Users </span>
        </a>
      </li>
    </router-link>
    <router-link
        to="/transaction/list"
        v-slot="{ href, navigate, isActive, isExactActive }"
    >
      <li
          aria-haspopup="true"
          data-menu-toggle="hover"
          class="menu-item"
          :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Transactions </span>
        </a>
      </li>
    </router-link>
    <router-link
        to="/reports/list"
        v-slot="{ href, navigate, isActive, isExactActive }"
    >
      <li
          aria-haspopup="true"
          data-menu-toggle="hover"
          class="menu-item"
          :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Reports </span>
        </a>
      </li>
    </router-link>

    <!--    <li
          aria-haspopup="true"
          data-menu-toggle="click"
          class="menu-item menu-item-submenu menu-item-open-dropdown"
          v-bind:class="{ 'menu-item-active': hasActiveChildren('/custom') }"
        >
          <a href="#" class="menu-link menu-toggle">
            <span class="menu-text"> Custom </span>
          </a>
          <div class="menu-submenu menu-submenu-classic">
            <ul class="menu-subnav">
              <li
                aria-haspopup="true"
                data-menu-toggle="hover"
                class="menu-item menu-item-submenu"
              >
                <a href="#" class="menu-link menu-toggle">
                  <i class="menu-icon flaticon2-list-2"></i>
                  <span class="menu-text"> Error Pages </span>
                  <i class="menu-arrow"></i>
                </a>
                <div class="menu-submenu menu-submenu-classic menu-submenu-right">
                  <ul class="menu-subnav">
                    <router-link
                      to="/custom-error/error-1"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Error 1 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-error/error-2"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Error 2 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-error/error-3"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Error 3 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-error/error-4"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Error 4 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-error/error-5"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Error 5 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-error/error-6"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Error 6 </span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </li>
              <li
                aria-haspopup="true"
                data-menu-toggle="hover"
                class="menu-item menu-item-submenu"
                v-bind:class="{
                  'menu-item-active': hasActiveChildren('/custom-wizard/wizard')
                }"
              >
                <a href="#" class="menu-link menu-toggle">
                  <i class="menu-icon flaticon2-mail-1"></i>
                  <span class="menu-text"> Wizard </span>
                  <i class="menu-arrow"></i>
                </a>
                <div class="menu-submenu menu-submenu-classic menu-submenu-right">
                  <ul class="menu-subnav">
                    <router-link
                      to="/custom-wizard/wizard-1"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Wizard 1 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-wizard/wizard-2"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Wizard 2 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-wizard/wizard-3"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Wizard 3 </span>
                        </a>
                      </li>
                    </router-link>

                    <router-link
                      to="/custom-wizard/wizard-4"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Wizard 4 </span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </li>

              <li
                aria-haspopup="true"
                data-menu-toggle="hover"
                class="menu-item menu-item-submenu"
                v-bind:class="{
                  'menu-item-active': hasActiveChildren('/custom-plugins')
                }"
              >
                <a href="#" class="menu-link menu-toggle">
                  <i class="menu-icon flaticon2-image-file"></i>
                  <span class="menu-text"> Plugins </span>
                  <i class="menu-arrow"></i>
                </a>
                <div class="menu-submenu menu-submenu-classic menu-submenu-right">
                  <ul class="menu-subnav">
                    <router-link
                      to="/custom-plugins/cropper"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Cropper </span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="/custom-plugins/treeselect"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text"> Treeselect </span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </li>

              <li
                aria-haspopup="true"
                data-menu-toggle="hover"
                class="menu-item menu-item-submenu"
                v-bind:class="{
                  'menu-item-active': hasActiveChildren('/custom-pages')
                }"
              >
                <a href="#" class="menu-link menu-toggle">
                  <i class="menu-icon far fa-user"></i>
                  <span class="menu-text">Profile</span>
                  <i class="menu-arrow"></i>
                </a>
                <div class="menu-submenu menu-submenu-classic menu-submenu-right">
                  <ul class="menu-subnav">
                    <router-link
                      to="/profile/profile-1"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text">Profile 1</span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="/profile/profile-2"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text">Profile 2</span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="/profile/profile-3"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text">Profile 3</span>
                        </a>
                      </li>
                    </router-link>
                    <router-link
                      to="/profile/profile-4"
                      v-slot="{ href, navigate, isActive, isExactActive }"
                    >
                      <li
                        aria-haspopup="true"
                        data-menu-toggle="hover"
                        class="menu-item"
                        :class="[
                          isActive && 'menu-item-active',
                          isExactActive && 'menu-item-active'
                        ]"
                      >
                        <a :href="href" class="menu-link" @click="navigate">
                          <i class="menu-bullet menu-bullet-dot"><span></span></i>
                          <span class="menu-text">Profile 4</span>
                        </a>
                      </li>
                    </router-link>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>-->
  </ul>
</template>

<script>
export default {
  name: "KTMenu",
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  }
};
</script>

<style>
.header-menu .menu-nav > .menu-item .menu-submenu.menu-submenu-fixed {
  margin: 0 auto;
  width: auto;
  left: auto;
  right: auto;
}
</style>
