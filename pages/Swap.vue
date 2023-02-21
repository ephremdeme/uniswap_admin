<template>
  <div>
    <a-row type="flex" flex justify="space-around" align="middle">
      <a-col :span="9">
        <h1>Swap</h1>

        <div class="filter">
          <a-form-item label="Wallet: ">
            <a-select
              placeholder="Select Wallet"
              style="width: 100%"
              @change="handleWalletChange"
            >
              <a-select-option
                v-for="wallet in wallets"
                :key="wallet._id"
                :value="wallet._id"
              >
                {{ wallet.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </a-col>
    </a-row>

    <a-row type="flex" flex justify="center" align="middle">
      <a-col :span="8">
        <a-form
          v-if="selectedWallet"
          :form="form"
          :layout="layout"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          @submit="handleSubmit"
        >
          <a-form-item label="Token 1">
            <a-select
              v-decorator="[
                'token1',
                {
                  rules: [
                    { required: true, message: 'Please select a token!' },
                  ],
                },
              ]"
              placeholder="Select a token"
              style="width: 100%"
            >
              <a-select-option
                v-for="token in tokens"
                :key="token._id"
                :value="token.address"
              >
                {{ token.name }} - {{ token.balance }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Token 1 Amount">
            <a-input-number
              v-decorator="[
                'token1Amount',
                {
                  rules: [
                    { required: true, message: 'Please input token amount!' },
                  ],
                },
              ]"
              :min="0"
              :max="1000000000"
              :step="0.01"
            />
          </a-form-item>

          <a-form-item label="Token 2">
            <a-select
              v-decorator="[
                'token2',
                {
                  rules: [
                    { required: true, message: 'Please select a token!' },
                  ],
                },
              ]"
              placeholder="Select a token"
              style="width: 100%"
            >
              <a-select-option
                v-for="token in tokens"
                :key="token._id"
                :value="token.address"
              >
                {{ token.name }} - {{ token.balance }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit" :loading="loading">
              Submit
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Form, Select, InputNumber } from 'ant-design-vue'

export default {
  name: 'NuxtSwap',
  components: {
    'a-form': Form,
    'a-select': Select,
    'a-input-number': InputNumber,
  },

  async asyncData({ $axios }) {
    const wallets = await $axios.get('/api/accounts')

    return { wallets: wallets.data, tokens: [] }
  },

  data() {
    return {
      form: this.$form.createForm(this),
      wallets: [],
      tokens: [],
      selectedWallet: '',

      layout: 'horizontal',
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      loading: false,
    }
  },

  watch: {
    selectedWallet: {
      handler: function (val, oldVal) {
        this.form.resetFields()

        if (val && val !== oldVal) {
          this.$axios.get(`/api/accounts/${val}/tokens`).then((res) => {
            this.tokens = res.data
          })
        }
      },
      immediate: true,
    },
  },

  mounted() {
    if (this.selectedWallet) {
      this.$axios
        .get(`/api/accounts/${this.selectedWallet}/tokens`)
        .then((res) => {
          this.tokens = res.data
        })
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$axios
            .post(`/api/uniswap/swap`, {
              ...values,
              wallet: this.selectedWallet,
            })
            .then((res) => {
              if (res.data === 'Failed')
                this.$message.error('Swap ' + err)
              else this.$message.success('Swap ' + res.data)
            })
            .catch((err) => {
              this.$message.error('Swap failed' + err.message)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },

    handleWalletChange(value) {
      this.selectedWallet = value
    },
  },
}
</script>

<style scoped>
.filter {
  margin-bottom: 20px;
}

.form {
  margin-top: 20px;
}

.form-item {
  margin-bottom: 0;
}

.form-item-label {
  text-align: left;
}

.form-item-control {
  margin-left: 0;
}

.form-item-control-input {
  width: 100%;
}

.form-item-control-input-content {
  width: 100%;
}

.form-item-control-input-content input {
  width: 100%;
}
</style>
