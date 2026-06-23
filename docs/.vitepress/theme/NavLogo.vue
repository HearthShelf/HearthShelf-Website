<script setup lang="ts">
// The HearthShelf lockup for the docs nav: the flame mark (FlameLogo-Transparent,
// the finalized gold flame asset, with a soft glow) + the two-tone Libre
// Baskerville wordmark ("Hearth" regular gold, "Shelf" bold cream). Mirrors the
// home page nav exactly.
</script>

<template>
  <a class="nav-logo" href="/">
    <img class="nav-flame" src="/flame.png" alt="" />
    <span class="nav-wordmark"><span class="lt">Hearth</span><span class="bd">Shelf</span></span>
  </a>
</template>

<style scoped>
.nav-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
}
.nav-flame {
  width: 23px;
  height: 23px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(189, 134, 63, 0.5));
}
.nav-wordmark {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 19px;
  line-height: 1;
}
.nav-wordmark .lt { font-weight: 400; color: #bd863f; }
.nav-wordmark .bd { font-weight: 700; color: #f0e6d6; }
</style>
