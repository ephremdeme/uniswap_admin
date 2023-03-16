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
        :placeholder="placeholder"
        :options="tokens"
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
    }
  },
  mounted() {
    this.form.setFieldsValue(this.formData)
    this.tokens = [
      {
        label: this.formData.token0.symbol,
        value: this.formData.token0.id,
      },
      {
        label: this.formData.token1.symbol,
        value: this.formData.token1.id,
      },
    ]
  },
  unmounted() {
    this.resetForm()
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log('Values: ', values)
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
