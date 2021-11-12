// import config.js, and all the individual js files 

// Look at how to build a main.js

// Run all functions in main.js

import { eventHandler } from './javascript/filtering.js';
import {config} from '/javascript/config.js';
import {dataTable} from '/javascript/data_table.js';

function makeDataTable(){
    dataTable(config.inputFilePath ,config.excelColumns);
}
makeDataTable();
