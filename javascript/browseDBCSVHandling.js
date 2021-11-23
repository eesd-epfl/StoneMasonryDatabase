import {config} from './config.js'

//Take active, filtered data from table and create an array with the name and filepath of each csv file to display 
export function createCSVArray(data){
    let fileNames = [];
    let FDfilePaths = [];

    for (let i = 0; i<data.length; i++){
        let FDFileName = "FD_"+makeFileName(data[i])+".csv";
        let FDFilePath = config.curvesFolderPath + FDFileName;
        FDfilePaths.push(FDFilePath);
        fileNames.push(makeFileName(data[i]));
    }
    const csvData = [FDfilePaths,fileNames];
    return csvData;
}

//Read CSV file and send data to createGraph function:
export function parseData(createGraph,filePath,fileName){
    Papa.parse(filePath, {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(results){
            createGraph(results.data,fileName);
        },
        error:function(){
            let errorMessage = "No Data to display";
            let errorDiv = document.createElement("div");
            errorDiv.id = "no-data";
            errorDiv.innerHTML = errorMessage;
            document.getElementById(fileName).append(errorDiv);
        }
    });
}

function makeFileName(data){
    const testUnitName = data['Name'].replaceAll(".","").replaceAll("-","").replaceAll("#","").replaceAll(" ","");
    const reference = data['Reference'].split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const year = data['Reference'].split(' ').at(-1).replace("(","").replace(")","");
    const curveName = testUnitName+"_"+reference+year;
    return curveName;
}