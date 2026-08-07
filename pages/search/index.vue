<template>
  <div class="page">
    <Header />
    <main class="main">
      <div id="afscontainer1"> </div>
      <div id="relatedsearches1"> </div>
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
      channelId: "" // 频道 ID
    };
  },
  mounted() {
    window.handleRequestAdByChannel("first", 3, true);

    this.input = this.$route.query.query || "";
    if (this.input) {
      // 未请求广告的原因统一上报到Q_AR_NOT事件，why_ad_block区分具体原因，
      // 方便在GA4里统计"广告没请求"里各原因各占多少
      const reportAdNotRequested = (why) => {
        window.pushEventParamsToGtm("Q_AR_NOT", { why_ad_block: why });
      };
      const proceedAfterAdGate = () => {
        window.checkAdGate().then((gate) => {
          if (gate.ok) {
            this.addAdSense();
          } else {
            reportAdNotRequested(
              gate.ipMismatch ? "ip_mismatch" : gate.noClid ? "no_clid" : "unknown"
            );
          }
        });
      };
      if (window.isLoadAd === true) {
        proceedAfterAdGate();
      } else {
        window.addEventListener("loadAd", proceedAfterAdGate);
        // 进站IP解析城市变化被拉黑：youknowwho.js里的判断会让loadAd事件
        // 永远不触发（也就不会走到上面的checkAdGate），单独用另一个事件名
        // 兜底监听，避免这种情况完全没有埋点
        window.addEventListener(
          "adGateCityBlocked",
          () => reportAdNotRequested("city_changed"),
          { once: true }
        );
      }
    }
    this.input && this.searchNews();

    const searchParams = new URLSearchParams(window.location.search);
    this.channelId = searchParams.has("channel") ? searchParams.get("channel") : "";
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        if (window.handleRequestAdByChannel("", "", true)) {
          window.trackEventToPixel("Q_AR");
          window.pushEventParamsToGtm("Q_AR");
          this.addAdSenseScript();
        }
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

      const channelId = window.getParam("channel");
      const hiSource = window.getParam("hi_source");
      const hiPc = window.getParam("hi_pc");
      const from = window.getParam("from");
      const styleId = window.getParam("styleId");
      const theme = window.getParam("theme");
      const resultsPageBaseUrl = window.getResultsPageUrl({
        channel: channelId,
        from,
        hi_source: hiSource,
        hi_pc: hiPc,
        styleId,
        theme
      });
      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-1853000876464912",
        query: queryString,
        styleId: styleId || "8180986228",
        adsafe: "low",
        ivt: false,
        resultsPageBaseUrl,
        resultsPageQueryParam: "query"
      };

      // AdSense 加载回调函数
      const adLoadedCallback =
        (eventName, additionalData = {}) =>
        (loaded, response) => {
          if (response) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: eventName, ...additionalData });
          }
        };

      const adblock1 = {
        container: "afscontainer1",
        // number: num && Number(num) < 8 ? Number(num) : 8,
        number: this.channelId === "8609578834" ? 3 : 8,
        adLoadedCallback: (loaded, e) => {
          if (e) {
            window.pushEventParamsToGtm("C_AR");
            window.trackEventToPixel("C_AR");
            try {
              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 456);
              // eslint-disable-next-line no-undef
              dataLayer.push({ event: "C_AR_IN", num: result, query: queryString });
            } catch (error) {
              console.error(error);
            }
          } else {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "FF_AR", query: queryString });
          }
        }
      };

      // 根据来源配置 rsblock1
      const rsblock1 = (() => {
        const baseConfig = {
          container: "relatedsearches1",
          relatedSearches: 5,
          adLoadedCallback: adLoadedCallback("C_AC", { query: queryString })
        };
        return baseConfig;
      })();

      // 加载 Google AdSense
      // eslint-disable-next-line no-undef
      _googCsa("ads", adSenseConfig, adblock1, rsblock1);
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
