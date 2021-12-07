import { createLoadHistoryGraph } from './browseDBGraphs.js';
import {config} from './config.js'

//Take active, filtered data from table and create an array with the name and filepath of each csv file to display 
export function CSVNamesArray(data){
    let fileNames = [];
    let FDfilePaths = [];

    for (let i = 0; i<data.length; i++){
        let FDFileName = "FD_"+getUniqueIdFromData(data[i])[0]+".csv";
        let FDFilePath = config.curvesFolderPath + FDFileName;
        FDfilePaths.push(FDFilePath);
        fileNames.push(getUniqueIdFromData(data[i])[0]);
    }
    const csvData = [FDfilePaths,fileNames];
    return csvData;
}

//Read CSV file and send data to createGraph function:
export function parseData(createGraph,filePath,fileName,uniqueId,excelRefData){
    Papa.parse(filePath, {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(results){
            createGraph(results.data,fileName,uniqueId,excelRefData);
        },
        error:function(){
            let errorDiv = document.createElement("div");
            errorDiv.id = "no-data";
            errorDiv.innerHTML = fileName.split('_')[0] + "<br>No Data to display";
            document.getElementById(fileName).append(errorDiv);
        }
    });
}

// Gets the data from the table/Excel and returns the uniqueId and testUnitName in array [uniqueId,testUnitName]
export function getUniqueIdFromData(data){
    const testUnitName = data['Name'].replaceAll(".","").replaceAll("-","").replaceAll("#","").replaceAll(" ","");
    const reference = data['Reference'].split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const year = data['Reference'].split(' ').at(-1).replace("(","").replace(")","");
    const uniqueId = testUnitName+"_"+reference+year;
    const fileInfo = [uniqueId, testUnitName];
    return fileInfo;
}

// Gets data and sends it to createLoadHistoryGraph fct
export function getLoadHistoryData (filePath) {
    Papa.parse(filePath, {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(results){
            createLoadHistoryGraph(results.data);
        },
    });
}

// Pop up window Excel Reference Data:
export function popUpGetExcelRefData(fileRoot, rowData){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", fileRoot+config.inputFilePath, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        let file = this.response;
        let reader = new FileReader();
        // For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                // Process Excel data:
                let rawData = processExcel(e.target.result);
                const excelRefData = rawData[1];
                fillRefDivs(rowData,excelRefData);
            }
            reader.readAsBinaryString(file);
        }
    }
    xhr.send();
}

// Fills in the Reference divs with its reference data:
export function fillRefDivs(rowData,excelRefData){
    let ref1 = document.getElementById("ref1");
    let ref2 = document.getElementById("ref2");
    for (let i = 0; i< excelRefData.length; i++){
        if(excelRefData[i]['Number'] == rowData[0]['Reference nb']){
            ref1.innerHTML = excelRefData[i]['Reference 1'];
            if(excelRefData[i]['Reference 2'] != undefined){
                ref2.innerHTML = excelRefData[i]['Reference 2'];
            }else {
                ref2.innerHTML = "";
            }
        }
    }

}
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
    let filteredData = intObject.map(function(row){
        let newRow = {}
        for (let i = 0; i< config.excelColumns.length; i++){
            newRow[config.excelColumns[i]]= row[config.excelColumns[i]];
        }
        return newRow;
    });
    const returnData = [filteredData, referenceData];
    return returnData;
};
