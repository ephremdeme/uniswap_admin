
<!-- 
   Display telegram button, if user is logged in and has telegram username

 -->
 <template>
    <div>
        <div>
        <a-button
            type="primary"
            href="https://t.me/liquiditynetwork"
            target="_blank"
            rel="noopener noreferrer"
            class="telegram-button"
        >
            <img
            src="/telegram.svg"
            alt="Telegram"
            style="width: 20px; margin-right: 8px"
            />
            Telegram
        </a-button>
        </div>
    </div>
 </template>

<script>
export default {
  name: 'WalletDetailPage',
  setup() {
    const telegramWebApp = document.createElement("script");
    telegramWebApp.setAttribute(
      "src",
      "https://telegram.org/js/telegram-web-app.js"
    );
    document.head.appendChild(telegramWebApp);
  },

  // get data from /api/accounts/:id
//   async asyncData({ $axios, params }) {
//     const { data } = await $axios.get(`/api/accounts/${params.id}`)
//     const { data: tokens } = await $axios.get(
//       `/api/accounts/${params.id}/tokens`
//     )
//     return { data, tokens }
//   },
  data() {
    return {
        data : {
            telegram_username: "test"
        }
    }
  },

  mounted() {
    console.log("Telegram => ", window.Telegram.WebApp);
    if (window.Telegram && this.data.telegram_username) {
      window.TelegramLoginWidget = {
        dataOnauth: (user) => {
          console.log(user);
        },
      };
      window.TelegramLoginWidget.auth(
        {
          bot_id: "LiquidityNetworkBot",
          request_access: true,
        },
        "telegram-login",
        "large"
      );
    }
  },
}

