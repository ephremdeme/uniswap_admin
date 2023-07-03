<template>
  <a-form :form="form" :layout="layout" @submit="handleSubmit">
    <a-row>
      <a-col :span="10">
        <a-form-item label="Token 0 Amount">
          <a-input-number
            v-decorator="[
              'token0Amount',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input an amount',
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
        <a-form-item label="Token 1 Amount">
          <a-input-number
            v-decorator="[
              'token1Amount',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input an amount',
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
              'token0',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please select a token0',
                  },
                ],
              },
            ]"
            placeholder="Select a Token 0"
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
        <a-form-item label="Token1">
          <a-select
            v-decorator="[
              'token1',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please select a token',
                  },
                ],
              },
            ]"
            placeholder="Select a Token 1"
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
      </a-col>
      <a-col :span="13">
        <a-form-item label="Fee">
          <a-radio-group
            v-decorator="[
              'fee',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input a slippage value',
                  },
                ],
              },
            ]"
            name="fee"
            :default-value="0.3"
          >
            <a-radio :value="0.05"> 0.05% </a-radio>
            <a-radio :value="0.3"> 0.3% </a-radio>
            <a-radio :value="1"> 1% </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>

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
import { Form, Select, InputNumber, Button, Radio } from 'ant-design-vue'

export default {
  name: 'NuxtAddLiquidity',
  components: {
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-input-number': InputNumber,
    'a-select': Select,
    'a-button': Button,
    'a-radio': Radio,
    'a-radio-group': Radio.Group,
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
            token0: val.token0,
            depositedToken1: val.depositedToken1,
          })
        }
        if (val && val.tokens) {
          this.tokens = val?.tokens.map((token) => ({
            label: token.symbol,
            value: token.address.toUpperCase(),
          }))

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
    this.tokens = this.formData?.tokens.map((token) => ({
      label: token.symbol,
      value: token.address.toUpperCase(),
    }))
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
