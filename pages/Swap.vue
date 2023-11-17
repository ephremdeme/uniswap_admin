<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <SwapComponent :wallets="wallets" :tokens="tokens" :loading="loading" :on-submit="handleSubmit"
    :price="price" />
</template>

<script>
import SwapComponent from '../components/swap/SwapToken.vue'

export default {
  name: 'NuxtSwap',
  components: {
    SwapComponent,
  },
  layout: 'bot',

  async asyncData({ $axios }) {
    const wallets = await $axios.get('/api/accounts')

    return { wallets: wallets.data, tokens: [] }
  },

  data() {
    return {
      form: this.$form.createForm(this),
      wallets: [],
      tokens: [],
      price: NaN,

      layout: 'horizontal',
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      loading: false,
    }
  },

  methods: {
    handleSubmit(values) {
      this.loading = true
      this.$axios
        .post(`/api/uniswap/swap`, values)
        .then((res) => {
          if (res.data === 'Failed')
            this.$message.error('Swap Failed')
          else this.$message.success('Swapped Successfully: ' + res.data.transactionHash)
        })
        .catch((err) => {
          this.$message.error('Swap failed' + err.message)
        })
        .finally(() => {
          this.loading = false
        })

    },

    fetchRate(token1, token2) {
      if (token1 === token2) return 1;

      if (!token1 || !token2) return NaN;

      this.loading = true
      this.$axios
        .get(
          `/api/uniswap/exchange-rate/${token1}/${token2}`
        )
        .then((res) => {
          this.price = +(res.data)
        })
        .catch((err) => {
          this.$message.error("Can't get price: " + err.message)
        })
        .finally(() => {
          this.loading = false
        })
    }

  },

  fetchTokens(walletId) {
    this.loading = true
    this.$axios
      .get(`/api/accounts/${walletId}/tokens`)
      .then((res) => {
        this.tokens = res.data
      })
      .catch((err) => {
        this.$message.error('Error getting tokens: ' + err.message)
      })
      .finally(() => {
        this.loading = false
      })
  },
}
</script>
