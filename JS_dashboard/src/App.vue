<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <vue-c3 :handler="handler"></vue-c3>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import axios from 'axios'
import Papa from 'papaparse'
// import c3 from 'c3'
import Vue from 'vue'
import VueC3 from 'vue-c3'

export default {
  name: 'App',
  components: {
    HelloWorld,
    VueC3
  },
  data: () => ({
    handler: new Vue(),
  }),
  methods:{
    getCSVData(){
      let url = 'curve001.csv';
      Papa.parse(url,{
        download: true,
        header: false,
        complete: (results) => {
          console.log(results)
          this.csvData = results.data
          }
      })
    }
  },
  created(){
      Papa.parse('curve001.csv',{
        download: true,
        header: false,
        complete: (results) => {
          var myJson = JSON.stringify(results.data)
          console.log("Papa parse results are: " + results.data[0][0])
          console.log(typeof myJson)
          const options = {
            data: myJson
            }
          this.handler.$emit('init', options)
          }
      })
    },
  mounted(){
    // this.handler.$emit('init', this.options)
  }
}
</script>

      /*
      onReady('#chart2', function() {
          var chart = c3.generate({
        data: {
            url: 'curve001.csv',
            type: 'scatter'
        },
        axis: {
            y: {
            padding: {
                bottom: 0
            },  
            min: 0
            },
            x: {
            padding: {
                left: 0
            },
            min: 0,
            show: false
            }

      }
    });
          console.log(chart);
  });

  // Set a timeout so that we can ensure that the `chart` element is created.
  function onReady(selector, callback) {
      var intervalID = window.setInterval(function() {
          if (document.querySelector(selector) !== undefined) {
              window.clearInterval(intervalID);
              callback.call(this);
            }
        }, 500);
    }

  let btn_upload = document.getElementById('btn-csv').addEventListener('click',()=>{
      console.log('Button clicked')
      Papa.parse(data, {
          header: false,
          complete: function(results){
              console.log(results)
            }
        });
})*/

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
