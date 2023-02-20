<!-- 
    Path: pages/wallets/_id.vue
    Get data from /api/accounts/:id and display it to show the detail of the wallet.

    List all the tokens that the wallet has and display the balance of each token.

    Add a button to add a new token to the wallet by selecting a token from the list of tokens to the api /api/accounts/:id/tokens 
    and display the new token in the list of tokens that the wallet has.

    The form should be a one field form with a dropdown list of tokens that the wallet does not have yet.
 -->

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Wallet Detail</h1>
        <div class="row">
          <div class="col-md-6">
            <h3>Wallet Name</h3>
            <p>{{ data.name }}</p>
          </div>
          <div class="col-md-6">
            <h3>Private Key</h3>
            <p>{{ data.privateKey }}</p>
          </div>
        </div>
        <h3>Tokens</h3>
        <Table
          :columns="columns"
          :data="tokens"
          :pagination="false"
          :form-component="AddToken"
          :allow-edit="false"
          :on-submit="onSubmit"
          :on-delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddToken from '../../components/wallets/AddToken.vue'

export default {
  name: 'WalletDetailPage',
  // get data from /api/accounts/:id
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`/api/accounts/${params.id}`)
    const { data: tokens } = await $axios.get(
      `/api/accounts/${params.id}/tokens`
    )
    return { data, tokens }
  },
  data() {
    return {
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 200,
        },
        {
          title: 'Symbol',
          dataIndex: 'symbol',
          key: 'symbol',
          width: 80,
          scopedSlots: { customRender: 'tags' },
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
          width: 200,
        },
        {
          title: 'Balance',
          dataIndex: 'balance',
          key: 'balance',
          width: 200,
        },
        {
          title: 'Action',
          key: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      AddToken,
    }
  },
  methods: {
    onSubmit(record) {
      // this.$router.push(`/accounts/${record.id}`)
      if (record._id) {
        this.$axios
          .put(`/api/accounts/${this.data._id}/tokens/${record._id}`, record)
          .then(() => {
            this.$message.success('Update success')
            this.$nuxt.refresh()
          })
          .catch(() => {
            this.$message.error('Update failed')
          })
      } else {
        this.$axios
          .post(`/api/accounts/${this.data._id}/tokens`, record)
          .then(() => {
            this.$message.success('Add success')
            this.$nuxt.refresh()
          })
          .catch(() => {
            this.$message.error('Add failed')
          })
      }
    },
    onDelete(record) {
      this.$axios
        .delete(`/api/accounts/${this.data._id}/tokens/${record._id}`)
        .then(() => {
          this.$message.success('Delete success')
          this.$nuxt.refresh()
        })
        .catch(() => {
          this.$message.error('Delete failed')
        })
    },
  },
}
</script>

<style>
.container {
  padding: 20px;
}

.row {
  margin-bottom: 20px;
}

.col-md-12 {
  margin-bottom: 20px;
}

.col-md-6 {
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 20px;
}

p {
  margin-bottom: 20px;
}
</style>
