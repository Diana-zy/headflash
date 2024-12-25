<template>
  <footer class="footer">
    <div class="copyright">
      <div class="copyright-content">
        <div class="copyright-content-1">
          <CustomLink
            :to="`/eula${['ja', 'ko', 'zh_TW'].indexOf(lang) === -1 ? '' : '-' + lang}.html`"
            target="_blank"
          >
            {{ eulaText[lang] || eulaText["en"] }}
          </CustomLink>
          <CustomLink
            :to="`/privacy${['ja', 'ko', 'zh_TW'].indexOf(lang) === -1 ? '' : '-' + lang}.html`"
            target="_blank"
          >
            {{ privacyText[lang] || privacyText["en"] }} </CustomLink
          ><CustomLink
            :to="`/cookies${['ja', 'ko', 'zh_TW'].indexOf(lang) === -1 ? '' : '-' + lang}.html`"
            target="_blank"
          >
            {{ cookiesText[lang] || cookiesText["en"] }}
          </CustomLink>
          <a href="mailto:service@headflash.net">
            {{ contactText[lang] || contactText["en"] }}
          </a>
        </div>
        <span>
          {{ copyRightText1[lang] || copyRightText1["en"] }}
          ©&nbsp; 2024 HeadFlash &nbsp;
          {{ copyRightText2[lang] || copyRightText2["en"] }}
        </span>
      </div>
    </div>
    <Notification v-if="showNotification" :message="notificationMessage" />
  </footer>
</template>

<script>
import { validateEmail } from "~/utils/utils";

export default {
  props: {
    lang: {
      type: String,
      default: "en"
    }
  },
  data() {
    return {
      input: "",
      eulaText: {
        en: "Terms of Service",
        ja: "利用規約",
        ko: "서비스 약관",
        zh_TW: "服務條款",
        pt: "Termos de Serviço" // 葡萄牙语
      },
      privacyText: {
        en: "Privacy Policy",
        ja: "プライバシーポリシー",
        ko: "개인 정보 정책",
        pt: "Política de Privacidade", // 葡萄牙语
        zh_TW: "隱私政策"
      },
      cookiesText: {
        en: "Cookies Policy",
        ja: "クッキーポリシー",
        pt: "Política de Cookies", // 葡萄牙语
        ko: "쿠키 정책",
        zh_TW: "Cookie 政策"
      },
      contactText: {
        en: "Contact",
        ja: "連絡先",
        pt: "Contato", // 葡萄牙语
        ko: "연락하다",
        zh_TW: "聯絡"
      },
      copyRightText1: {
        en: "Copyright",
        ja: "著作権",
        pt: "Direitos Autorais", // 葡萄牙语
        ko: "모든 권리 보유",
        zh_TW: "Copyright"
      },
      copyRightText2: {
        en: "All rights reserved",
        ja: "無断複写・転載を禁じます",
        ko: "저작권",
        pt: "Todos os direitos reservados", // 葡萄牙语
        zh_TW: "All rights reserved"
      }
    };
  },
  computed: {
    showNotification() {
      return this.$globalData.notification.show;
    },
    notificationMessage() {
      return this.$globalData.notification.message;
    }
  },
  methods: {
    async submitEmail() {
      if (validateEmail(this.input)) {
        await this.$axios.$post("/api/game/subscribe", {
          site_id: process.env.SITE_ID,
          email: this.input
        });
        this.$globalMethod.showNotification({
          message: "Thank you for subscribing!",
          type: "success"
        });
      } else {
        this.$globalMethod.showNotification({
          message: "Please enter a valid email address",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  margin-top: 32px;
}
.subscription {
  display: flex;
  justify-content: space-between;
  flex-flow: row-reverse;
  padding-top: 32px;
  padding-bottom: 16px;
}
.introduction {
  color: $font1;
  line-height: 19px;
  a {
    font-family: "sesb";
    color: $font1;
  }
}
.subscription-content {
  min-width: 390px;
  margin-left: 40px;
  .text {
    color: $font1;
    font-family: "seb";
    font-size: 20px;
    line-height: 20px;
    margin-bottom: 16px;
  }
  .box-submit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    background: #f5f5f5;
    border-radius: 8px;
  }
  .email {
    width: 240px;
    padding-left: 16px;
    color: $font1;
    font-family: "sesb";
    &::placeholder {
      font-family: "se";
      color: rgba($font1, 0.4);
    }
  }
  .submit {
    width: 122px;
    height: 40px;
    background: $color1;
    border-radius: 8px;
    @include center;
    font-size: 16px;
    color: #fff;
    font-family: "seb";
    cursor: pointer;
  }
}
.copyright-content-1 {
  display: flex;
  flex-wrap: nowrap;
}
.copyright {
  display: flex;
  align-items: center;
  height: 56px;
  position: relative;
  z-index: 1;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 100%;
    background: #f1f1f1;
    z-index: -1;
  }
  .copyright-content {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $font1;
    a {
      color: $font1;
      flex-shrink: 0;
      white-space: nowrap;
      &::after {
        content: "|";
        margin-left: 9px;
        margin-right: 9px;
        opacity: 0.4;
      }
      &:last-child {
        &::after {
          content: "";
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .footer {
    margin-top: vw(32);
  }
  .subscription {
    display: block;
    padding-top: 0;
    padding-bottom: vw(16);
  }
  .introduction {
    color: rgba($font1, 0.6);
    font-size: vw(24);
    line-height: vw(32);
    margin-top: vw(32);
  }
  .subscription-content {
    min-width: 100%;
    margin-left: 0;
    .text {
      font-size: vw(28);
      line-height: vw(38);
      margin-bottom: vw(16);
    }
    .box-submit {
      display: block;
      height: auto;
      background: none;
    }
    .email {
      width: 100%;
      padding-left: vw(16);
      font-size: vw(24);
      height: vw(80);
      background: #f1f1f1;
      border-radius: vw(16);
      margin-bottom: vw(16);
    }
    .submit {
      width: vw(208);
      height: vw(80);
      border-radius: vw(16);
      font-size: vw(28);
    }
  }
  .copyright {
    height: auto;
    padding-bottom: vw(32);
    &:before {
      display: none;
    }
    .copyright-content {
      height: auto;
      flex-direction: column;
      font-size: vw(24);
      line-height: vw(48);
      a {
        &::after {
          margin-left: vw(8);
          margin-right: vw(8);
        }
      }
    }
  }
}
</style>
