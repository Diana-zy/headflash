<template>
  <div class="page">
    <template v-if="newInfo">
      <Header />
      <article class="article">
        <h1 class="article-title">{{ newInfo.name }}</h1>
        <div class="news-detail">{{ newInfo.first_paragraph }}</div>
        <div id="relatedsearches1"> </div>
        <NuxtImg
          format="auto"
          fit="cover"
          width="600"
          :src="newInfo.cover"
          :alt="newInfo.name"
          class="article-img"
          preload
        />
        <!--        <div class="news-detail" v-html="newInfo.content"></div>-->
        <div class="news-detail">
          <template v-for="(item, index) in contentItems">
            <div
              v-if="item.type === 'content'"
              :key="`content-${index}`"
              v-html="item.content"
            ></div>
            <div v-else id="relatedsearches2" :key="`relatedsearch-${index}`"></div>
          </template>
        </div>
      </article>
      <Footer :lang="newInfo.language" />
    </template>
    <div v-else class="mask-box"><loading /></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channelId: "",
      newInfo: null,
      pageViewInitTime: 0,
      pageQueryAfsTime: 0
    };
  },
  computed: {
    contentItems() {
      const self = this;
      const parts = this.newInfo.content.split(/(<p[^>]*>.*?<\/p>)/gs);
      let charCount = 0;
      const items = [];

      parts.forEach((part, index) => {
        // 如果是最后一个段落，并且广告还没有添加，则插入到倒数第二段
        if (parts.length - 1 === index && !self.isAdAdded) {
          items.push({
            type: "ad"
          });
          self.isAdAdded = true;
        }

        if (!part.trim()) return; // 跳过空字符串

        // 添加内容
        items.push({
          type: "content",
          content: part
        });

        // 如果不是p标签，不计算字符数和插入广告
        if (!part.startsWith("<p")) return;

        if (self.isAdAdded) return;
        // 计算纯文本长度
        const textContent = part.replace(/<[^>]+>/g, "");
        charCount += textContent.length;

        if (charCount >= self.splitTextCount) {
          items.push({
            type: "ad"
          });
          // 是否已经push过广告
          self.isAdAdded = true;
        }
      });

      return items;
    }
  },
  mounted: function () {
    this.pageViewInitTime = new Date().getTime();
    this.getDetailInfo();
  },
  methods: {
    async getDetailInfo() {
      const aid = this.$route.query.aid;
      const data = await this.$axios.$get("/api/article/detail", {
        params: {
          site_id: process.env.SITE_ID,
          article_id: aid
        }
      });
      data.content = data.content.replace(/<\/h4><p><br><br>|<br><br><\/p><h4>/g, (match) => {
        return match.includes("</h4><p>") ? "</h4><p>" : "</p><h4>";
      });
      this.newInfo = data;

      this.setChannelId();
      /* 确保dom更新后调用广告请求 */
      this.$nextTick(() => {
        this.pageQueryAfsTime = new Date().getTime() - this.pageViewInitTime;
        this.addAdSenseScript();
      });
    },
    setChannelId() {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has("channel")) {
        this.channelId = searchParams.get("channel");
      } else {
        this.channelId = this.newInfo.channel || "";
        if (this.channelId !== "") {
          searchParams.set("channel", this.channelId);
          const newUrl = `${window.location.origin}${
            window.location.pathname
          }?${searchParams.toString()}`;
          window.history.replaceState({}, "", newUrl);
        }
      }
    },
    addAdSenseScript() {
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      const styleId = searchParams.has("styleId") ? searchParams.get("styleId") : "";
      const theme = searchParams.has("theme") ? searchParams.get("theme") : "";
      terms = terms.replace(/[，]/g, ",");
      const clickId = searchParams.has("click_id") ? searchParams.get("click_id") : "";
      const paramKeys = [];
      // 遍历查询参数并将其添加到 paramKeys 数组中
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }
      const ignoredPageParams = paramKeys.join(",");

      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-1853000876464912",
        styleId: styleId || "8180986228",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "content",
        resultsPageBaseUrl: `${window.location.origin}/search/?afs&channel=${this.channelId}${
          clickId && `&click_id=${clickId}`
        }${styleId && `&styleId=${styleId}`}${theme && `&theme=${theme}`}`,
        resultsPageQueryParam: "query",
        terms: terms || this.newInfo.terms,
        referrerAdCreative: terms || this.newInfo.referrer_ad_creative,
        ivt: false,
        adtest: "off"
      };

      const _this = this;
      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1", // 广告容器 ID
        relatedSearches: 10, // 相关搜索广告数量
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          console.log("adLoadedCallback", loaded, response, isExperimentVariant, callbackOptions);
          if (response) {
            const pageResultAfsTime = new Date().getTime() - _this.pageViewInitTime;
            // eslint-disable-next-line no-undef
            dataLayer.push({
              event: "C_AC",
              c_query_time: _this.pageQueryAfsTime,
              c_result_time: pageResultAfsTime
            }); // 事件推送到 dataLayer
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

              // eslint-disable-next-line no-undef
              dataLayer.push({
                event: "C_AC_IN",
                queryNum: 10,
                num: result,
                key1: numberOfKeys,
                key2: concatenatedKeys
              }); // 事件推送到 dataLayer
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-img {
  width: 100%;
  margin-bottom: 1em;
}
.article {
  line-height: 19px;
  font-family: "sesb";
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
  min-height: calc(100vh - 72px - 56px - 64px);
}
.article-title {
  font-size: 26px;
  font-family: "seb";
  font-weight: 700;
  line-height: 30px;
  margin-bottom: 24px;
}
.read-more {
  line-height: 4;
}
.hide {
  display: none;
  &.show {
    display: block;
  }
}
.google-ad-preload {
  margin-bottom: 4px;
}
.mask-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  @include center;
}
@media screen and (max-width: 750px) {
  .article {
    line-height: vw(38);
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
    min-height: calc(100vh - vw(304));
  }
  .article-title {
    font-size: vw(36);
    line-height: vw(48);
    margin-bottom: vw(32);
  }
  .article-desc {
    margin-bottom: vw(48);
  }
  .google-ad-preload {
    margin-bottom: vw(10);
  }
}
</style>
