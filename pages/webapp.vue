<!-- 
   Display telegram button, if user is logged in and has telegram username

 -->
<template>
  <div>
    <div>Telegram</div>
    <a-row>
      <a-col :span="10">
        <EditLiquidity />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import EditLiquidity from '../components/liquidity/EditLiquidity.vue'
export default {
  auth: false,
  components: {
    EditLiquidity,
  },
  layout: 'bot',
  setup() {
    // eslint-disable-next-line no-console
    console.log('Setup Telegram Web App')
  },

  data() {
    return {
      data: {
        telegram_username: 'test',
      },
    }
  },

  beforeMount() {
    const telegramWebApp = document.createElement('script')
    telegramWebApp.setAttribute(
      'src',
      'https://telegram.org/js/telegram-web-app.js'
    )
    document.head.appendChild(telegramWebApp)
  },

  mounted() {
    console.log('Route => ', this.$route)
  },
}
</script>
