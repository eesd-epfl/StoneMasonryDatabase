
//Take active, filtered data from table and create an array with the name and filepath of each csv file to display 
export function createCSVArray(data){
    let divName = [];
    let activePlotData = data;
    let selectedCurvesFilePaths = [];

    for (let i = 0; i<activePlotData.length; i++){
        if(activePlotData[i]['ID']>99){
            selectedCurvesFilePaths.push("data/curve"+activePlotData[i]['ID'] + ".csv");
        } else if (activePlotData[i]['ID']>9){
            selectedCurvesFilePaths.push("data/curve0"+ activePlotData[i]['ID']+ ".csv");
        } else{
            selectedCurvesFilePaths.push("data/curve00"+ activePlotData[i]['ID'] + ".csv"); 
        }
    }
    for (let i = 0; i<selectedCurvesFilePaths.length; i++){
        divName.push(selectedCurvesFilePaths[i].split('/')[1].split('.')[0]);
    }
    const csvData = [selectedCurvesFilePaths,divName];
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