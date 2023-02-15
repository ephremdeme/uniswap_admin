<template>
  <div class="login">
    <a-form
      ref="form"
      :form="form"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="login-form"
    >
      <a-form-item :label="formLabel.username">
        <a-input
          v-model="form.username"
          placeholder="Please input your username"
        />
      </a-form-item>
      <a-form-item :label="formLabel.password">
        <a-input
          v-model="form.password"
          type="password"
          placeholder="Please input your password"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          class="login-form-button"
          @click="submitForm('form')"
        >
          {{ formLabel.login }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'NuxtLogin',
  data() {
    return {
      formLabel: {
        username: 'Username',
        password: 'Password',
        login: 'Log in',
      },
      form: {
        username: '',
        password: '',
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }
  },
  methods: {
    submitForm(formName) {
      // validate form
    },
  },
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 300px;
}
</style>
