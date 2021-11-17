<template>
  <div>
    <v-subheader>Size</v-subheader>
    <v-slider
      v-model="ex1.val"
      :color="ex1.color"
      :label="ex1.label"
      :max="ex1.max"
      :min="ex1.min"
      thumb-label="always"
    ></v-slider>
    <v-subheader>strenght</v-subheader>
    <v-slider
      v-model="ex2.val"
      :color="ex2.color"
      :label="ex2.label"
      :max="ex2.max"
      :min="ex2.min"
      thumb-label="always"
    ></v-slider>
    <v-subheader>stiffness</v-subheader>
    <v-slider
      v-model="ex3.val"
      :color="ex3.color"
      :label="ex3.label"
      :max="ex3.max"
      :min="ex3.min"
      thumb-label="always"
    ></v-slider>
  </div>
</template>

<script>
export default {
  name: "MySlider",

  data: () => ({
    ex1: {
      label: "",
      val: 0,
      color: "orange darken-3",
      max: 9,
      min: 2,
    },

    ex2: {
      label: "",
      val: 0,
      color: "orange darken-3",
      max: 9,
      min: 2,
    },

    ex3: {
      label: "",
      val: 0,
      color: "orange darken-3",
      max: 9,
      min: 2,
    },
  }),
};
</script>
