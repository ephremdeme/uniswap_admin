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
              initialValue: undefined,
              valuePropName: 'value',
            },
          ]"     show-search placeholder="Select a Token0"     option-filter-prop="children" @change="(val) => handleOnChange(val, 'token0')">
            <a-select-option v-for="token in tokens" :key="token.value" :value="token.value">
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
              initialValue: undefined,
              valuePropName: 'value',
            },
          ]"     show-search     option-filter-prop="children" placeholder="Select a Token1" @change="(val) => handleOnChange(val, 'token1')">
            <a-select-option v-for="token in tokens" :key="token.value" :value="token.value">
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
          ]" :min="0" :max="100" :step="1" :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')" style="width: 100%" placeholder="Slippage"
            @change="(ev) => handleOnChange(ev.target.value, 'slippage')" />
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
              initialValue: 3000,
            },
          ]" name="fee" style="width: 100%; display: flex" @change="(ev) => handleOnChange(ev.target.value, 'fee')">
            <a-radio :value="500"> 0.05% </a-radio>
            <a-radio :value="3000"> 0.3% </a-radio>
            <a-radio :value="10000"> 1% </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
<!-- display price using a simple div or p -->
    <div v-if="!isNaN(price || poolInfo?.price)">Price: {{ price }}</div>

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
          ]" :min="0" style="width: 100%" placeholder="Stop Low" :disabled="!(poolInfo && poolInfo.tick)"
            @change="(ev) => handleOnChange(ev, 'stopLow')" />
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
          ]" :min="0" style="width: 100%" placeholder="Stop High" :disabled="!(poolInfo && poolInfo.tick)"
            @change="(ev) => handleOnChange(ev, 'stopHigh')" />
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
          ]" placeholder="Token0 Amount" :min="0" :step="10" :disabled="isNaN(depositRatio)" style="width: 100%"
            @change="(ev) => handleOnChange(ev, 'token0Amount')" />
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
          ]" :min="0" :step="10" :disabled="isNaN(depositRatio)" style="width: 100%" placeholder="Token1 Amount"
            @change="(ev) => handleOnChange(ev, 'token1Amount')" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="loading" :disabled="!(!isNaN(token0Amount) && token1Amount )">
        Submit
      </a-button>
      <a-button style="margin-left: 8px" :disabled="loading" :loading="loading" @click="resetForm">
        Reset
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { Form, Select, InputNumber, Button, Radio } from 'ant-design-vue'
import { getPositionTokensDepositRatio } from '../../utils/math'

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
      default: () => { },
    },
    formData: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      layout: 'vertical',
      placeholder: 'Select a token',
      tokens: [],
      formValues: {
        token0: null,
        token1: null,
        token0Amount: null,
        token1Amount: null,
        fee: 3000,
        stopLow: null,
        stopHigh: null,
      },
      poolInfo: null,
    }
  },

  computed: {
    depositRatio() {
      if (!this.poolInfo || !this.poolInfo.token0 || !this.formValues.stopHigh || isNaN(this.formValues.stopLow)) return NaN;

      const ratio = getPositionTokensDepositRatio(this.price, this.formValues.stopLow, this.formValues.stopHigh)
      return ratio
    },
    price() {
      if (!this.poolInfo || !this.poolInfo.price) return NaN;

      return this.poolInfo.price
    },
    token0() {
      return this.formValues.token0
    },
    token1() {
      return this.formValues.token1
    },
    stopLow() {
      return this.formValues.stopLow
    },
    stopHigh() {
      return this.formValues.stopHigh
    },
    token0Amount() {
      return this.formValues.token0Amount || 0;
    },
    token1Amount() {
      return this.formValues.token1Amount || 0;
    },
    fee() {
      return this.formValues.fee
    },
  },

  watch: {
    formData: {
      handler: function (val, oldVal) {
        if (val && val.tokens && val.tokens !== this.tokens) {
          this.tokens = val?.tokens.map((token) => ({
            label: token.symbol,
            value: token.address.toUpperCase(),
          }))
        }
        if (val && val.poolInfo && val.poolInfo !== this.poolInfo) {
          this.poolInfo = val.poolInfo
        }
        return val
      },
      deep: true,
      immediate: true,
    },
    depositRatio: {
      handler: function (val, oldVal) {
        if(val && val !== oldVal) {
          this.formValues.token1Amount = (this.token0Amount || 0) * this.depositRatio
          this.form.setFieldsValue({
            token1Amount: ((this.token0Amount || 0) * this.depositRatio).toFixed(2),
          })
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

    handleOnChange(value, name) {
      console.log('handleOnChange', this.formValues, this.token0, this.token1);
      if (name === 'token0' && value === this.token1 || name === 'token1' && value === this.token0) {
        this.$message.error('Token0 and Token1 must be different', 5)
        this.form.setFieldsValue({
          [name === 'token0' ? 'token1' : 'token0']: undefined,
        })
        this.formValues[name === 'token0' ? 'token1' : 'token0'] = undefined
        this.form.setFieldsValue({
          [name]: value,
        })

        this.formValues[name] = value
        return
      }

      this.form.setFieldsValue({
        [name]: value,
      })

      this.formValues[name] = value

      if (name === 'token0Amount') {
        this.formValues.token1Amount = this.token0Amount * this.depositRatio
        this.form.setFieldsValue({
          token1Amount: (this.token0Amount * this.depositRatio).toFixed(2),
        })
      }

      if (name === 'token1Amount') {
        this.formValues.token0Amount = this.token1Amount / this.depositRatio
        this.form.setFieldsValue({
          token0Amount: (this.token1Amount / this.depositRatio).toFixed(2),
        })
      }

      if (name === 'fee' || name === 'token0' || name === 'token1') {
        if (
          this.token0 &&
          !Array.isArray(this.token0) &&
          this.token1 &&
          !Array.isArray(this.token1) &&
          this.fee
        ) {
          this.$emit('fetch-pool-info', {
            token0: this.token0,
            token1: this.token1,
            fee: this.fee,
          })
        }
      }
    },

    resetForm() {
      this.form.resetFields()
    },
  },
}
</script>
