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

    <a-button class="add-btn" type="primary" @click="showModal">Add</a-button>

    <Table
      :columns="columns"
      :data="liquidity"
      :on-submit="handleSubmit"
      :allow-delete="true"
      :form-component="EditLiquidity"
      :allow-add="false"
      :loading="loading"
      :allow-remove="true"
      :on-remove="handleRemove"
      :on-delete="handleDelete"
      :on-collect="handleCollect"
    />
    <a-modal
      :visible="visible"
      :title="title"
      :footer="null"
      @cancel="handleCancel"
    >
      <component
        :is="AddLiquidity"
        :form-data="formData"
        :on-submit="handleSubmit"
      />
    </a-modal>
  </div>
</template>

<script>
import { Form, Select } from 'ant-design-vue'
import EditLiquidity from '../../components/liquidity/EditLiquidity.vue'
import AddLiquidity from '../../components/liquidity/AddLiquidity.vue'

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
      visible: false,
      formData: {
        tokens: [],
      },
      title: 'Mint Liquidity!',

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
          width: 90,
          fixed: 'left'
        },
        {
          title: 'Pair',
          dataIndex: 'pair',
          key: 'pair',
          scopedSlots: { customRender: 'tags' },
          width: 130,
          fixed: 'left'
        },
        {
          title: 'Price',
          dataIndex: 'currentPrice',
          key: 'currentPrice',
          width: 100,
        },
        {
          title: 'Balance0',
          dataIndex: 'balance0',
          key: 'balance0',
          width: 130,
        },
        {
          title: 'Balance1',
          dataIndex: 'balance1',
          key: 'balance1',
          width: 130,
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
          title: 'Low Price',
          dataIndex: 'lowPrice',
          key: 'lowPrice',
          width: 90,
        },
        {
          title: 'High Price',
          dataIndex: 'highPrice',
          key: 'highPrice',
          width: 95,
        },
        {
          title: 'StopLow',
          dataIndex: 'stopLow',
          key: 'stopLow',
          width: 90,
        },
        {
          title: 'StopHigh',
          dataIndex: 'stopHigh',
          key: 'stopHigh',
          width: 95,
        },
        {
          title: 'Slippage',
          dataIndex: 'slippage',
          key: 'slippage',
          width: 90,
        },
        {
          title: 'Token Low',
          dataIndex: 'tokenLow.symbol',
          key: 'tokenLow',
          scopedSlots: { customRender: 'tags' },
          width: 120,
        },
        {
          title: 'Token High',
          dataIndex: 'tokenHigh.symbol',
          key: 'tokenHigh',
          scopedSlots: { customRender: 'tags' },
          width: 120,
        },
        {
          title: 'Action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 320,
        },
      ],
      EditLiquidity,
      AddLiquidity,
    }
  },

  mounted() {
    this.form.setFieldsValue({
      wallet: this.wallets[0]?._id,
    })

    if (this.wallets[0]) {
      this.getLiquidity(this.wallets[0]._id)
      this.wallet = this.wallets[0]._id
      this.getTokens()
    }
  },

  methods: {
    showModal() {
      this.title = 'Add'
      this.visible = true
    },

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

    async getTokens() {
      this.loading = true
      const tokens = await this.$axios.get(`/api/tokens`).catch((e) => {
        this.$message.error(e.message)
        return { data: [] }
      })
      this.formData.tokens = tokens.data
      this.loading = false
    },

    async handleSubmit(values) {
      this.loading = true
      try {
        if(values.id) {

        
        await this.$axios.put(
          `/api/uniswap/${this.wallet}/positions/${values.id}`,
          values
        )
        }else  {
          await this.$axios.post(
            `/api/uniswap/${this.wallet}/positions`,
            values
          )
        }
        await this.getLiquidity(this.wallet)
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.loading = false
      }
    },

    handleDelete(pos) {
      this.loading = true
      this.$axios
        .delete(`/api/uniswap/${this.wallet}/positions/${pos.id}`)
        .then(() => {
          this.getLiquidity(this.wallet)
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleRemove(pos) {
      this.loading = true
      this.$axios
        .post(`/api/uniswap/${this.wallet}/positions/${pos.id}/swap`, {
          slippage: pos.slippage,
          token: pos.token?.address || pos.token,
        })
        .then(() => {
          this.getLiquidity(this.wallet)
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleCollect(pos) {
      this.loading = true
      this.$axios
        .put(`/api/uniswap/${this.wallet}/positions/collect`, {
          posId: pos.id,
        })
        .then(() => {
          this.getLiquidity(this.wallet)
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleCancel() {
      this.visible = false
      this.formData = {}
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
