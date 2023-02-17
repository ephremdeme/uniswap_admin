<!-- Antdv V1.7
Generate a table with a fixed header and a fixed footer.
And the table can be scrolled horizontally and have an edit and delete button.
Accepts a column array and a data array, onEdit, onDelete and onAdd functions.
-->

<template>
  <div class="table">
    <a-button class="add-btn" type="primary" @click="onAdd">Add</a-button>

    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="true"
      :row-key="(record) => record.id"
      bordered
    >
      <template slot="action" slot-scope="text, record">
        <a-button type="primary" @click="onEdit(record)">Edit</a-button>
        <a-popconfirm
          v-if="data.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record)"
        >
          <a-button type="danger">Delete</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <AddToken
      :visible="visible"
      :title="title"
      :data="record"
      :onCancel="onCancel"
      :onOk="onSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'NuxtTable',
  components: {
    AddToken: () => import('~/components/tokens/AddToken.vue'),
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    onDelete: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      title: '',
      record: {},
    }
  },
  methods: {
    onEdit(record) {
      this.visible = true
      this.title = 'Edit Token'
      this.record = record
      this.$emit('edit', record)
    },
    onAdd() {
      this.visible = true
      this.title = 'Add Token'
      this.$emit('add')
    },
    onCancel() {
      this.visible = false
      this.record = {}

      this.$emit('cancel')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.table {
  margin: 20px;
}

.table .ant-table-thead > tr > th {
  background: #fafafa;
}

.table .ant-table-tbody > tr > td {
  background: #fff;
}

.table .ant-table-tbody > tr > td:last-child {
  background: #fafafa;
}
.add-btn {
  margin-bottom: 8px;
}
</style>
