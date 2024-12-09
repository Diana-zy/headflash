<template>
  <div v-show="!hide" class="page">
    <Header v-if="!subdomain" />
    <main class="main">
      <div id="afscontainer1"> </div>
      <google-ad-preload v-if="noAd" ad-slot="6864443826"></google-ad-preload>
      <google-ad-preload v-if="noAd2" ad-slot="5519572568"></google-ad-preload>
      <div id="relatedstyle2"> </div>
      <h2 class="title-h2">Web Results</h2>
      <section class="news-box-3">
        <news-item-3 v-for="(item, i) in news" :key="i" :item="item"> </news-item-3>
      </section>
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
      keywords: "", // 关键字
      channelId: "", // 频道 ID
      subdomain: false,
      hide: true,
      noAd: false,
      noAd2: false
    };
  },
  mounted() {
    window.location.hostname.includes("s.") && (this.subdomain = true);
    this.hide = false;

    this.input = this.$route.query.query || "";
    this.input && this.addAdSense();
    this.input && this.searchNews();

    const searchParams = new URLSearchParams(window.location.search);
    this.channelId = searchParams.has("channel") ? searchParams.get("channel") : "";
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        this.addAdSenseScript();
        this.addAdSenseScript2();
      }, 0);
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
      const queryString = this.input;

      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-1853000876464912",
        query: `${this.input}`,
        styleId: "3796162767",
        adsafe: "low",
        adpage: 1,
        ivt: false,
        adtest: "off"
      };

      const _this = this;
      // 初始化 _googCsa 并加载广告
      // eslint-disable-next-line no-undef
      _googCsa("ads", adSenseConfig, {
        container: "afscontainer1", // 第一个广告容器 ID
        number: 8, // 第一个广告容器中的广告数量
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
            _this.noAd = true;
            setTimeout(() => {
              _this.noAd2 = true;
            }, 50);
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "FF_AR", query: queryString }); // 推送事件到 dataLayer
          }
        }
      });
    },
    addAdSenseScript2() {
      console.log("addAdSenseScript");
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      const clickId = searchParams.has("click_id") ? searchParams.get("click_id") : "";
      const paramKeys = [];
      const queryString = this.input;
      // 遍历查询参数并将其添加到 paramKeys 数组中
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }
      const ignoredPageParams = paramKeys.join(",");

      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-1853000876464912",
        styleId: "3796162767",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "query",
        resultsPageBaseUrl: `${window.location.origin}/search/?afs&channel=${this.channelId}${
          clickId && `&click_id=${clickId}`
        }`,
        resultsPageQueryParam: "query",
        query: `${this.input}`,
        ivt: false,
        adtest: "off"
      };
      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedstyle2", // 广告容器 ID
        relatedSearches: 8, // 相关搜索广告数量
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          console.log("adLoadedCallback", loaded, response, isExperimentVariant, callbackOptions);
          if (response) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "C_AC" }); // 事件推送到 dataLayer
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "C_AC_IN", query: queryString }); // 事件推送到 dataLayer
          }
        }
      });
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
