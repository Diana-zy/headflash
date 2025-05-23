<template>
  <div>
    <div ref="admSlot" class="adm-slot">
      <div ref="title" class="title">Advertisement</div>
      <div :id="admId" ref="googleAdmSlot" class="ad-slot"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    admId: {
      type: String,
      required: true
    },
    admUnit: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(this.handleIntersection);
    this.observer.observe(this.$refs.googleAdmSlot);
  },
  methods: {
    handleIntersection(entries) {
      if (entries[0].isIntersecting) {
        const width = this.$refs.admSlot.clientWidth;
        const height = this.$refs.admSlot.clientHeight - this.$refs.title.clientHeight;
        console.log(width, height);
        const adScript = document.createElement("script");
        adScript.innerHTML = `googletag.cmd.push(function () {
              googletag.defineSlot('${this.admUnit}', ['fluid', [${width},${height}]], '${this.admId}').addService(googletag.pubads());
              googletag.enableServices();
              googletag.display('${this.admId}');
            });`;
        this.$refs.googleAdmSlot.appendChild(adScript);
        this.observer.unobserve(this.$refs.googleAdmSlot);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.adm-slot {
  margin: 0 auto;
  width: 100%;
  height: 240px;
}
.title {
  background: $background-font-2;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  margin: 0;
}

@media screen and (max-width: 879px) {
  .adm-slot {
    height: vw(673);
  }
  .title {
    font-size: vw(24);
    line-height: vw(36);
  }
}
</style>
