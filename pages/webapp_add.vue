<template>
  <div>
    <a-row>
      <a-col :span="24" :style="{ textAlign: 'center', marginBottom: '14px' }">
        <div>Telegram Mint Liquidity</div>
      </a-col>
      <a-col :span="23" :offset="1">
        <AddLiquidity
          :on-submit="submitForm"
          :form-data="formData"
          @fetch-pool-info="fetchPoolInfo"
        />
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
    FormData: {
      handler: function (val, oldVal) {
        console.log('Value => ', val)
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
        const origin = 'http://localhost:5005'
        const tokens = await this.$axios
          .$get(`${origin}/api/tokens`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.telegramQuery.token,
            },
          })
          .catch((e) => {
            this.$message.error(e.message)
            return []
          })
        this.formData.tokens = tokens
        this.loading = false
      } catch (err) {
        this.$message.error(err.message)
      }
    },

    async fetchPoolInfo(values) {
      const { fee, token0, token1 } = values

      const origin = 'http://localhost:5005'

      const poolInfo = await this.$axios
        .post(
          `${origin}/api/uniswap/poolInfo`,
          {
            token0,
            token1,
            fee,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.telegramQuery.token,
            },
          }
        )
        .catch((e) => {
          this.$message.error(e.message)
          return {}
        })
      console.log('Pool Info => ', poolInfo)

      this.formData.poolInfo = poolInfo
    },
  },
}
</script>
