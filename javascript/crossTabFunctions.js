import { createSliders, createTable, filterEvents, searchBar} from "./browseDBTable.js";
import { generatePlots } from "./browseDBScatterPlots.js";
import { popUp } from "./browseDBPopUp.js";
import { config } from "./config.js";
import { allPlots } from "./overviewDBTab.js";



export function allTabs(tab, fileRoot) {
    // Get data from Excel File:
    let xhr = new XMLHttpRequest();
    xhr.open("GET", fileRoot+config.inputFilePath, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
        let file = this.response;
        let reader = new FileReader();
        // For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                // Process Excel data:
                let rawData = processExcel(e.target.result);
                const referenceData = rawData[1];
                let data = renameTableHeaders(rawData[0]);

                // Browse DB Tab:
                if(tab === 1){
                    let table = createTable(data);
                    // Create empty divs, display first 9, paginate everything and create and append the first 9 plots to the divs 

                    // Create the plots after table is built:
                    table.on("dataLoaded", () => generatePlots(data,referenceData));

                    table.on("dataLoaded", () => searchBar());
                    // Add noUiSliders with table data:
                    table.on("dataLoaded", () => createSliders(data));
                    // Add Events to widgets
                    table.on("dataLoaded", () => filterEvents(referenceData));
                    // Add events to row selection (pop up window with extra info)
                    table.on("rowClick", function(e,row){
                        popUp(referenceData,e, row,0);
                    })

                // Overview DB Tab:
                }else if(tab === 0){
                    allPlots(rawData[0]);
                }
            };
            reader.readAsBinaryString(file);
        } 
        else {
            //For IE Browser.
            reader.onload = function (e) {
                let data = "";
                let bytes = new Uint8Array(e.target.result);
                for (let i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                processExcel(data);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    xhr.send();
};


// General function that extracts only required data from Excel File:
export function processExcel(data) {
    // Read the Excel File data. 
    let workbook = XLS.read(data, {
        type: 'binary'
    });
    // Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];
    let secondSheet = workbook.SheetNames[1];

    // Read all rows from First and Second Sheet into JSON arrays.
    let excelFirstSheetObject = XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    let referenceData = XLS.utils.sheet_to_row_object_array(workbook.Sheets[secondSheet]);

    
    // Remove empty rows from array:
    let intObject = [];
    for (let i = 0; i<excelFirstSheetObject.length; i++){
        if(excelFirstSheetObject[i].length!=0){
            intObject.push(excelFirstSheetObject[i]);
        }
    };

    // Use config file variable "excelColumns" to get only the columns we want to keep for processing:
    let filtered = intObject.map(function(row){
        let newRow = {}
        for (let i = 0; i< config.excelColumns.length; i++){
            newRow[config.excelColumns[i]]= row[config.excelColumns[i]];
        }
        return newRow;
    });
    const returnData = [filtered, referenceData];
    return returnData;
};

function renameTableHeaders(data){
    let shortenedData = data.map(row => config.sortData(row));
    return shortenedData;
}