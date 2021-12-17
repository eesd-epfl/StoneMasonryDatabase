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
        if(tableColumns[i].visible == true && tableColumns[i].field != 'Comment' && tableColumns[i].field !='Name' && tableColumns[i].field != 'Reference'){
            headersToKeep.push(tableColumns[i].field)
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
    const headerStringObject = (dim,name,type,data) =>{
        return {
            dim,
            name,
            type,
            data
        }
    };
    let parallelAxisArray = [];
    for (let i = 0; i<headers.length; i++){
        if(headers[i] == 'H0/H'){
            // ECharts doesn't accept HTML subscript. Use unicode char for 0 instead:
            parallelAxisArray.push(headerObject(i,'H'+String.fromCharCode(0x2080) +'/H'));
        } else if (headers[i] == 'σ0,tot /fc'){
            // No unicode for subscript letters ", t" so just simplify the column name:
            parallelAxisArray.push(headerObject(i,'σ/f'));
        }else if(headers[i] == 'Cyclic'){
            parallelAxisArray.push(headerStringObject(i,headers[i],'category',['Cyclic','Monotonic']));

        }else if (headers[i] == 'Lab'){
            parallelAxisArray.push(headerStringObject(i,headers[i],'category',['Laboratory','In-situ']));

        }else if (headers[i] == 'Typ'){
            parallelAxisArray.push(headerStringObject(i,headers[i],'category',['A','B','C','D','E','E1']));
        }else if (headers[i] == 'Mortar'){
            parallelAxisArray.push(headerStringObject(i,headers[i],'category',['Air lime mortar','Cement mortar','Clay mortar','Dry','Hydraulic lime mortar']));

        }
        else {
            parallelAxisArray.push(headerObject(i,headers[i]));
        }
    }
    return parallelAxisArray;
}