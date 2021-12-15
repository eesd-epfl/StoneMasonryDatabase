import { config } from "../javascript/config.js"
import { clearBox } from "./widgets.js";

export function allPlots(data){
    parCoords(data);
}

export function parCoords(data){
    var chartDom = document.getElementById('main');
    // clearBox(chartDom);
    var myChart = echarts.init(chartDom);
    var option;
    
    // Get an array with only the columns we want to display:
    const headers = filterHeaders();
    let filteredData = [];
    for (let i = 0; i<data.length; i++){
        let row = [];
        for (let j = 0;j<headers.length;j++){
            row.push(data[i][headers[j]]);
        }
        filteredData.push(row);
    }
    // Create the parallelAxis object we need for the chart:
    const parArray = parallelAxis(headers);
    // Put all the information into the option object:
    option = {
        parallelAxis: parArray,
        series: {
            type: 'parallel',
            lineStyle: {
                width:4
            },
            data: filteredData
        },
    }
    option && myChart.setOption(option);
}

function filterHeaders(){
    let headersToKeep = [];
    const tableColumns = config.tableColumns;
    for (let i= 0; i<tableColumns.length; i++){
        if(tableColumns[i].visible == true){
            headersToKeep.push(tableColumns[i].title)
        }
    }
    headersToKeep.push("fc [MPa]")
    return headersToKeep;
}

// Prepare the parallel Axis Object that ECharts needs:
function parallelAxis(headers){

    // Create header property factory function:
    const headerObject = (dim,name) =>{
        return {
            dim,
            name
        }
    };
    let parallelAxisArray = [];
    for (let i = 0; i<headers.length; i++){
        if(headers[i] == 'H<sub>0</sub>/H'){
            // ECharts doesn't accept HTML subscript. Use unicode char for 0 instead:
            parallelAxisArray.push(headerObject(i,'H'+String.fromCharCode(0x2080) +'/H'));

        } else if (headers[i] == 'σ<sub>0,tot</sub> /f<sub>c</sub>'){
            // No unicode for subscript letters ", t" so just simplify the column name:
            parallelAxisArray.push(headerObject(i,'σ/f'));
        }else if(headers[i] == 'Comment') {
            // Ignore the comment Column
        }else {
            parallelAxisArray.push(headerObject(i,headers[i]));
        }
    }
    return parallelAxisArray;
}

// function sizeSlider(data){
//     let sizeData = data.map(item => item['H [mm]']);
//     let minSize = Math.min.apply(null, sizeData),
//         maxSize = Math.max.apply(null, sizeData);
//     let sizeStep = 1
//     let sizeSlider = document.getElementById('overview-size-slider');
//     noUiSlider.create(sizeSlider, {
//         range: {
//             'min':minSize, 
//             'max': maxSize, 
//         },
//         step: sizeStep,
//         start: [minSize,maxSize],
//         tooltips:[true,true],
//         connect:true,
//     });
// }

function checkBoxes(){
    const checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    checkboxes.forEach(function(checkbox){
        checkbox.addEventListener('change',function(){

        });
    });
}