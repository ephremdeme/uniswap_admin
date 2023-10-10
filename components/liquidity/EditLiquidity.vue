<template>
  <a-form :form="form" :layout="layout" @submit="handleSubmit">
    <a-row>
      <a-col style="margin: 8px; margin-top: 3px;">
        <div v-if="!isNaN(price)">Price: {{ price }}</div>
      </a-col>
      <a-col :span="10">
        <a-form-item label="Deposited0">
          <a-input-number
            v-decorator="[
              'depositedToken0',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input a stop low value',
                  },
                ],
              },
            ]"
            :min="0"
            :step="10"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Deposited1">
          <a-input-number
            v-decorator="[
              'depositedToken1',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input a stop low value',
                  },
                ],
              },
            ]"
            :min="0"
            :step="10"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="10">
        <a-form-item label="Stop Low">
          <a-input-number
            v-decorator="[
              'stopLow',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input a stop low value',
                  },
                ],
              },
            ]"
            :min="0"
            :step="10"
          />
        </a-form-item>
      </a-col>
      <a-col :span="13">
        <a-form-item label="Token">
          <a-select
            v-decorator="[
              'tokenLow',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please select a token',
                  },
                ],
              },
            ]"
            placeholder="Select a wallet"
          >
            <a-select-option
              v-for="token in tokens"
              :key="token.value"
              :value="token.value"
            >
              {{ token.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="10">
        <a-form-item label="Stop High">
          <a-input-number
            v-decorator="[
              'stopHigh',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input a stop high value',
                  },
                ],
              },
            ]"
            :min="0"
            :step="10"
          />
        </a-form-item>
      </a-col>
      <a-col :span="13">
        <a-form-item label="Token">
          <a-select
            v-decorator="[
              'tokenHigh',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please select a token',
                  },
                ],
              },
            ]"
            placeholder="Select a wallet"
          >
            <a-select-option
              v-for="token in tokens"
              :key="token.value"
              :value="token.value"
            >
              {{ token.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item label="Slippage">
      <a-input-number
        v-decorator="[
          'slippage',
          {
            rules: [
              {
                required: true,
                message: 'Please input a slippage value',
              },
            ],
          },
        ]"
        :min="0"
        :max="100"
        :step="1"
        :formatter="(value) => `${value}%`"
        :parser="(value) => value.replace('%', '')"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="loading">
        Submit
      </a-button>
      <a-button
        style="margin-left: 8px"
        :disabled="loading"
        :loading="loading"
        @click="resetForm"
      >
        Reset
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { Form, Select, InputNumber, Button } from 'ant-design-vue'

export default {
  name: 'NuxtEditLiquidity',
  components: {
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-input-number': InputNumber,
    'a-select': Select,
    'a-button': Button,
  },
  props: {
    onSubmit: {
      type: Function,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      layout: 'vertical',
      placeholder: 'Select a token',
      tokens: [],
      price: 0,
    }
  },

  watch: {
    formData: {
      handler: function (val, oldVal) {
        if (val && val.token0 && oldVal !== val) {
          this.tokens = [
            {
              label: val.token0.symbol,
              value: val.token0.id.toUpperCase(),
            },
            {
              label: val.token1.symbol,
              value: val.token1.id.toUpperCase(),
            },
          ]
          this.form.setFieldsValue({
            tokenLow: val.tokenLow?.address.toUpperCase(),
            tokenHigh: val.tokenHigh?.address.toUpperCase(),
            stopLow: val.stopLow,
            stopHigh: val.stopHigh,
            slippage: val.slippage,
            depositedToken0: val.depositedToken0,
            depositedToken1: val.depositedToken1,
          })

          this.price = val.currentPrice;
        }
        if (!val || !val.tokenLow || !val.tokenHigh) {
          this.form.resetFields()
        }

        return val
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    this.tokens = [
      {
        label: this.formData?.token0.symbol,
        value: this.formData?.token0.id.toUpperCase(),
      },
      {
        label: this.formData?.token1.symbol,
        value: this.formData?.token1.id.toUpperCase(),
      },
    ]

    this.form.setFieldsValue({
      tokenLow: this.formData?.tokenLow?.address.toUpperCase(),
      tokenHigh: this.formData?.tokenHigh?.address.toUpperCase(),
      stopLow: this.formData?.stopLow,
      stopHigh: this.formData?.stopHigh,
      slippage: this.formData?.slippage,
      depositedToken0: this.formData?.depositedToken0,
      depositedToken1: this.formData?.depositedToken1,
    })

    this.price = this.formData?.currentPrice;

  },

  unmounted() {
    this.resetForm()
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.onSubmit({
            ...values,
            id: this.formData.id,
            wallet: this.formData.wallet,
          })
          this.loading = false
        }
      })
    },
    resetForm() {
      this.form.resetFields()
    },
  },
}
</script>
