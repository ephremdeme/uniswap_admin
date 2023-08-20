<template>
  <a-form :form="form" :layout="layout" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="11">
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
                initialValue: [],
                valuePropName: 'option',
              },
            ]"
            placeholder="Select a Token0"
            @change="(val) => handleOnSelect(val, 'token0')"
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
      <a-col :span="11">
        <a-form-item label="Token">
          <a-select
            v-decorator="[
              'token1',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please select a token1',
                  },
                ],
                initialValue: [],
                valuePropName: 'option',
              },
            ]"
            placeholder="Select a Token1"
            @change="(val) => handleOnSelect(val, 'token1')"
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

    <a-row :gutter="17">
      <a-col :span="11">
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
                initialValue: 1,
              },
            ]"
            :min="0"
            :max="100"
            :step="1"
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="11">
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
                initialValue: 0.3,
              },
            ]"
            name="fee"
            style="width: 100%; display: flex"
            @change="(ev) => handleOnSelect(ev.target.value, 'fee')"
          >
            <a-radio :value="0.05"> 0.05% </a-radio>
            <a-radio :value="0.3"> 0.3% </a-radio>
            <a-radio :value="1"> 1% </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="11">
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
            placeholder="Token0 Amount"
            :min="0"
            :step="10"
            :disabled="!formData.poolInfo"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="11">
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
            :disabled="!formData.poolInfo"
            style="width: 100%"
            placeholder="Token1 Amount"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="11">
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
            style="width: 100%"
            placeholder="Stop Low"
            :disabled="!formData.poolInfo"
          />
        </a-form-item>
      </a-col>
      <a-col :span="11">
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
            style="width: 100%"
            placeholder="Stop High"
            :disabled="!formData.poolInfo"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="loading" :disabled="!formData.poolInfo">
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
        if (val && val.tokens)
          this.tokens = val?.tokens.map((token) => ({
            label: token.symbol,
            value: token.address.toUpperCase(),
          }))

        if (!val || !val.tokenLow || !val.tokenHigh) this.form.resetFields()
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
    handleOnSelect(value, name) {
      this.form.setFieldsValue({
        [name]: value,
      })

      if(name === 'fee' || name === 'token0' || name === 'token1') {
        if(this.form.getFieldValue('token0') && this.form.getFieldValue('token1') && this.form.getFieldValue('fee')) {
          this.$emit('fetch-pool-info', {
            token0: this.form.getFieldValue('token0'),
            token1: this.form.getFieldValue('token1'),
            fee: this.form.getFieldValue('fee'),
          })
        }
      }

      console.log('Form => ', this.form.getFieldsValue());
    },

    resetForm() {
      this.form.resetFields()
    },
  },
}
</script>
