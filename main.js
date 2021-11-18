// import config.js, and all the individual js files 

// Look at how to build a main.js

// Run all functions in main.js

import {config} from '/javascript/config.js';
import {dataTable} from '/javascript/data_table.js';

function makeDataTable(){
    dataTable(config.inputFilePath ,config.excelColumns, 1);
    tooltip();
}

function tooltip(){
    let tooltipText = document.getElementById("info-tooltip-text");
    let tooltip = document.getElementById("info-tooltip");
    tooltip.onmouseover = function(){
        tooltipText.style.visibility = "visible";
    }
    tooltip.onmouseout = function(){
        tooltipText.style.visibility = "hidden";
    }

}
makeDataTable();
