<template>
  <a-layout id="components-layout">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="[activeNavKey]"
      >
        <a-menu-item key="1">
          <NuxtLink to="/wallets">
            <a-icon type="wallet" />
            <span class="nav-text">Wallet</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="2">
          <NuxtLink to="/tokens">
            <a-icon type="euro" />
            <span class="nav-text">Tokens</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="3">
          <NuxtLink to="/liquidity">
            <a-icon type="gold" />
            <span class="nav-text">Liquidity</span>
          </NuxtLink>
        </a-menu-item>
        <a-menu-item key="4">
          <NuxtLink to="/swap">
            <a-icon type="swap" />
            <span class="nav-text">Swap</span>
          </NuxtLink>
        </a-menu-item>

        <!-- Logout -->
        <a-menu-item key="6" @click="onLogout">
          <a-icon type="logout" />
          <span class="nav-text">Logout</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <Nuxt />
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Company Name ©{{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="js">
const NavKeys = {
  WALLETS: "1",
  TOKENS: "2",
  LIQUIDITY: "3",
  SWAP: "4",
  LOGOUT: "6",
};
export default {
  computed: {
    activeNavKey() {
      return NavKeys[this.$route.name.toUpperCase().split('-')[0]];
    },
  },
  methods: {
    onCollapse(collapsed, type) {
    },
    onBreakpoint(broken) {
    },
    onLogout() {
      this.$auth.logout().then(() => {
        this.$router.push("/login");
      })
    },
  }
};
</script>

<style>
#components-layout {
  height: 100vh;
  width: 100%;
}

#components-layout .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
