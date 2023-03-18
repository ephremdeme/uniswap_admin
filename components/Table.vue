<template>
  <div class="table">
    <a-button
      v-if="formComponent"
      class="add-btn"
      type="primary"
      @click="showModal"
      >Add</a-button
    >
    <a-table
      :key="'_id'"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ x: 1300 }"
      :row-key="(record) => record._id"
      :loading="loading"
      bordered
    >
      <template slot="editable" slot-scope="text, record">
        <editable-cell
          :text="String(text)"
          @change="onSubmit(record, 'editable', $event)"
        />
      </template>
      <span slot="tags" slot-scope="tag">
        <a-tag :color="'green'">
          {{ tag?.toUpperCase() }}
        </a-tag>
      </span>

      <template slot="action" slot-scope="text, record">
        <a-button v-if="allowEdit" type="primary" @click="onEdit(record)"
          >Edit</a-button
        >
        <a-button v-if="allowDelete" type="danger" @click="onDelete(record)"
          >Delete</a-button
        >
      </template>
    </a-table>
    <a-modal
      :visible="visible"
      :title="title"
      :footer="null"
      @cancel="handleCancel"
    >
      <component
        :is="formComponent"
        :form-data="formData"
        :on-submit="handleSubmit"
      />
    </a-modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'

export default {
  name: 'NuxtTable',
  components: {
    'a-modal': Modal,
    EditableCell: () => import('./EditableCell.vue'),
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    onDelete: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    formComponent: {
      type: Object,
      default: () => {},
    },
    allowEdit: {
      type: Boolean,
      default: true,
    },
    allowDelete: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      title: '',
      confirmLoading: false,
      formData: {},
    }
  },
  methods: {
    showModal() {
      this.title = 'Add'
      this.visible = true
    },
    handleCancel() {
      this.visible = false
      this.formData = {}
    },
    handleSubmit(data) {
      this.confirmLoading = true
      this.visible = false
      this.onSubmit(data)
      this.confirmLoading = false
    },
    onEdit(record) {
      this.title = 'Edit'
      this.visible = true
      this.formData = record
    },
    onAdd() {
      this.title = 'Add'
      this.visible = true
      this.formData = {}
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
