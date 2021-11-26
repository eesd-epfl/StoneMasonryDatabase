import { createTable, filterEvents} from "./browseDBTable.js";
import { generatePlots } from "./browseDBScatterPlots.js";
import { popUp } from "./browseDBPopUp.js";
import { config } from "./config.js";
import { allPlots } from "./overviewDBTab.js";



export function allTabs(tab) {
    // Get data from Excel File:
    let xhr = new XMLHttpRequest();
    xhr.open("GET", config.inputFilePath, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
        let file = this.response;
        let reader = new FileReader();
        // For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                // Process Excel data:
                let rawData = ProcessExcel(e.target.result);
                let data = renameTableHeaders(rawData[0]);

                // Browse DB Tab:
                if(tab === 1){
                    let table = createTable(data);
                    // Create empty divs, display first 9, paginate everything and create and append the first 9 plots to the divs 
                    generatePlots(data);
                    // Add Events to widgets
                    filterEvents();
                    // Add events to row selection (pop up window with extra info)
                    popUp(rawData[1]);

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
                ProcessExcel(data);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    xhr.send();
};


// General function that extracts only required data from Excel File:
function ProcessExcel(data) {
    // Read the Excel File data. 
    let workbook = XLS.read(data, {
        type: 'binary'
    });
    // Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];
    let secondSheet = workbook.SheetNames[1];

    // Read all rows from First and Second Sheet into JSON arrays.
    let excelFirstSheetObject = XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    console.log(excelFirstSheetObject);
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