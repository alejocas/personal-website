<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SalaryCalc from './components/tools/SalaryCalc.vue'
</script>

<template>
  <header>
    <h1>¡Bienvenido/a/e a la página de Alejo!</h1>
  </header>
  <nav>
    <RouterLink to="/calculadora-salarial">Calculadora salarial</RouterLink>
  </nav>
  <main>
    <!-- <RouterView /> -->
    <SalaryCalc />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
