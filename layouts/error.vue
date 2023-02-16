<template>
  <!-- 
    Generate a custom error page using antdv components
   -->
    <a-layout-content :style="{ margin: '24px 16px 0' }">
      <div :style="{ padding: '24px', minHeight: '360px' }">
        <div class="container">
          <h1 v-if="error.statusCode === 404">Page not found</h1>
          <h1 v-else>An error occurred</h1>
          <NuxtLink to="/">Home page</NuxtLink>
        </div>
      </div>
    </a-layout-content>

</template>

<script lang="js">
export default {
  props: ['error'],
}
</script>
