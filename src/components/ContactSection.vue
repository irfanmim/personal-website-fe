<template>
  <footer class="contact">
    <h3 class="section-title">Contact</h3>
    <p class="tagline">Have a role in mind? Let's connect.</p>
    <div class="links">
<a :href="linkedin" target="_blank" rel="noopener" class="link">LinkedIn</a>
      <a :href="github" target="_blank" rel="noopener" class="link">GitHub</a>
    </div>
    <a v-if="cvUrl" :href="cvUrl" download class="cv-btn">Download CV</a>
    <p class="footer-note">© {{ year }}</p>
  </footer>
</template>

<script setup>
const year = '2025'

defineProps({
linkedin: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  cvUrl: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.contact {
  border-top: 1px solid #e5e7eb;
  padding: 64px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  
}

.tagline {
  font-size: 0.95rem;
  color: #555;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.link {
  font-size: 0.95rem;
  color: #1a1a1a;
  text-decoration: none;
  border-bottom: 1px solid #1a1a1a;
  padding-bottom: 1px;
  transition: opacity 0.15s;
}

.link:hover {
  opacity: 0.5;
}

.cv-btn {
  display: inline-block;
  align-self: flex-start;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.875rem;
  padding: 10px 24px;
  border-radius: 6px;
  text-decoration: none;
  transition: opacity 0.15s;
}

.cv-btn:hover {
  opacity: 0.75;
}

.footer-note {
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 12px;
}

@media (min-width: 1024px) {
  .contact {
    padding: 80px 0 60px;
  }

  .section-title {
    font-size: 1.4rem;
  }
}
</style>
