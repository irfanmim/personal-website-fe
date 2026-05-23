<template>
  <section class="about-contact" v-reveal>
    <div class="left">
      <h3 class="section-title">About</h3>
      <p class="bio">{{ bio }}</p>
    </div>
    <div class="contact">
      <p class="tagline">Have a role in mind? Let's connect.</p>
      <div class="links">
        <a :href="linkedin" target="_blank" rel="noopener" class="link">LinkedIn</a>
        <a :href="github" target="_blank" rel="noopener" class="link">GitHub</a>
        <a v-if="instagram" :href="instagram" target="_blank" rel="noopener" class="link">Instagram</a>
      </div>
      <a v-if="cvUrl" :href="cvUrl" download class="cv-btn">Download CV</a>
      <p class="footer-note">© {{ year }}</p>
    </div>
  </section>
</template>

<script setup>
const year = new Date().getFullYear()

defineProps({
  bio: { type: String, required: true },
  linkedin: { type: String, required: true },
  github: { type: String, required: true },
  instagram: { type: String, default: '' },
  cvUrl: { type: String, default: '' },
})
</script>

<style scoped>
.about-contact {
  border-top: 1px solid var(--color-border);
  padding: 48px 0 60px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.bio {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  max-width: 100%;
}

@media (min-width: 768px) {
  .bio {
    max-width: 62.5%;
  }
}

.contact {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tagline {
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.link {
  font-size: 0.95rem;
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid var(--color-text);
  padding-bottom: 1px;
  transition: opacity 0.15s;
}

.link:hover {
  opacity: 0.5;
}

.cv-btn {
  display: inline-block;
  background: var(--color-text);
  color: var(--color-bg);
  font-size: 0.875rem;
  padding: 10px 24px;
  border-radius: 6px;
  text-decoration: none;
  align-self: flex-start;
  transition: opacity 0.15s;
}

.cv-btn:hover {
  opacity: 0.75;
}

.footer-note {
  font-size: 0.8rem;
  color: var(--color-text-footer);
}

@media (min-width: 768px) {
  .section-title {
    font-size: 1.4rem;
  }
}
</style>
