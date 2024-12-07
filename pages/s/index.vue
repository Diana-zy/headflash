<template>
  <div class="page">
    <Header />
    <main class="main">
      <div id="afscontainer1"> </div>

      <h2 class="title-h2">Web Results</h2>
      <section class="news-box-3">
        <news-item-3 v-for="(item, i) in news" :key="i" :item="item"> </news-item-3>
      </section>

      <div id="afscontainer2"> </div>
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: [], // 新闻列表
      input: "", // 搜索输入
      keywords: "" // 关键字
    };
  },
  mounted() {
    this.input = this.$route.query.query || "";
    this.input && this.searchTerms();
    this.input && this.searchNews();
  },
  methods: {
    async searchTerms() {
      try {
        const response = await this.$axios.$get("/api/article/keywords", {
          params: {
            site_id: process.env.SITE_ID,
            key: this.input
          }
        });

        this.keywords = response.terms;
        this.addAdSenseScript(); // 添加 AdSense 脚本
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async searchNews() {
      try {
        const response = await this.$axios.$post("/api/article/search", {
          site_id: process.env.SITE_ID,
          key: this.input
        });

        this.news = response.list;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    addAdSenseScript: function () {
      const searchParams = new URLSearchParams(window.location.search);
      const channelId = searchParams.has("channel") ? searchParams.get("channel") : "";
      const queryString = this.input;

      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-1853000876464912",
        query: `${this.input}`,
        styleId: "3796162767",
        adsafe: "low",
        adpage: 1,
        ivt: false,
        adtest: "off"
      };

      // 初始化 _googCsa 并加载广告
      // eslint-disable-next-line no-undef
      _googCsa(
        "ads",
        adSenseConfig,
        {
          container: "afscontainer1", // 第一个广告容器 ID
          number: 5, // 第一个广告容器中的广告数量
          adLoadedCallback: function (loaded, e, n, r) {
            console.log("adLoadedCallback", loaded, e, n, r);
            if (e) {
              // eslint-disable-next-line no-undef
              dataLayer.push({ event: "C_AR" }); // 推送事件到 dataLayer
              try {
                const element = document.getElementById("master-1");
                const height = parseFloat(element.style.height);
                const result = Math.round(height / 456);
                // eslint-disable-next-line no-undef
                dataLayer.push({ event: "C_AR_IN", num: result, query: queryString }); // 事件推送到 dataLayer
              } catch (e) {
                console.log(e);
              }
            } else {
              // eslint-disable-next-line no-undef
              dataLayer.push({ event: "FF_AR", query: queryString }); // 推送事件到 dataLayer
            }
          }
        },
        {
          container: "afscontainer2", // 第二个广告容器 ID
          number: 3 // 第二个广告容器中的广告数量
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}

@media screen and (max-width: 750px) {
  .main {
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
  }
}
</style>
