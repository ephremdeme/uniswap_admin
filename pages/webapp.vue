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
      this.getLiquidity()
    }
  },
  methods: {
    // eslint-disable-next-line require-await
    async submitForm(values) {
      try {
        await this.$axios.$put(this.telegramQuery.url, values, {
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

    async getLiquidity() {
      try {
        const liquidity = await this.$axios.$get(this.telegramQuery.url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.telegramQuery.token,
          },
        })
        this.formData = liquidity
     } catch (err) {
        this.$message.error(err.message)
      }
    },
  },
}
</script>
