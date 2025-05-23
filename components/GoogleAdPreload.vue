<template>
  <div ref="googleAdPreload">
    <p class="title">{{ title }}</p>
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-client="ca-pub-1853000876464912"
      data-ad-format="rectangle"
      data-full-width-responsive="true"
      :data-ad-slot="adSlot"
    ></ins>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Advertisement"
    },
    adSlot: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  background: $background-font-2;
  font-size: 12px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
}
@media screen and (max-width: 750px) {
  .title {
    font-size: vw(24);
    line-height: vw(36);
  }
}
</style>
