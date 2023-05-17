<!-- 
   Display telegram button, if user is logged in and has telegram username

 -->
<template>
  <div>
    <div>Telegram</div>
    <a-row>
      <a-col :span="20">
        <EditLiquidity :on-submit="submitForm" :form-data="formData" />
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
      formData: null,
      telegramQuery: null,
    }
  },

  watch: {
    telegramQuery: {
      handler: function (val, oldVal) {
        if (val && oldVal && val.url !== oldVal.url) {
          console.log('telegramQuery', val, oldVal)
          this.telegramQuery = val
        }
      },
    },
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
    this.telegramQuery = this.$route.query
    if (this.telegramQuery) {
      this.getLiquidity()
    }
  },
  methods: {
    // eslint-disable-next-line require-await
    async submitForm(values) {
      try {
        console.log(this.telegramQuery, 'submitForm => ', values)
        // await this.$axios.$post('/api/telegram', this.data)
        this.$message.success('Telegram username saved')
      } catch (err) {
        this.$message.error(err.message)
      }
    },

    async getLiquidity() {
      try {
        const liquidity = await this.$axios.$get(this.telegramQuery.url, {
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + this.telegramQuery.token,
          },
        })
        this.liquidity = liquidity.data
      } catch (err) {
        this.$message.error(err.message)
      }
    },
  },
}
</script>
