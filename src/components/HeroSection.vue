<template>
  <section class="hero">
    <div class="hero-left">
      <h1 class="hero-hi">Hi!</h1>
      <h2 class="hero-welcome">Welcome!</h2>
    </div>
    <div class="hero-right">
      <p class="hero-role">{{ role }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  role: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 0 64px;
}

.hero-hi {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
}

.hero-welcome {
  font-size: 2rem;
  font-weight: 400;
  margin-top: 8px;
}

.hero-role {
  font-size: 1.1rem;
  color: #333;
}

@media (min-width: 640px) {
  .hero {
    padding: 64px 0 80px;
  }

  .hero-hi {
    font-size: 4.5rem;
  }

  .hero-welcome {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
    padding: 80px 0 100px;
  }

  .hero-hi {
    font-size: 5rem;
  }

  .hero-welcome {
    font-size: 3rem;
  }

  .hero-role {
    font-size: 1.2rem;
  }
}
</style>
