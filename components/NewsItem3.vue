<template>
  <CustomLink class="news-style-3" :to="`/detail/${item.path}/`">
    <p class="title">{{ item.name }}</p>
    <p class="path">/detail/{{ item.path }}/</p>
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
.news-style-3 {
  display: block;
  border-bottom: 1px solid #ececee;
  margin-bottom: 24px;
  .title {
    font-family: "seb";
    font-weight: 700;
    font-size: 22px;
    line-height: 29px;
    transition: color 0.2s;
  }
  .path {
    line-height: 19px;
    margin-top: 8px;
    margin-bottom: 16px;
  }
  .desc {
    line-height: 19px;
    color: $background-font-6;
    margin-bottom: 24px;
    @include ellipsis(7);
  }
  &:hover {
    .title {
      color: $color1;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-3 {
    border-bottom: vw(2) solid #ececee;
    margin-bottom: vw(32);
    .title {
      font-size: vw(36);
      line-height: vw(48);
    }
    .path {
      line-height: vw(38);
      margin-top: vw(16);
      margin-bottom: vw(32);
    }
    .desc {
      line-height: vw(38);
      margin-bottom: vw(34);
    }
  }
}
</style>
