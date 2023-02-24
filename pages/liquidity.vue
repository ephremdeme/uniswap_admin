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

    <Table :columns="columns" :data="liquidity" :on-submit="handleSubmit" />
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
    return { wallets: wallets.data, liquidity: [] }
  },

  data() {
    return {
      form: this.$form.createForm(this),
      wallets: [],

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
          width: 100,
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
          width: 100,
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
          title: 'StopLoss',
          dataIndex: 'stopLoss',
          key: 'stopLoss',
          scopedSlots: { customRender: 'editable' },
        },
      ],
    }
  },

  watch: {
    selectedWallet: {
      handler: function (val, oldVal) {
        if (!val || val === oldVal) return
        this.getLiquidity(val)
      },
      immediate: true,
    },
  },

  methods: {
    handleWalletChange(value) {
      this.selectedWallet = value
    },

    async getLiquidity(id) {
      const liquidity = await this.$axios.get(`/api/uniswap/${id}/positions`)
      this.liquidity = liquidity.data
    },

    async handleSubmit(record, name, event) {
      const { id, owner } = record
      const liquidity = {
        id,
        owner,
        stopLoss: event,
      }
      await this.$axios.put(
        `/api/uniswap/${this.selectedWallet}/positions/${id}`,
        liquidity
      )
      await this.getLiquidity(this.selectedWallet)
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
