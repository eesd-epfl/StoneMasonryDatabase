<template>
  <div>
    <div>
      <!-- ______________________Checkbox____________________-->
      <v-container fluid>
        <p>{{ typo }}</p>
        <v-checkbox
          v-model="typo"
          label="Typology A"
          value="A"
          v-on:click="searchCheck('A')"
        ></v-checkbox>
        <v-checkbox v-model="typo" label="Typology B" value="B"></v-checkbox>
        <v-checkbox
          v-model="selected"
          label="Typology C"
          value="C"
        ></v-checkbox>
        <v-checkbox
          v-model="selected"
          label="Typology D"
          value="D"
        ></v-checkbox>
        <v-checkbox
          v-model="selected"
          label="Typology E"
          value="E"
        ></v-checkbox>
      </v-container>
    </div>

    <!-- ______________________Checkbox____________________-->
    <div class="w-50">
      <v-subheader>Size</v-subheader>
      <v-slider
        v-model="size"
        :color="ex1.color"
        :label="ex1.label"
        :max="ex1.max"
        :min="ex1.min"
        thumb-label="always"
      ></v-slider>
      <v-subheader>strength</v-subheader>
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

    <!-- ______________________DataTable____________________-->
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="tests"
      :items-per-page="5"
      :search="search"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>

<script>
import json from "./data.json";

export default {
  created: {},

  data: () => ({
    name: "MyTable",
    myJson: json,
    selected: [],
    search: "",
    stateSearch: false,
    typo: "",
    size: 1000,

    //Sliders
    ex1: {
      label: "",
      val: 0,
      color: "orange darken-3",
      max: 3000,
      min: 1000,
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

    //Table
    tests: [
      {
        ID: 1,
        Reference: "Vasconcelos and Lourenço (2009)",
        TestUnit: "WS1.100",
        Cyclic: "Cyclic",
        Lab: "Laboratory",
        StoneM: "E1",
        Joints: "Stone",
        Stone: "Granite",
        HMM: 1200,
        LMM: 1000,
        tmm: 200,
        H0: 1.104166667,
        tot: 0.007178082,
      },
      {
        ID: 2,
        Reference: "Vasconcelos and Lourenço (2009)",
        TestUnit: "WS2.100",
        Cyclic: "Cyclic",
        Lab: "Laboratory",
        StoneM: "E1",
        Joints: "Dry",
        Stone: "Granite",
        HMM: 2200,
        LMM: 1000,
        tmm: 300,
        H0: 1.104166667,
        tot: 0.007178082,
      },

      {
        ID: 24,
        Reference: "Vasconcelos and Lourenço (2009)",
        TestUnit: "WR3.250",
        Cyclic: "Cyclic",
        Lab: "Laboratory",
        StoneM: "C",
        Joints: "Hydraulic lime mortar",
        Stone: "Granite",
        HMM: 1200,
        LMM: 1000,
        tmm: 200,
        H0: 1.104166667,
        tot: 0.2548,
      },

      {
        ID: 25,
        Reference: "Silva et al. (2014)",
        TestUnit: "C1",
        Cyclic: "Cyclic",
        Lab: "Laboratory",
        StoneM: "B",
        Joints: "Hydraulic lime mortar",
        Stone: "Limestone",
        HMM: 1200,
        LMM: 1000,
        tmm: 500,
        H0: 1.125,
        tot: 0.41124498,
      },
    ],
  }),

  computed: {
    headers() {
      return [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "ID",
        },
        { text: "Test Unit", value: "TestUnit" },
        { text: "Cyclic / Monotonic", value: "Cyclic" },
        { text: "Lab / In-situ", value: "Lab" },
        {
          text: "Stone masonry typology",
          value: "StoneM",
          filter: (f) => {
            if (this["typo"] != null) {
              console.log("COMPUTED");
              return (f + "")
                .toLowerCase()
                .includes(this["typo"].toLowerCase());
            } else {
              console.log("COMPUTED-ELSE");
              return true;
            }
          },
        },
        { text: "Joints", value: "Joints" },
        { text: "Stone masonry typology", value: "Stone" },
        //Filtre Size
        {
          text: "H [mm]",
          value: "HMM",
          /*filter: (value) => {
            if (!this.size === 0) return true;
            return value < parseInt(this.calories);
          },*/
        },

        { text: "L [mm]", value: "LMM" },
        { text: "t [mm]", value: "tmm" },
        { text: "σ0,tot /fc", value: "tot" },
      ];
    },
  },

  methods: {
    searchCheck(value) {
      console.log(this.typo);
      this.stateSearch = !this.stateSearch;
      if (this.stateSearch) {
        this.search = value;
      } else {
        this.search = "";
      }
    },
  },
};
</script>
