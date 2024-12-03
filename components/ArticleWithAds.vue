<template>
  <div class="news-detail">
    <template v-for="(item, index) in contentItems">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="item.type === 'paragraph'" :key="`p-${index}`" v-html="item.content" />
      <GoogleAd v-else :key="`ad-${index}`" :ad-slot="item.slot" />
    </template>
  </div>
</template>

<script>
export default {
  name: "ArticleWithAds",
  props: {
    content: {
      type: String,
      required: true
    },
    charInterval: {
      type: Number,
      default: 1000
    },
    adConfigs: {
      type: Array,
      default: () => [
        {
          slot: "9106902700"
        },
        {
          slot: "4524659860"
        },
        {
          slot: "8648298782"
        },
        {
          slot: "3284393095"
        },
        {
          slot: "1971311422"
        }
      ]
    }
  },
  computed: {
    contentItems() {
      const paragraphs = this.content.match(/<p[^>]*>.*?<\/p>/gs) || [];
      let charCount = 0;
      let adIndex = 0;
      const items = [];
      const maxAds = this.adConfigs.length;
      let lastAdCharCount = 0; // 记录上一次插入广告时的字符数

      paragraphs.forEach((p, index) => {
        // 添加段落
        items.push({
          type: "paragraph",
          content: p
        });

        if (adIndex >= maxAds) {
          return;
        }

        const textContent = p.replace(/<[^>]+>/g, "");
        charCount += textContent.length;

        if (
          charCount >= this.charInterval &&
          (charCount - lastAdCharCount >= this.charInterval || lastAdCharCount === 0) &&
          charCount >= this.charInterval
        ) {
          const adConfig = this.adConfigs[adIndex];
          items.push({
            type: "ad",
            slot: adConfig.slot
          });
          lastAdCharCount = charCount;
          adIndex++;
        }
      });

      return items;
    }
  }
};
</script>
