<template>
  <a-layout>
    <a-layout-content :style="{ margin: '24px 16px 0' }">
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Company Name ©{{ new Date().getFullYear() }}
    </a-layout-footer>
  </a-layout>
</template>
