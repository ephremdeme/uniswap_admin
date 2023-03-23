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
        <a-select
          v-decorator="[
            'wallet',
            {
              rules: [
                {
                  required: true,
                  message: 'Please select a wallet',
                },
              ],
            },
          ]"
          placeholder="Select a wallet"
          @change="handleWalletChange"
        >
          <a-select-option
            v-for="wal in wallets"
            :key="wal._id"
            :value="wal._id"
          >
            {{ wal.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-divider />

    <Table
      :columns="columns"
      :data="liquidity"
      :on-submit="handleSubmit"
      :allow-delete="false"
      :form-component="EditLiquidity"
      :loading="loading"
    />
  </div>
</template>

<script>
import { Form, Select } from 'ant-design-vue'
import EditLiquidity from '../components/liquidity/EditLiquidity.vue'

export default {
  name: 'NuxtLiquidity',
  components: {
    'a-form': Form,
    'a-select': Select,
  },

  async asyncData({ $axios }) {
    const wallets = await $axios.get('/api/accounts')
    return { wallets: wallets.data, liquidity: [] }
  },

  data() {
    return {
      form: this.$form.createForm(this),
      wallets: [],

      liquidity: [],
      wallet: '',
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
          title: 'Pair',
          dataIndex: 'pair',
          key: 'pair',
          scopedSlots: { customRender: 'tags' },
          width: 130,
        },
        {
          title: 'Price',
          dataIndex: 'currentPrice',
          key: 'currentPrice',
          width: 100,
        },
        {
          title: 'Deposited0',
          dataIndex: 'depositedToken0',
          key: 'depositedToken0',
          width: 130,
        },
        {
          title: 'Deposited1',
          dataIndex: 'depositedToken1',
          key: 'depositedToken1',
          width: 130,
        },
        {
          title: 'Balance0',
          dataIndex: 'balance0',
          key: 'balance0',
          width: 130
        },
        {
          title: 'Balance1',
          dataIndex: 'balance1',
          key: 'balance1',
          width: 130
        },
        {
          title: 'Fees0',
          dataIndex: 'collectedFeesToken0',
          key: 'collectedFeesToken0',
          width: 110
        },
        {
          title: 'Fees1',
          dataIndex: 'collectedFeesToken1',
          key: 'collectedFeesToken1',
          width: 110
        },
        {
          title: 'StopLow',
          dataIndex: 'stopLow',
          key: 'stopLow',
          width: 90
        },
        {
          title: 'StopHigh',
          dataIndex: 'stopHigh',
          key: 'stopHigh',
          width: 95
        },
        {
          title: 'Slippage',
          dataIndex: 'slippage',
          key: 'slippage',
          width: 90
        },
        {
          title: 'Token',
          dataIndex: 'token.symbol',
          key: 'token',
          scopedSlots: { customRender: 'tags' },
          width: 80,
        },
        
        {
          title: 'Edit',
          key: 'edit',
          scopedSlots: { customRender: 'action' },
        },
      ],
      EditLiquidity,
    }
  },

  mounted() {
    this.form.setFieldsValue({
      wallet: this.wallets[0]?._id,
    })

    if (this.wallets[0]) {
      this.getLiquidity(this.wallets[0]._id)
      this.wallet = this.wallets[0]._id
    }
  },

  methods: {
    handleWalletChange(value) {
      if (!value) return

      if (this.wallet === value) return
      this.wallet = value
      this.getLiquidity(value)
    },

    async getLiquidity(id) {
      this.loading = true
      const liquidity = await this.$axios
        .get(`/api/uniswap/${id}/positions`)
        .catch((e) => {
          this.$message.error(e.message)
          return { data: [] }
        })
      this.liquidity = liquidity.data.map((l) => {
        return {
          ...l,
          key: l.id,
          pair: `${l.token0.symbol}-${l.token1.symbol}`,
        }
      })
      this.loading = false
    },

    async handleSubmit(values) {
      this.loading = true
      try {
        const { id, stopHigh, stopLow, slippage, token } = values

        const liquidity = {
          id,
          stopHigh,
          stopLow,
          slippage,
          token,
        }
        await this.$axios.put(
          `/api/uniswap/${this.wallet}/positions/${id}`,
          liquidity
        )
        await this.getLiquidity(this.wallet)
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.loading = false
      }
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
