<template>
  <div class="index">
    <Table
      :columns="columns"
      :data="data"
      :on-submit="onSubmit"
      :on-delete="onDelete"
      :form-component="AddToken"
    />
  </div>
</template>

<script>
import AddToken from '../components/tokens/AddToken.vue'

export default {
  name: 'IndexPage',
  // get data from /api/tokes
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/tokens')
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
      // this.$router.push(`/tokens/${record.id}`)
      if (record._id) {
        this.$axios
          .put(`/api/tokens/${record._id}`, record)
          .then(() => {
            this.$message.success('Update success')
            this.$nuxt.refresh()
          })
          .catch((err) => {
            this.$message.error(err || 'Update failed. Check token address.')
          })
      } else {
        this.$axios
          .post('/api/tokens', record)
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
        .delete(`/api/tokens/${record._id}`)
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
