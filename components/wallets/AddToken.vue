<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item label="Token">
      <a-select
        v-decorator="[
          'token',
          {
            rules: [{ required: true, message: 'Please select a token!' }],
          },
        ]"
        :options="tokens"
        placeholder="Select a token"
        @change="handleOnChage"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit"> Submit </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { Form, Select } from 'ant-design-vue'

export default {
  name: 'NuxtAddToken',
  components: {
    'a-form': Form,
    'a-select': Select,
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
      form: this.$form.createForm(this),
      loading: false,
      tokens: [],
    }
  },

  watch: {
    formData: {
      handler: function (val, oldVal) {
        if (val && oldVal && val.token !== oldVal.token) {
          this.form.setFieldsValue(val)
        }
        if (!val || !val.token) {
          this.form.resetFields()
        }

        return val
      },
      deep: true,
      immediate: true,
    },
  },

  created() {
    this.form.setFieldsValue(this.formData)
    this.fetchTokens()
  },

  unmounted() {
    this.form.resetFields()
  },

  methods: {
    handleOnChage(e) {
      this.form.setFieldsValue({ token: e })
    },

    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.onSubmit(values)
        }
      })
    },

    fetchTokens() {
      this.$axios
        .get('/api/tokens')
        .then((response) => {
          this.tokens = (response.data || []).map((token) => ({
            label: token.name,
            value: token._id,
          }))

        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
