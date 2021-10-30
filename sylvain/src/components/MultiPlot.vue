<template>
    <body></body>
  <!-- <div id="gridplots"></div> -->
</template>

<script>
// import * as d3 from "d3";
import * as c3 from "c3";
import Papa from "papaparse";

export default {
    name:"MultiPlot"
}

var gridplots = document.getElementById('gridplots');
console.log(gridplots);
function iterateCSVs(){
    let divName = [];
    const directory = ''
    const fileNames = [directory +'curve001.csv',directory +'curve002.csv',directory +'curve003.csv',directory +'curve004.csv',
    directory +'curve005.csv',directory +'curve006.csv',directory +'curve007.csv',directory +'curve008.csv',directory +'curve009.csv'];
    console.log(fileNames);
for (var i = 0; i<fileNames.length; i++){
        divName.push(fileNames[i].split('.')[0])
    }
    const csvData = [fileNames,divName]
    return csvData
}

function parseData(createGraph,file,divName){
    Papa.parse(file, {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(results){
            createGraph(results.data,divName);
        }
    });
}

function createGraph(data,divName){
    var force = [];
    var displacement = [];
    for (var i = 2; i < data.length; i++){
        if((data[i][0]!='NaN' && data[i][1]!='NaN') && data[i][0]!='[mm]'){
            displacement.push(data[i][0]); //x axis
            force.push(data[i][1]); //y axis
        }
    }
    var chart = c3.generate({
        bindto: '#'+divName,
        data:{
            x:displacement[0],
            columns:[force,displacement],
            type: 'scatter',
        },
        axis:{
            y:{
                label:'top displacement',
                
            },
            x:{
                label:'horizontal force'
            }
        }
    })
    var newDiv = document.createElement('div');
    newDiv.id = divName;
    newDiv.append(chart.element);
    gridplots.append(newDiv);
    // console.log("gridplots element is : " + newDiv.id)
    
}

function createSubPlots(){
    const fileNames = iterateCSVs();
    for (var i = 0; i<fileNames[0].length; i++){
        parseData(createGraph, fileNames[0][i],fileNames[1][i]);
        }
}
createSubPlots();
</script>
/*
<style>
#gridplots div {
    /* width:60%; */
    /* height:60%; */
    display: inline-block;
    /* float:left; */
    height: fit-content;
    width: 300px;

}
</style>
*/