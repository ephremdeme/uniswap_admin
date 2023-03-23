<template>
  <a-form :form="form" :layout="layout" @submit="handleSubmit">
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
    <a-form-item label="Token">
      <a-select
        v-decorator="[
          'token',
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
    }
  },

  watch: {
    formData: {
      handler: function (val, oldVal) {
        if (val && val.token0 && oldVal && val._id !== oldVal._id) {
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
            token: val.token?.address.toUpperCase(),
            stopLow: val.stopLow,
            stopHigh: val.stopHigh,
            slippage: val.slippage,
          })
        }
        if (!val || !val.token) {
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
      token: this.formData?.token.address.toUpperCase(),
      stopLow: this.formData?.stopLow,
      stopHigh: this.formData?.stopHigh,
      slippage: this.formData?.slippage,
    })
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
