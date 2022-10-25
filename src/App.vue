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
  font-family: "Barlow", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}

html,
body {
  height: 100%;
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

:root {
  --layout-border: #373a40;
  --layout-cell: #686d76;
}
</style>
