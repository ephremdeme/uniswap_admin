<template>
    <SwapComponent
    :wallets="wallets" 
    :tokens="tokens" 
    :loading="loading" 
    :on-submit="handleSubmit" 
    :price="price"
    @fetch-tokens="fetchTokens"  
    @fetch-rate="fetchRate"/>
</template>

<script>
import SwapComponent from '../components/swap/SwapToken.vue'

export default {
    name: 'NuxtSwap',
    components: {
        SwapComponent,
    },
    auth: false,
    layout: 'bot',

    data() {
        return {
            form: this.$form.createForm(this),
            wallets: [],
            tokens: [],
            price: NaN,
            telegramQuery: null,

            layout: 'horizontal',
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            loading: false,
        }
    },

    watch:{
         telegramQuery: {
            handler: function (val, oldVal) {
                if (val && oldVal && val.url !== oldVal.url) {
                    this.telegramQuery = val
                }
            },
        },
    },

    beforeMount() {
        const telegramWebApp = document.createElement('script')
        telegramWebApp.setAttribute(
            'src',
            'https://telegram.org/js/telegram-web-app.js'
        )
        document.head.appendChild(telegramWebApp)
    },

    mounted() {
        this.telegramQuery = this.$route.query
        if (this.telegramQuery) {
            this.fetchWallets()
        }
    },

    methods: {
        handleSubmit(values) {
            this.loading = true
            const origin = new URL(this.telegramQuery.url).origin

            this.$axios
                .post(`${ origin }/${ origin.includes('ephrem') ? 'uniswap' : 'service' }/api/uniswap/swap`, values, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this.telegramQuery.token,
                    },
                })
                .then((res) => {
                    if (res.data === 'Failed' || res === 'Failed')
                        this.$message.error('Swap Failed')
                    else this.$message.success('Swapped Successfully: ' + (res.data || res).transactionHash)
                })
                .catch((err) => {
                    this.$message.error('Swap failed' + err.message)
                })
                .finally(() => {
                    this.loading = false
                })

        },

        fetchRate(token1, token2) {
            if (token1 === token2) return 1;

            if (!token1 || !token2) return NaN;
            const origin = new URL(this.telegramQuery.url).origin

            this.loading = true
            this.$axios
                .$get(
                    `${origin}/${origin.includes('ephrem') ? 'uniswap' : 'service'}/api/uniswap/exchange-rate/${token1}/${token2}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.telegramQuery.token,
                        },
                })
                .then((res) => {
                    this.price = +(res.data || res)
                })
                .catch((err) => {
                    this.$message.error("Can't get price: " + err.message)
                })
                .finally(() => {
                    this.loading = false
                })
        },

        fetchTokens(walletId) {
            this.loading = true
            const origin = new URL(this.telegramQuery.url).origin

            this.$axios
                .$get(`${origin}/${origin.includes('ephrem') ? 'uniswap' : 'service'}/api/accounts/${walletId}/tokens`,{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this.telegramQuery.token,
                    },
                })
                .then((res) => {
                    this.tokens = res
                })
                .catch((err) => {
                    this.$message.error('Error getting tokens: ' + err.message)
                })
                .finally(() => {
                    this.loading = false
                })
        },

        async fetchWallets() {
            if(!this.telegramQuery) return;
            this.loading = true;
            const origin = new URL(this.telegramQuery.url).origin

            const wallets = await this.$axios.$get(`${origin}/${origin.includes('ephrem') ? 'uniswap' : 'service'}/api/accounts`,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.telegramQuery.token,
                },
            }).catch((e) => {
                this.$message.error(e.message)
                return { data: []}
            })

            this.wallets = wallets
            this.loading = false
        },
    }
}
</script>
