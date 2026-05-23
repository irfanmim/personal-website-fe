<template>
  <section class="about">
    <h3 class="section-title">About</h3>
    <p class="bio" v-reveal>{{ bio }}</p>
  </section>
</template>

<script setup>
defineProps({
  bio: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.about {
  padding-bottom: 48px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.bio {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  max-width: 680px;
}

@media (min-width: 1024px) {
  .about {
    padding-bottom: 60px;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 32px;
  }
}
</style>
