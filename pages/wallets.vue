<template>
  <div>
    <h1>Wallets</h1>
    <div class="index">
      <Table
        :columns="columns"
        :data="data"
        :on-submit="onSubmit"
        :on-delete="onDelete"
        :form-component="AddWallet"
      />
    </div>
  </div>
</template>

<script>
import AddWallet from '../components/wallets/AddWallet.vue'

export default {
  name: 'IndexPage',
  // get data from /api/tokes
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/accounts')
    return { data }
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
          title: 'Private Key',
          dataIndex: 'privateKey',
          key: 'privateKey',
          width: 200,
        },
        {
          title: 'Action',
          key: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' },
        },
      ],
      AddWallet,
    }
  },
  methods: {
    onSubmit(record) {
      // this.$router.push(`/accounts/${record.id}`)
      if (record._id) {
        this.$axios
          .put(`/api/accounts/${record._id}`, record)
          .then(() => {
            this.$message.success('Update success')
            this.$nuxt.refresh()
          })
          .catch((err) => {
            this.$message.error(err || 'Update failed. Check token address.')
          })
      } else {
        this.$axios
          .post('/api/accounts', record)
          .then(() => {
            this.$message.success('Create success')
            this.$nuxt.refresh()
          })
          .catch((err) => {
            this.$message.error(err || 'Create failed. Check token address.')
          })
      }
    },
    onDelete(record) {
      this.$axios
        .delete(`/api/accounts/${record._id}`)
        .then(() => {
          this.$message.success('Delete success')
          this.$router.push('/')
          this.$nuxt.refresh()
        })
        .catch((err) => {
          this.$message.error(err || 'Delete failed')
        })
    },
  },
}
</script>
