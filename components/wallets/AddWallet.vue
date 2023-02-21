<template>
  <div class="add-wallet">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="Wallet Name">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: 'Please input wallet name!' }],
            },
          ]"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { Form } from 'ant-design-vue'

export default {
  name: 'NuxtAddWallet',
  components: {
    'a-form': Form,
  },
  props: {
    onSubmit: {
      type: Function,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // populate form with data

      form: this.$form.createForm(this),
      loading: false,
    }
  },

  // check if form data has changed and populate form
  watch: {
    formData: {
      handler: function (val, oldVal) {
        if (val && oldVal && val.name !== oldVal.name) {
          this.form.setFieldsValue(val)
        }
        if (!val || !val.name) {
          this.form.resetFields()
        }

        return val
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    this.form.setFieldsValue(this.formData)
  },

  unmounted() {
    this.form.resetFields()
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.onSubmit({ ...this.formData, ...values })
        }
      })

      this.loading = false
      this.resetForm()
    },

    resetForm() {
      this.form.resetFields()
    },
  },
}
</script>

<style scoped>
.add-wallet {
  width: 100%;
}
</style>
