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

    <Table :columns="columns" :data="liquidity" />
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
          title: 'ID',
          dataIndex: 'id',
          key: 'ids',
        },
        {
          title: 'Address',
          dataIndex: 'owner',
          key: 'owner',
        },
        {
          title: 'Symbol0',
          dataIndex: 'token0.symbol',
          key: 'symbol0',
          scopedSlots: { customRender: 'tags' },
        },
        {
          title: 'Balance0',
          dataIndex: 'balance0',
          key: 'balance0',
        },
        {
          title: 'Symbol1',
          dataIndex: 'token1.symbol',
          key: 'symbol1',
          scopedSlots: { customRender: 'tags' },
        },
        {
          title: 'Balance1',
          dataIndex: 'balance1',
          key: 'balance1',
        },
        {
          title: 'Liquidty',
          dataIndex: 'liquidity',
          key: 'liquidity',
        },
        {
          title: 'Stoploss',
          dataIndex: 'stoploss',
          key: 'stoploss',
          customRender: (text, record) => (
            <div>
              <a-input-number
                min={0}
                max={100}
                defaultValue={0}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace('%', '')}
                onChange="handleStoplossChange(value, record)"
              />
              <button
                class="ant-btn ant-btn-primary"
                onChange="handleStoplossClick(record)"
              >
                Set
              </button>

            </div>
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

     handleStoplossChange(value, record) {
      const { id, owner, token0, token1, depositedToken0, depositedToken1 } =
        record
      const liquidity = {
        id,
        owner,
        token0,
        token1,
        depositedToken0,
        depositedToken1,
        stoploss: value,
      }
      return liquidity
    },

    async handleStoplossClick(record) {
      const { id, owner, token0, token1, depositedToken0, depositedToken1, stoploss } =
        record
      const liquidity = {
        id,
        owner,
        token0,
        token1,
        depositedToken0,
        depositedToken1,
        stoploss,
      }
      await this.$axios.put(`/api/uniswap/wallet/${id}`, liquidity)
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
