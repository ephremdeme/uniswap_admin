<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div>
        <a-row type="flex" flex justify="space-around" align="middle">
            <a-col :span="9">
                <h1>Swap</h1>

                <div class="filter">
                    <a-form-item label="Wallet: ">
                        <a-select placeholder="Select Wallet" style="width: 100%"
                            @change="(ev) => handleOnChange('selectedWallet', ev)">
                            <a-select-option v-for="wallet in wallets" :key="wallet._id" :value="wallet._id">
                                {{ wallet.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
            </a-col>
        </a-row>

        <a-row type="flex" flex justify="center" align="middle">
            <a-col :span="8">
                <a-form v-if="selectedWallet" :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol"
                    @submit="handleSubmit">
                    <a-form-item label="Token 1">
                        <a-select v-decorator="[
                            'token1',
                            {
                                rules: [
                                    { required: true, message: 'Please select a token!' },
                                ],
                            },
                        ]" placeholder="Select a token" style="width: 100%"
                            @change="(ev) => handleOnChange('token1', ev)">
                            <a-select-option v-for="token in tokens" :key="token._id" :value="token.address">
                                {{ token.name }} - {{ token.balance }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Token 2">
                        <a-select v-decorator="[
                            'token2',
                            {
                                rules: [
                                    { required: true, message: 'Please select a token!' },
                                ],
                            },
                        ]" placeholder="Select a token" style="width: 100%"
                            @change="(ev) => handleOnChange('token2', ev)">
                            <a-select-option v-for="token in tokens" :key="token._id" :value="token.address">
                                {{ token.name }} - {{ token.balance }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <div v-if="!isNaN(price) && token1 && token2">Price: {{ price }} {{ token1?.symbol }}/{{ token2?.symbol
                    }}</div>


                    <a-form-item label="Token 1 Amount">
                        <a-input-number v-decorator="[
                            'token1Amount',
                            {
                                rules: [
                                    { required: true, message: 'Please input token amount!' },
                                ],
                            },
                        ]" :min="0" :max="1000000000" :step="0.01"
                            @change="(ev) => handleOnChange('token1Amount', ev)" />
                    </a-form-item>

                    <div v-if="!isNaN(outputAmount)">Output Amount: {{ outputAmount }} {{ token2?.symbol }}</div>

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
    name: 'SwapComponent',
    components: {
        'a-form': Form,
        'a-select': Select,
        'a-input-number': InputNumber,
    },
    props: {
        wallets: {
            type: Array,
            default: () => [],
        },
        tokens: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        onSubmit: {
            type: Function,
            default: () => {},
        },
        price: {
            type: Number,
            default: NaN,
        },
    },
    data() {
        return {
            form: this.$form.createForm(this),

            formValues: {
                selectedWallet: '',
                token1: '',
                token2: '',
                token1Amount: NaN,

            },
            layout: 'horizontal',
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
        }
    },

    computed: {
        selectedWallet() {
            return this.formValues.selectedWallet
        },

        token1() {
            return this.tokens.find((token) => token.address === this.formValues.token1)
        },
        token2() {
            return this.tokens.find((token) => token.address === this.formValues.token2)
        },

        outputAmount() {
            if (this.formValues.token1Amount && this.price) {
                return +this.formValues.token1Amount * this.price
            }
            return NaN
        },
    },

    watch: {
        selectedWallet: {
            handler: function (val, oldVal) {
                this.form.resetFields()

                if (val && val !== oldVal) {
                   this.$emit('fetch-tokens', val)
                }
            },
            immediate: true,
        },
    },

    mounted() {
        if (this.selectedWallet) {
            this.$emit('fetch-tokens', this.selectedWallet)
        }
    },

    methods: {
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.onSubmit({
                        ...values,
                        wallet: this.selectedWallet,
                    })
                }
            })
        },

        handleOnChange(name, value) {
            this.formValues[name] = value

            if (name === 'token1' || name === 'token2'){
                if(name=== 'token1' && this.formValues.token2 === value){
                    this.formValues.token2 = null;
                    this.form.setFieldsValue({token2: null})
                }
                if(name=== 'token2' && this.formValues.token1 === value) {
                    this.formValues.token1 = null;
                    this.form.setFieldsValue({token1: null})
                }
             if(this.formValues.token1 && this.formValues.token2) 
                this.$emit('fetch-rate', this.formValues.token1, this.formValues.token2)
            }

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
