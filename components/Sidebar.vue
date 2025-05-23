<template>
  <div>
    <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>
    <div class="sidebar" :class="{ 'sidebar-hidden': !isOpen }">
      <div class="close" @click="closeSidebar"></div>

      <div class="search-box">
        <input v-model="input" placeholder="" class="search" name="search" @keyup.enter="search" />
        <i class="icon-search" @click="search"></i>
      </div>

      <h2 class="title-h2">Categories</h2>
      <ul class="categories">
        <li v-for="(item, i) in navData.list" :key="i">
          <CustomLink :to="`/category/${item.path}/`">{{
            capitalizeFirstLetter(item.name)
          }}</CustomLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    navData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      input: ""
    };
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
    closeSidebar() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 40;
}
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: vw(670);
  background: #fff;
  transition: transform 0.3s ease;
  z-index: 50;
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: vw(2);
    background: #ececee;
    position: absolute;
    top: vw(96);
  }
}
.sidebar-hidden {
  transform: translateX(-100%);
}
.close {
  position: absolute;
  top: vw(24);
  right: vw(46);
  @include icon(vw(48), vw(48), "icon-close.png");
}
.title-h2 {
  margin-left: vw(46);
}
.categories {
  li a {
    font-family: "sesb";
    font-size: vw(32);
    height: vw(80);
    display: flex;
    align-items: center;
    padding-left: vw(46);
    cursor: pointer;
    &:hover {
      background: $background;
      color: $color1;
    }
  }
}
.search-box {
  position: relative;
  max-width: vw(578);
  height: vw(80);
  box-shadow: 0 0 vw(16) 0 rgba(0, 0, 0, 0);
  border-radius: vw(40);
  border: vw(2) solid $color1;
  margin: vw(144) auto 0;
  padding-left: vw(20);
  padding-right: vw(132);
}
.search {
  height: 100%;
  font-family: "sesb";
  &::placeholder {
    font-family: "se";
    color: $background-font-4;
  }
}
.icon-search {
  position: absolute;
  right: vw(-2);
  top: vw(-2);
  display: block;
  background: $color1;
  border-radius: vw(40);
  @include btn-img(vw(160), vw(80), "icon-search3.png");
  background-size: vw(48) vw(48);
}
</style>
