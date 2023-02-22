<template>
  <div class="liquidity">
    <a-row type="flex" flex justify="space-around" align="middle">
      <a-col :span="9">
        <h1>Liquidity</h1>
      </a-col>
    </a-row>
    <a-form
      :form="form"
      :layout="layout"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="Wallet">
        <a-select placeholder="Select a wallet" @change="handleWalletChange">
          <a-select-option
            v-for="wallet in wallets"
            :key="wallet._id"
            :value="wallet._id"
          >
            {{ wallet.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-divider />
    <a-table :columns="columns" :data-source="liquidity" :pagination="false" />
  </div>
</template>

<script>
import { Form, Select, InputNumber } from 'ant-design-vue'

export default {
  name: 'NuxtLiquidity',
  components: {
    'a-form': Form,
    'a-select': Select,
    // eslint-disable-next-line vue/no-unused-components
    'a-input-number': InputNumber,
  },

  async asyncData({ $axios }) {
    const wallets = await $axios.get('/api/accounts')
    return { wallets: wallets.data, tokens: [], liquidity: [] }
  },

  data() {
    return {
      form: this.$form.createForm(this),
      wallets: [],
      tokens: [],
      liquidity: [],
      selectedWallet: '',
      selectedToken: '',
      amount: 0,

      layout: 'horizontal',
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      loading: false,
      columns: [
        {
          title: 'Token',
          dataIndex: 'token',
          key: 'token',
          render: (text, record) => <a-tag color="blue">{text}</a-tag>,
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <a-button
              type="danger"
              onClick={() => this.removeLiquidity(record)}
            >
              Remove
            </a-button>
          ),
        },
      ],
    }
  },

  watch: {
    selectedWallet: {
      handler: function (val, oldVal) {
        if (!val || val === oldVal) return
        this.getTokens(val)
        this.getLiquidity(val)
      },
      immediate: true,
    },
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addLiquidity()
        }
      })
    },

    handleWalletChange(value) {
      this.selectedWallet = value
    },

    async getTokens(id) {
      const tokens = await this.$axios.get(`/api/accounts/${id}/tokens`)
      this.tokens = tokens.data
    },

    async getLiquidity(id) {
      const liquidity = await this.$axios.get(`/api/uniswap/${id}/positions`)
      this.liquidity = liquidity.data
    },

    async addLiquidity() {
      this.loading = true
      const liquidity = await this.$axios.post(
        `/api/uniswap/${this.selectedWallet}/liquidity`,
        {
          token: this.selectedToken,
          amount: this.amount,
        }
      )
      this.liquidity = liquidity.data
      this.loading = false
      this.getLiquidity(this.selectedWallet)
    },

    async removeLiquidity(liquidity) {
      this.loading = true
      await this.$axios.delete(
        `/api/uniswap/${this.selectedWallet}/liquidity/${liquidity._id}`
      )
      this.loading = false
      this.getLiquidity(this.selectedWallet)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.liquidity {
  padding: 30px;
}

.liquidity a-form-item {
  margin-bottom: 0;
}

.liquidity a-form-item:last-child {
  margin-bottom: 24px;
}

.liquidity a-form-item:last-child a-button {
  margin-left: 8px;
}

.liquidity a-divider {
  margin: 24px 0;
}

.liquidity a-table {
  margin-top: 24px;
}

.liquidity a-table a-tag {
  margin-right: 8px;
}

.liquidity a-table a-button {
  margin-left: 8px;
}

.liquidity a-table a-button:last-child {
  margin-left: 0;
}

.liquidity a-table a-button:first-child {
  margin-left: 8px;
}

.liquidity a-table a-button:last-child {
  margin-left: 0;
}

.liquidity a-table a-button:first-child {
  margin-left: 8px;
}

.liquidity a-table a-button:last-child {
  margin-left: 0;
}
</style>
