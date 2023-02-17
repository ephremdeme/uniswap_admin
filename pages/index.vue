<template>
  <div class="index">
    <Table
      :columns="columns"
      :data="data"
      :onSubmit="onSubmit"
      :onDelete="onDelete"
    />
  </div>
</template>

<script>
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
    }
  },
  methods: {
    onSubmit(record) {
      // this.$router.push(`/tokens/${record.id}`)
      console.log(record);
    },
    onDelete(record) {
      this.$axios.delete(`/api/tokens/${record._id}`).then(() => {
        this.$message.success('Delete success')
        this.$router.push('/')
      })
    },
    onAdd() {
      this.$router.push('/tokens/new')
    },
  },


}
</script>
