<script setup lang="ts">
// Docs 404, matching the app's error pages: the SittingInTheHearth backdrop
// dimmed under a black scrim, a hearth-gold code, a shelf-cream heading, and
// calm copy. "Go back" uses history; "Go home" returns to the docs root.
function goBack() {
  if (typeof window !== 'undefined') window.history.back()
}
</script>

<template>
  <div class="hs-404">
    <div class="hs-404-bg" />
    <div class="hs-404-scrim" />
    <div class="hs-404-inner">
      <p class="hs-404-code">404</p>
      <div class="hs-404-text">
        <h1 class="hs-404-title">Page not found</h1>
        <p class="hs-404-body">
          This shelf is empty. The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div class="hs-404-actions">
        <a class="hs-404-btn hs-404-btn-primary" href="/">Go home</a>
        <button class="hs-404-btn hs-404-btn-alt" @click="goBack">Go back</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hs-404 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
}
.hs-404-bg {
  position: absolute;
  inset: 0;
  background-image: url('/SittingInTheHearth.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.hs-404-scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}
.hs-404-inner {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  padding: 0 24px;
}
.hs-404-code {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  color: #bd863f;
}
.hs-404-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hs-404-title {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  border: none;
  padding: 0;
  color: #f0e6d6;
}
.hs-404-body {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 22rem;
  margin: 0;
  line-height: 1.6;
}
.hs-404-actions {
  display: flex;
  gap: 12px;
}
.hs-404-btn {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 9px 18px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.18s ease;
}
.hs-404-btn-primary {
  background: #e0654a;
  color: #fffaf6;
  border: 1px solid #e0654a;
}
.hs-404-btn-primary:hover {
  background: #c8553c;
  border-color: #c8553c;
}
.hs-404-btn-alt {
  background: rgba(255, 255, 255, 0.08);
  color: #f0e6d6;
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-family: inherit;
}
.hs-404-btn-alt:hover {
  border-color: #e0654a;
  color: #e0654a;
}
</style>
