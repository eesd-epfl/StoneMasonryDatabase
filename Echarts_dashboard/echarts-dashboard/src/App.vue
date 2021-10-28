<template>
  <div id="app">
    <div class="square" radius="10">eae</div>
    <SalesPage/>
  </div>
</template>

<script>
import SalesPage from "./components/NewSalesPage";

export default {
  name: "App",
  components: {
    SalesPage
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.square {
  background: #ff0000;
  width: 100px;
  height: 100px;
  border-radius: attr(radius, 0);
}
</style>
