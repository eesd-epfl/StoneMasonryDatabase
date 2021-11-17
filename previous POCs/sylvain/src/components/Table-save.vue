<template>
  <div>
    <div>
      <v-container fluid>
        <p>{{ selected }}</p>
        <v-checkbox
          v-on:click="searchCheck('A')"
          v-model="selected"
          label="Typology A"
          value="A"
        ></v-checkbox>
        <v-checkbox
          v-on:click="searchCheck('Dry')"
          v-model="selected"
          label="Typology B"
          value="B"
        ></v-checkbox>
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
  //   created: {
  //     convertxlsToJSON() {
  //       this.parseExcel = function (file) {
  //         var reader = new FileReader();

  //         reader.onload = function (e) {
  //           var data = e.target.result;
  //           var workbook = XLSX.read(data, {
  //             type: "binary",
  //           });

  //           workbook.SheetNames.forEach(function (sheetName) {
  //             // Here is your object
  //             var XL_row_object = XLSX.utils.sheet_to_row_object_array(
  //               workbook.Sheets["Sheet1"]
  //             );
  //             var json_object = JSON.stringify(XL_row_object);
  //             console.log(json_object);
  //           });
  //         };

  //         reader.onerror = function (ex) {
  //           console.log(ex);
  //         };

  //         reader.readAsBinaryString(file);
  //       };
  //     },

  data: () => ({
    name: "MyTable",
    myJson: json,
    selected: [],
    search: "",
    stateSearch: false,

    // headers: [
    //   {
    //     text: "Super hero squad",
    //     align: "start",
    //     sortable: false,
    //     value: "ID",
    //   },
    //   { text: "Age", value: "age" },
    //   { text: "Secret Identity", value: "secretIdentity" },
    //   { text: "Powers", value: "powers" },
    // ],

    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "ID",
      },
      { text: "Test Unit", value: "TestUnit" },
      { text: "Cyclic / Monotonic", value: "Cyclic" },
      { text: "Lab / In-situ", value: "Lab" },
      { text: "Stone masonry typology", value: "StoneM" },
      { text: "Joints", value: "Joints" },
      { text: "Stone masonry typology", value: "Stone" },
      { text: "H [mm]", value: "HMM" },
      { text: "L [mm]", value: "LMM" },
      { text: "t [mm]", value: "tmm" },
      { text: "σ0,tot /fc", value: "tot" },
    ],

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
        HMM: 1200,
        LMM: 1000,
        tmm: 200,
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

    // members: [
    //   {
    //     name: "Molecule Man",
    //     age: 29,
    //     secretIdentity: "Dan Jukes",
    //     powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
    //   },
    //   {
    //     name: "Madame Uppercut",
    //     age: 39,
    //     secretIdentity: "Jane Wilson",
    //     powers: [
    //       "Million tonne punch",
    //       "Damage resistance",
    //       "Superhuman reflexes",
    //     ],
    //   },
    //   {
    //     name: "Eternal Flame",
    //     age: 1000000,
    //     secretIdentity: "Unknown",
    //     powers: [
    //       "Immortality",
    //       "Heat Immunity",
    //       "Inferno",
    //       "Teleportation",
    //       "Interdimensional travel",
    //     ],
    //   },
    // ],
  }),

  methods: {
    searchCheck(value) {
      this.stateSearch = !this.stateSearch;
      if (this.stateSearch) {
        this.search = value;
      } else {
        this.search = "";
      }
      console.log("SearchB = ", this.search);

      console.log("SearchAfter = ", this.search);
    },
    // convertxlsToJSON() {
    //   this.parseExcel = function (".\data.xslx") {
    //     var reader = new FileReader();
    //     reader.onload = function (e) {
    //       var data = e.target.result;
    //       var workbook = XLSX.read(data, {
    //         type: "binary",
    //       });
    //       workbook.SheetNames.forEach(function (sheetName) {
    //         // Here is your object
    //         var XL_row_object = XLSX.utils.sheet_to_row_object_array(
    //           workbook.Sheets[sheetName]
    //         );
    //         var json_object = JSON.stringify(XL_row_object);
    //         console.log(json_object);
    //       });
    //     };
    //     reader.onerror = function (ex) {
    //       console.log(ex);
    //     };
    //     reader.readAsBinaryString(file);
    //   };
  },
};
</script>
