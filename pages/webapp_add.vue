<template>
  <div>
    <div>Telegram Mint Liquidity</div>
    <a-row>
      <a-col :span="20">
        <AddLiquidity :on-submit="submitForm" :form-data="formData" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import AddLiquidity from '../components/liquidity/AddLiquidity.vue'
export default {
  auth: false,
  components: {
    AddLiquidity,
  },
  layout: 'bot',
  data() {
    return {
      formData: {
        tokens: [],
      },
      telegramQuery: null,
    }
  },

  watch: {
    telegramQuery: {
      handler: function (val, oldVal) {
        if (val && oldVal && val.url !== oldVal.url) {
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
    this.telegramQuery = this.$route.query
    if (this.telegramQuery) {
      this.getTokens()
    }
  },
  methods: {
    // eslint-disable-next-line require-await
    async submitForm(values) {
      try {
        await this.$axios.$post(this.telegramQuery.url, values, {
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + this.telegramQuery.token,
          },
        })
        this.$message.success('Position updated successfully')
      } catch (err) {
        this.$message.error(err.message)
      }
    },

    async getTokens() {
      try {
        this.loading = true
        const origin = new URL(this.telegramQuery.url).origin
        const tokens = await this.$axios
          .$get(`${origin}/uniswap/api/tokens`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.telegramQuery.token,
            },
          })
          .catch((e) => {
            this.$message.error(e.message)
            return [];
          })
        this.formData.tokens = tokens
        this.loading = false
      } catch (err) {
        this.$message.error(err.message)
      }
    },
  },
}
</script>
