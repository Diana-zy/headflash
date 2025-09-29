<template>
  <div class="page">
    <Header />
    <main class="main">
      <div id="afscontainer1"> </div>
      <div id="relatedsearches1"> </div>
      <!-- <adm-slot-preload
        v-if="noAd"
        title="Non-search result Ad"
        adm-id="search-0"
        adm-unit="/23197833490/headflash/headflash_search_0"
      />
      <adm-slot-preload
        v-if="noAd2"
        title="Non-search result Ad"
        adm-id="search-1"
        adm-unit="/23197833490/headflash/headflash_search_1"
      /> -->
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
      channelId: "", // 频道 ID
      noAd: false,
      noAd2: false
    };
  },
  mounted() {
    if (
      !window.getCookie("first") &&
      window.getCookie("mounted") &&
      window.getCookie("query_ad") &&
      window.getCookie("click_ad")
    ) {
      // 符合前置条件，则可以请求广告（暂不限制）
      window.setCookie("first", 999, 1);
    }
    if (window.getDetailIsClickAc()) {
      window.dataLayer.push({
        event: "S_PL"
      });
    }

    this.input = this.$route.query.query || "";
    if (window.isLoadAd === true) {
      this.input && this.addAdSense();
    } else {
      window.addEventListener("loadAd", () => {
        this.input && this.addAdSense();
      });
    }
    this.input && this.searchNews();

    const searchParams = new URLSearchParams(window.location.search);
    this.channelId = searchParams.has("channel") ? searchParams.get("channel") : "";
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        const buffer = window.getCookie("first");
        if (buffer && buffer !== "ok") {
          window.trackEventToPixel("Q_AR");
          window.pushEventParamsToGtm("Q_AR");
          this.addAdSenseScript();
          if (Number(buffer) > 1) {
            window.setCookie("first", Number(buffer) - 1, 1);
          } else {
            window.setCookie("first", "ok", 1);
          }
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
            // eslint-disable-next-line no-undef
            window.pushEventParamsToGtm("C_AR");
            window.trackEventToPixel("C_AR");
            if (window.getDetailIsClickAc()) {
              window.dataLayer.push({
                event: "C_AR_C"
              });
            }
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
            this.noAd = true;
            setTimeout(() => {
              this.noAd2 = true;
            }, 50);
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
