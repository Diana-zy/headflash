<template>
  <CustomLink class="news-style-1" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="282"
      height="188"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img"
    />
    <p class="title">{{ item.name }}</p>
    <p class="desc">{{ item.first_paragraph }}</p>
  </CustomLink>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.news-style-1 {
  transition: border-color 0.2s;
  .img {
    width: 282px;
    height: 188px;
  }
  .title {
    font-size: 16px;
    font-family: "seb";
    font-weight: 700;
    line-height: 21px;
    height: 42px;
    @include ellipsis(2);
    margin: 8px 8px 4px;
    transition: color 0.2s;
  }
  .desc {
    @include ellipsis(2);
    color: rgba($font1, 0.6);
    line-height: 19px;
    height: 38px;
    margin: 0px 8px 11px;
  }
  &:hover {
    border-color: $color1;
    .title {
      color: $color1;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-1 {
    .img {
      width: vw(480);
      height: vw(320);
    }
    .title {
      font-size: vw(28);
      line-height: vw(38);
      height: vw(76);
      margin: vw(16) vw(16) vw(8);
    }
    .desc {
      font-size: vw(24);
      line-height: vw(32);
      height: vw(64);
      margin: 0 vw(16) vw(16);
    }
    &:hover {
      border-color: $color1;
      .title {
        color: $color1;
      }
    }
  }
}
</style>
