<template>
  <CustomLink class="news-style-4" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="328"
      height="218"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img"
    />
    <p class="category">{{ capitalizeFirstLetter(item.category_name) }}</p>
    <p class="title">{{ item.name }}</p>
    <p class="desc">
      {{ item.first_paragraph }}
    </p>
  </CustomLink>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style lang="scss" scoped>
.news-style-4 {
  position: relative;
  padding-left: 344px;
  margin-bottom: 24px;
  height: 243px;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: calc(100% - 344px);
    height: 1px;
    background: $background-font-1;
  }
  .img {
    position: absolute;
    left: 0;
    top: 0;
    width: 328px;
    height: 218px;
    border-radius: 8px 8px 8px 8px;
  }
  .category {
    display: inline-block;
    padding: 0 4px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    font-family: "sesb";
    color: $color1;
    background: $background;
    border-radius: 4px 4px 4px 4px;
    margin: 16px 0 8px;
  }
  .title {
    font-size: 22px;
    font-family: "seb";
    line-height: 29px;
    font-weight: 700;
    margin-bottom: 16px;
    @include ellipsis(2);
    transition: color 0.2s;
  }
  .desc {
    color: $background-font-6;
    line-height: 19px;
    font-family: "sesb";
    @include ellipsis(5);
  }
  &:hover {
    .title {
      color: $color1;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-4 {
    padding-left: vw(258);
    margin-bottom: vw(32);
    height: vw(194);
    &::after {
      width: calc(100% - vw(258));
      height: vw(2);
    }
    .img {
      width: vw(242);
      height: vw(160);
      border-radius: vw(16);
    }
    .category {
      padding: 0 vw(8);
      height: vw(40);
      line-height: vw(40);
      font-size: vw(24);
      border-radius: vw(8);
      margin: 0 0 vw(6);
    }
    .title {
      font-size: vw(28);
      line-height: vw(38);
      margin-bottom: 0;
      @include ellipsis(3);
    }
    .desc {
      display: none;
    }
    &:hover {
      .title {
        color: $color1;
      }
    }
  }
}
</style>
