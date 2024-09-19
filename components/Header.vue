<template>
  <header class="header">
    <CustomLink to="/" class="logo"></CustomLink>

    <div v-if="showInstallButton" class="pwa-download" @click="installPWA">
      <i class="icon-pwa"></i>
    </div>

    <div class="search-box">
      <input v-model="input" placeholder="" class="search" name="search" @keyup.enter="search" />
      <i class="icon-search" @click="search"></i>
    </div>

    <div class="category"
      >Category
      <ul class="dropdown">
        <li v-for="(item, i) in navData.list" :key="i"
          ><CustomLink :to="`/category/${item.path}/`">{{
            capitalizeFirstLetter(item.name)
          }}</CustomLink></li
        >
      </ul>
    </div>

    <CustomLink to="/us/" class="contact">Contact Us</CustomLink>

    <div class="pc-hidden">
      <div class="icon-sidebar" @click="toggleSidebar"> </div>
      <Sidebar :is-open="isSidebarOpen" :nav-data="navData" @close="closeSidebar" />
    </div>
  </header>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      input: "",
      deferredPrompt: null,
      showInstallButton: false,
      isSidebarOpen: false,
      navData: this.$root.$options.navData || this.$navData
    };
  },
  mounted() {
    this.input = this.$route.query.query || "";

    // 判断是否支持 PWA
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (window.deferredPrompt) {
        this.deferredPrompt = window.deferredPrompt;
        this.showInstallButton = true;
      } else {
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          this.deferredPrompt = e;
          this.showInstallButton = true;
        });
      }
    }
  },
  methods: {
    capitalizeFirstLetter,
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 characters",
          type: "warning"
        });
        return;
      }
      simulateAFSSearch(this.input);
    },
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
          this.deferredPrompt = null;
        });
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.toggle-button:hover {
  background-color: #0056b3;
}
.header {
  position: relative;
  @include center;
  max-width: 1200px;
  height: 72px;
  margin-bottom: 32px;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 1px;
    background-color: #ececee;
    transform: translateX(-50%);
    left: 50%;
  }
}
.logo {
  width: 167px;
  height: 40px;
  @include bg("logo.png");
  margin-right: 56px;
}
.pwa-download {
  position: absolute;
  width: 32px;
  height: 32px;
  background: rgba($color1, 0.2);
  border-radius: 850%;
  left: 202px;
  @include center;
  font-family: "seb";
  color: $font2;
}
.icon-pwa {
  @include icon(20px, 20px, "icon-pwa.png");
}
.search-box {
  position: relative;
  flex: 1;
  height: 48px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0);
  border-radius: 24px;
  border: 1px solid $color1;
  margin: 0 55px;
  padding-left: 16px;
  padding-right: 120px;
}
.search {
  width: 100%;
  height: 100%;
  font-family: "sesb";
  &::placeholder {
    font-family: "se";
    color: rgba($font1, 0.4);
  }
}
.icon-search {
  position: absolute;
  right: -1px;
  top: -1px;
  display: block;
  border-radius: 80px 80px 80px 80px;
  @include btn-img(80px, 48px, "icon-search.png");
  background-size: 32px 32px;
}
.category {
  width: 149px;
  height: 72px;
  font-size: 16px;
  line-height: 72px;
  font-family: "seb";
  text-align: right;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.category:hover .dropdown,
.dropdown:hover {
  display: block;
}

.dropdown {
  display: none;
  position: absolute;
  top: 54px;
  right: 34px;
  transform: translateX(50%);
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
  border-radius: 8px 8px 8px 8px;
  background: #fff;
  overflow: hidden;
}

.dropdown li {
  font-size: 16px;
  font-family: "sesb";
  line-height: 40px;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  a {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0 16px;
  }
}

.dropdown li:hover {
  background: rgba($color1, 0.2);
  color: $color1;
}
.contact {
  width: 116px;
  height: 72px;
  line-height: 72px;
  font-size: 16px;
  font-family: "seb";
  color: $font1;
  text-align: right;
  cursor: pointer;
}
@media screen and (max-width: 1100px) {
  .contact {
    display: none;
  }
  .logo {
    margin-right: 60px;
  }
  .pwa-download {
    width: 40px;
    span {
      display: none;
    }
    i {
      margin-right: 0;
    }
  }
  .category {
    width: auto;
    .dropdown {
      top: 64px;
      right: 0;
      transform: none;
    }
  }
}
@media screen and (max-width: 750px) {
  .header {
    width: 100%;
    padding: 0;
    max-width: 100vw;
    height: vw(96);
    margin-bottom: vw(48);
    justify-content: flex-start;
    &::after {
      height: vw(2);
    }
  }
  .contact,
  .category {
    display: none;
  }
  .logo {
    width: vw(64);
    height: vw(64);
    @include bg("logo2.png");
    margin-right: vw(32);
  }
  .pwa-download {
    width: vw(48);
    height: vw(48);
    background: transparent;
    border-radius: 0;
    left: vw(530);
    span {
      display: none;
    }
  }
  .icon-pwa {
    @include icon(vw(48), vw(48), "icon-pwa2.png");
    margin-right: 0;
  }
  .icon-sidebar {
    @include icon(vw(48), vw(48), "icon-sidebar.png");
    cursor: pointer;
  }
  .pc-hidden {
    margin-left: auto;
  }
  .search-box {
    max-width: vw(402);
    height: vw(64);
    box-shadow: 0 0 vw(16) 0 rgba(0, 0, 0, 0);
    border-radius: vw(32);
    border: vw(2) solid $color1;
    margin: 0;
    padding-left: vw(20);
    padding-right: vw(80);
  }
  .search {
    height: 100%;
    font-family: "sesb";
    &::placeholder {
      font-family: "se";
      color: rgba($font1, 0.4);
    }
  }
  .icon-search {
    position: absolute;
    right: vw(-2);
    top: vw(-2);
    display: block;
    border-radius: vw(32);
    @include btn-img(vw(80), vw(64), "icon-search2.png");
    background-size: vw(48) vw(48);
  }
}
</style>
