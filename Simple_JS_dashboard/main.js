// import config.js, and all the individual js files 

// Look at how to build a main.js

// Run all functions in main.js

// import './javascript/config.js';
// import './javascript/data_table.js';
// import './javascript/scatter_plots.js';

import {filterEvents } from './javascript/data_table.js';
import {config} from '/javascript/config.js';
import {dataTable} from '/javascript/data_table.js';

function makeDataTable(){
    dataTable(config.inputFilePath ,config.excelColumns);
    filterEvents();
}
makeDataTable();
