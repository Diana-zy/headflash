<template>
  <div class="page">
    <Header />
    <main class="main">
      <div id="relatedsearches1"> </div>
      <h2 class="title-h2">Web Results</h2>
      <section class="news-box-3">
        <news-item-3 v-for="(item, i) in news" :key="i" :item="item"> </news-item-3>
      </section>
      <ad-loading v-if="searchLoading"></ad-loading>
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
      searchLoading: true, // 搜索加载状态
      keywords: "" // 关键字
    };
  },
  mounted() {
    this.input = this.$route.query.text || "";
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
    addAdSenseScript() {
      const self = this;
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      const paramKeys = [];

      // 遍历查询参数并将其添加到 paramKeys 数组中
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }

      const ignoredPageParams = paramKeys.join(",");
      const channelId = searchParams.has("channel") ? searchParams.get("channel") : null;

      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-3887371527059481",
        styleId: "6451695337",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "content",
        resultsPageBaseUrl: `${window.location.origin}/search/?afs&partner_param=param&channel=${channelId}`,
        resultsPageQueryParam: "query",
        terms: this.input + ", " + this.keywords,
        referrerAdCreative: "search for ads related to " + this.input + ", " + this.keywords,
        ivt: false,
        adtest: "off"
      };

      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1", // 广告容器 ID
        relatedSearches: 10, // 相关搜索广告数量
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          console.log("Ad loaded:", loaded, response, isExperimentVariant, callbackOptions);
          if (response) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "C_AC" }); // 事件推送到 dataLayer
            try {
              let numberOfKeys = 0;
              let concatenatedKeys = "miss";
              if (callbackOptions.termPositions) {
                const keys = Object.keys(callbackOptions.termPositions);
                numberOfKeys = keys.length;
                concatenatedKeys = keys.join(",");
              }

              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 105);

              console.log("Number of keys:", numberOfKeys);
              console.log("Concatenated keys:", concatenatedKeys);
              console.log(result);
              // eslint-disable-next-line no-undef
              dataLayer.push({
                event: "C_AC_IN",
                num: result,
                key1: numberOfKeys,
                key2: concatenatedKeys
              }); // 事件推送到 dataLayer
            } catch (e) {
              console.log(e);
            }
          }
          self.searchLoading = false; // 加载完成，设置加载状态为 false
        }
      });
    }
  }
};
</script>

<style></style>
