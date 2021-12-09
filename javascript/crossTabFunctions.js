import { createSliders, createTable, filterEvents, searchBar} from "./browseDBWidgets.js";
import { generatePlots } from "./browseDBGraphs.js";
import { popUp } from "./browseDBPopUp.js";
import { config } from "./config.js";
import { allPlots } from "./overviewDBTab.js";
import { processExcel } from "./dataExtraction.js";

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

                    // Create the plots after table is built:
                    table.on("dataLoaded", () => generatePlots(data));
                    
                    // Add the search bar:
                    table.on("dataLoaded", () => searchBar());

                    // Add noUiSliders with table data:
                    table.on("dataLoaded", () => createSliders(data));

                    // Add Events to widgets
                    table.on("dataLoaded", () => filterEvents());

                    // Add events to row selection (pop up window with extra info)
                    table.on("rowClick", function(e,row){
                        popUp(e, row,0);
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
            // alert
            reader.readAsArrayBuffer(file);
        }
    };
    xhr.send();
};

//Changes the data to a JSON object with the headers renamed:
function renameTableHeaders(data){
    let shortenedData = data.map(row => config.sortData(row));
    return shortenedData;
}