<template>
  <a-form :form="form" :layout="layout" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="11">
        <a-form-item label="Token 0">
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
          ]" show-search placeholder="Select a Token0" option-filter-prop="children"
            @change="(val) => handleOnChange(val, 'token0')">
            <a-select-option v-for="token in tokens" :key="token.value" :value="token.value">
              {{ token.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item label="Token 1">
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
          ]" show-search option-filter-prop="children" placeholder="Select a Token1"
            @change="(val) => handleOnChange(val, 'token1')">
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
            @change="(ev) => handleOnChange(ev, 'slippage')" />
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
          ]" name="fee" style="width: 100%; display: flex; flex-wrap: wrap;"
            @change="(ev) => handleOnChange(ev.target.value, 'fee')">
            <a-radio :value="100"> 0.01% </a-radio>
            <a-radio :value="500"> 0.05% </a-radio>
            <a-radio :value="3000"> 0.3% </a-radio>
            <a-radio :value="10000"> 1% </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
    <!-- display price using a simple div or p -->
    <div v-if="!isNaN(price || poolInfo?.price)">Price: {{ price }}</div>

  <a-radio-group v-model="formValues.active" :disabled="!(poolInfo && poolInfo.fee)" @change="handleOnChange($event.target.value, 'active')">

    <a-row :gutter="16">
      <a-col :span="11">
        <a-radio value="lowPriceRadio">Low Price</a-radio>
        <a-form-item>
          <a-input-number
v-decorator="[
            'lowPrice',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input a low price',
                },
                {
                  validator: (rule, value, callback) => {
                    if (value > price) {
                      callback('Low Price must be less than price')
                    }
                    callback()
                  },
                }
              ],
            },
          ]" :min="0" style="width: 100%" placeholder="Low Price" :disabled="!(poolInfo && poolInfo.fee) || activeValue === 'lowPriceRadio'"
            @change="(ev) => handleOnChange(ev, 'lowPrice')" @blur="handleOnFocusChange('lowPrice')" />
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-radio value="highPriceRadio">High Price</a-radio>
        <a-form-item>
          <a-input-number
v-decorator="[
            'highPrice',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input a High Price value',
                },
                {
                  validator: (rule, value, callback) => {
                    if (value < price) {
                      callback('High Price must be greater than price')
                    }
                    callback()
                  },
                }
              ],
            },
          ]" :min="0" style="width: 100%" placeholder="High Price" :disabled="!(poolInfo && poolInfo.fee) || activeValue === 'highPriceRadio'"
            @change="(ev) => handleOnChange(ev, 'highPrice')" @blur="handleOnFocusChange('highPrice')" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="11">
        <a-radio value="token0AmountRadio">Token 0 Amount</a-radio>
        <a-form-item>
          <a-input-number
v-decorator="[
            'token0Amount',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input an amount',
                },
                {
                  validator: (rule, value, callback) => {
                    if (value > token0Balance) {
                      callback('Insufficient balance')
                    }
                    callback()
                  },
                }
              ],
            },
          ]" placeholder="Token0 Amount" :min="0" :step="10" :disabled="!(poolInfo && poolInfo.fee) || activeValue === 'token0AmountRadio'"
            style="width: 100%" @change="(ev) => handleOnChange(ev, 'token0Amount')" />
          <!-- display balance here like uniswap liquidity add page using helper text -->
          <p v-if="token0">Balance: {{ token0Balance }}</p>
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-radio value="token1AmountRadio">Token 1 Amount</a-radio>
        <a-form-item>
          <a-input-number
v-decorator="[
            'token1Amount',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input an amount',
                },
                {
                  validator: (rule, value, callback) => {
                    if (value > token1Balance) {
                      callback('Insufficient balance')
                    }
                    callback()
                  },
                }
              ],
            },
          ]" :min="0" :step="10" :disabled="!(poolInfo && poolInfo.fee) || activeValue === 'token1AmountRadio'"
          style="width: 100%" placeholder="Token1 Amount" @change="(ev) => handleOnChange(ev, 'token1Amount')" @blur="calculateToken1Amount()"/>
          <p v-if="token1">Balance: {{ token1Balance }}</p>
        </a-form-item>
      </a-col>
    </a-row>
  </a-radio-group>

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
                {
                  validator: (rule, value, callback) => {
                    if (value > price) {
                      callback('Stop Low must be less than price')
                    }
                    callback()
                  },
                }
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
                {
                  validator: (rule, value, callback) => {
                    if (value < price) {
                      callback('Stop High must be greater than price')
                    }
                    callback()
                  },
                }
              ],
            },
          ]" :min="0" style="width: 100%" placeholder="Stop High" :disabled="!(poolInfo && poolInfo.tick)"
            @change="(ev) => handleOnChange(ev, 'stopHigh')" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="loading" :disabled="!(!isNaN(token0Amount) && token1Amount)">
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
import { getPositionTokensDepositRatio, calculatePl, calculatePu, calculateNearestPrice } from '../../utils/math'

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
      default: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
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
        lowPrice: null,
        highPrice: null,
        active: 'token1AmountRadio'
      },
      poolInfo: null,
    }
  },

  computed: {
    depositRatio() {
      if (!this.poolInfo || !this.poolInfo.token0 || isNaN(this.formValues.highPrice) || this.formValues.highPrice < this.price || isNaN(this.formValues.lowPrice) || this.formValues.lowPrice > this.price || this.lowPrice === null || this.highPrice === null) return NaN;

      const ratio = getPositionTokensDepositRatio(this.price, this.formValues.lowPrice, this.formValues.highPrice)
      return ratio
    },
    price() {
      if (!this.poolInfo || !this.poolInfo.price) return NaN;

      return +this.poolInfo.price
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
    lowPrice() {
      return this.formValues.lowPrice
    },
    highPrice() {
      return this.formValues.highPrice
    },
    token0Amount() {
      return this.formValues.token0Amount || 0;
    },
    token1Amount() {
      return this.formValues.token1Amount || 0;
    },
    token0Balance() {
      if (!this.formValues.token0 || !this.tokens.length) return 0;

      const token = this.tokens.find((token) => token.value === this.formValues.token0)
      return token.balance
    },
    token1Balance() {
      if (!this.formValues.token1 || !this.tokens.length) return 0;

      const token = this.tokens.find((token) => token.value === this.formValues.token1)
      return token.balance
    },
    fee() {
      return this.formValues.fee
    },
    activeValue() {
      return this.formValues.active
    },
  },

  watch: {
    formData: {
      handler: function (val, oldVal) {
        if (val && val.tokens && val.tokens !== this.tokens) {
          this.tokens = val?.tokens.map((token) => ({
            label: token.symbol,
            value: token.address.toUpperCase(),
            balance: token.balance,
            decimals: token.decimals,
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
    visible: {
      handler: function (val, oldVal) {
        if (!val)
          this.resetForm();
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
      balance: token.balance,
      decimals: token.decimals,
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
          this.onSubmit({
            ...values,
            id: this.formData.id,
            wallet: this.formData.wallet,
          })
        }
      })
    },

    handlePriceChange(value) {
      if(!value || isNaN(value)) return 0;
      const token = this.tokens.find((token) => token.value === this.formValues.token0)
      const token1 = this.tokens.find((token) => token.value === this.formValues.token1)
      if (!token || !token1) return 0;
      const price = calculateNearestPrice(value, this.poolInfo, 
      token.decimals === this.poolInfo.token0.decimals && this.poolInfo.tick > 0 ? token.decimals: token1.decimals,
      token1.decimals === this.poolInfo.token1.decimals && this.poolInfo.tick > 0 ? token1.decimals: token.decimals);

      return +price.toFixed(4)
    },

    calculateLowPrice() {
      if (this.formValues.highPrice && this.formValues.highPrice >= this.price && this.formValues.token0Amount && this.formValues.token1Amount) {
        let lowPrice = +calculatePl(this.price, this.formValues.highPrice, this.formValues.token0Amount, this.formValues.token1Amount).toFixed(4);
        lowPrice = this.handlePriceChange(lowPrice);
          this.formValues.lowPrice = lowPrice
          this.form.setFieldsValue({
            lowPrice,
          });
      }
      return 0
    },

    calculateHighPrice() {
      if (this.formValues.lowPrice && this.formValues.lowPrice <= this.price && this.formValues.token0Amount && this.formValues.token1Amount) {
        let highPrice = +calculatePu(this.price, this.formValues.lowPrice, this.formValues.token0Amount, this.formValues.token1Amount).toFixed(4);
        highPrice = this.handlePriceChange(highPrice);
          this.formValues.highPrice = highPrice
          this.form.setFieldsValue({
            highPrice,
          });
      }
      return 0
    },

    calculateToken1Amount() {
      if (this.depositRatio && Number.isFinite(this.depositRatio)) {
        this.formValues.token1Amount = +(this.token0Amount * this.depositRatio)
        this.form.setFieldsValue({
          token1Amount: +(this.token0Amount * this.depositRatio).toFixed(4),
        })
      }
      return 0
    },

    calculateToken0Amount() {
      if (this.depositRatio && Number.isFinite(this.depositRatio)) {
        this.formValues.token0Amount = +(this.token1Amount / this.depositRatio)
        this.form.setFieldsValue({
          token0Amount: +(this.token1Amount / this.depositRatio).toFixed(4),
        })
      }
      return 0
    },

    checkActive(value) {
      if ((this.activeValue  || value)=== 'lowPriceRadio') {
        this.calculateLowPrice()
      }
      if ((this.activeValue  || value)=== 'highPriceRadio') {
        this.calculateHighPrice()
      }
      if ((this.activeValue  || value)=== 'token0AmountRadio') {
        this.calculateToken0Amount()
      }
      if ((this.activeValue  || value)=== 'token1AmountRadio') {
        this.calculateToken1Amount()
      }
    },

    handleOnChange(value, name) {
      this.form.setFieldsValue({
        [name]: value,
      })
      this.formValues[name] = value

      if (name === 'token0') {
        if (value === this.form.getFieldValue('token1')) {
          this.formValues.token1 = null
          this.form.setFieldsValue({
            token1: null,
          })
          return;
        }
      }

      if (name === 'token1') {
        if (value === this.form.getFieldValue('token0')) {
          this.formValues.token0 = null
          this.form.setFieldsValue({
            token0: null,
          })
          return;
        }
      }

      if (name === 'active')
        this.checkActive(value)

      if (name === 'highPrice' || name === 'lowPrice' || name === 'token0Amount' || name === 'token1Amount') {
        this.checkActive()
      }

      if (name === 'fee' || name === 'token0' || name === 'token1') {
        if (
          this.token0 && this.token1 &&
          this.fee && this.token0 !== this.token1
        ) {
          this.$emit('fetch-pool-info', {
            token0: this.token0,
            token1: this.token1,
            fee: this.fee,
          })
        }
      }
    },

    handleOnFocusChange(name) {
      if(name === 'lowPrice' && this.formValues.lowPrice) {
        const lowPrice = this.handlePriceChange(this.formValues.lowPrice);
        this.handleOnChange(lowPrice, 'lowPrice')
      }
      if(name === 'highPrice' && this.formValues.highPrice) {
        const highPrice = this.handlePriceChange(this.formValues.highPrice);
        this.handleOnChange(highPrice, 'highPrice')
      }
    },

    resetForm() {
      this.form.resetFields();
      this.formValues = {
        token0: null,
        token1: null,
        token0Amount: 0,
        token1Amount: 0,
        fee: 3000,
        stopLow: 0,
        stopHigh: 0,
        lowPrice: 0,
        highPrice: 0,
        active: 'token1AmountRadio'
      }
      this.poolInfo = null;
    },
  },
}
</script>
