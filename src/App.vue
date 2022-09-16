<template>
  <main>
    <grid />
  </main>
</template>

<script>
import Grid from "@/components/Grid";

export default {
  name: "App",
  components: {
    Grid,
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  font-family: "Barlow", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}

main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

body {
  margin: 0;
  height: 100vh;
}

:root {
  --layout-border: #9c6644;
  --cell-layout: #ddb892;
}
</style>
