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
            <h3>Wallet Address</h3>
            <p>{{ data.address }}</p>
            </div>
        </div>
        <h3>Tokens</h3>
        <Table
          :columns="columns"
          :data="tokens"
          :pagination="false"
          :allow-edit="false"
          :allow-delete="false"
          :on-submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>

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
          width: 100,
        },
        {
          title: 'Symbol',
          dataIndex: 'symbol',
          key: 'symbol',
          width: 40,
          scopedSlots: { customRender: 'tags' },
        },
        {
          title: 'Balance',
          dataIndex: 'balance',
          key: 'balance',
          width: 60,
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
          width: 100,
        },
      ],
    }
  },
  methods: {
    onSubmit() {
      console.log('submit')
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
