<template>
  <div class="page">
    <Header />
    <main class="main">
      <section v-swiper:mySwiper="swiperOption" class="swiper-box">
        <div class="swiper-wrapper">
          <news-item-1 v-for="(item, i) in recNews.list" :key="i" class="swiper-slide" :item="item">
          </news-item-1>
        </div>
      </section>

      <h2 class="title-h2">Trending</h2>
      <section class="news-box-2">
        <news-item-2 v-for="(item, i) in trendingNews.list" :key="i" :item="item"> </news-item-2>
      </section>

      <h2 class="title-h2">All Articles</h2>
      <section class="news-box-2">
        <news-item-2 v-for="(item, i) in allNews.list" :key="i" :item="item"> </news-item-2>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";

export default {
  directives: {
    swiper: directive
  },
  async asyncData({ $axios, env }) {
    try {
      // 并行处理多个异步请求
      const [recNewsResponse, trendingNewsResponse, allNewsResponse] = await Promise.all([
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "rec"
          }
        }),
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "trending",
            size: 10
          }
        }),
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "all",
            size: 10
          }
        })
      ]);

      // 返回多个接口的数据
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        allNews: allNewsResponse
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        autoplay: {
          delay: 3000
        }
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.swiper-slide {
  width: 282px;
  border-radius: 16px 16px 16px 16px;
  border: 1px solid #ececee;
  margin-right: 24px;
  overflow: hidden;
}
.news-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media screen and (max-width: 1100px) {
  .news-box-2 {
    display: flex;
    flex-wrap: wrap;
  }
}
@media screen and (max-width: 750px) {
  .main {
    padding-bottom: vw(32);
    border-bottom: none;
  }
  .swiper-box {
    width: 100vw;
    margin-left: vw(-46);
    padding-left: vw(23);
  }
  .swiper-slide {
    width: vw(480);
    border-radius: vw(32);
    border: vw(2) solid #ececee;
    margin-right: vw(32);
  }
  .news-box-2 {
    gap: vw(32);
  }
}
</style>
