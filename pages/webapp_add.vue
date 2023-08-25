<template>
  <div>
    <a-row>
      <a-col :span="24" :style="{ textAlign: 'center', marginBottom: '14px' }">
        <div>Telegram Mint Liquidity</div>
      </a-col>
      <a-col :span="23" :offset="1">
        <a-spin :spinning="loading" :delay="500">
          <AddLiquidity
            :on-submit="submitForm"
            :form-data="formData"
            :loading="loading"
            @fetch-pool-info="fetchPoolInfo"
          />
        </a-spin>
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
        poolInfo: null,
      },
      telegramQuery: null,
      loading: false,
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

    formData: {
      handler: function (val, oldVal) {
        if (val && oldVal && val.tokens !== oldVal.tokens) {
          this.formData = val
        }

        if (val && oldVal && val.poolInfo !== oldVal.poolInfo) {
          this.formData = val
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
        this.loading = true
        await this.$axios.$post(this.telegramQuery.url, values, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.telegramQuery.token,
          },
        })
        this.loading = false
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

      const origin = new URL(this.telegramQuery.url).origin

      const poolInfo = await this.$axios
        .post(
          `${origin}/uniswap/api/uniswap/poolInfo`,
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
      this.loading = false
      this.formData.poolInfo = poolInfo.data
    },
  },
}
</script>
