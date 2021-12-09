import { CSVNamesArray } from "./dataExtraction.js";
import { popUp } from "./browseDBPopUp.js";
import { clearBox, curveDisplayButtonEvents } from "./browseDBWidgets.js";
import { config } from "./config.js";

let gridplots = document.getElementById('gridplots');

// Get all the rows from table and make empty divs for each. Afterwards, run the pagination function to add the graphs.
export function generatePlots(data){
    // Clear all contents of the divs:
    clearBox(gridplots);

    // Create array with filepaths and filenames:
    const fileNames = CSVNamesArray(data);

    // Create empty divs that will be paginated (hide all except 9):
    for (let i = 0; i<fileNames[0].length; i++){
        let newDiv = document.createElement('div');
        newDiv.id = fileNames[1][i];
        newDiv.className = "five wide column";
        gridplots.append(newDiv);
    }

    // Use JQuery function from pagination.js to paginate all the divs and plot the 9 visible.
    $("#gridplots").pagify(9, ".five.wide.column");
    
}

// Create the FD Graph:
export function createGraph(data,divId,uniqueId,increment){
    let testUnitName;
    const table = Tabulator.findTable('#data-table3')[0];
    const tableData = table.getData('active');
    const reducedData = reduceDataSet(data);

    // If the div ID comes from the pop up window, the name will contain "fdCurve" or "lhCurve". 
    // If it comes from the main window, it will contain the testUnitName_AuthorYear
    if(divId.includes('fdCurve')){
        testUnitName = data[0][1];
        createFDGraph(reducedData,tableData,testUnitName,divId,uniqueId,increment);
    }else{
        testUnitName = divId.split('_')[0];
        createFDGraph(reducedData,tableData,testUnitName,divId,uniqueId,increment);
    }
}

// Load History Plot:
export function createLoadHistoryGraph(data) {
    const title = data[0][1];;
    let xData = ['index'];
    for (let i = 0; i< data.length; i++){
        xData.push(i+1);
    }
    let yData = ['drift'];

    for (let i = 4; i < data.length-3; i++){
        if((data[i][2]!='NaN' && data[i][1]!='NaN') && data[i][2]!='[%]'){
            yData.push(data[i][2]);
        }
    }    

    let chart = c3.generate({
        data:{
            names: {
                x: 'index'
            },
            xs: {
                'drift':'index',
            },
            columns:[xData,yData],
            types: {
                'drift':'line',
            }
        },
        point: {
            show:false,
        },
        title:{
            text:title,
            position:"top-center",
        },
        legend: {
            hide:true
        },
        axis:{
            y:{
                padding:{
                },
                label:'drift [%]',
                tick: {
                    format: function(x) {return x.toFixed(1)},
                    fit:true,
                    culling:{
                        max:8
                    },
                    count:8,
                },
            },
            x:{
                min:0,
                padding:{
                    left:0,
                    right:20
                },
                label: 'index',
                tick:{
                    format:function (x) {return Math.ceil((Math.round(x/10))*10).toFixed()},
                    culling:{
                        max:16
                    },
                    centered:true,
                    // fit:true,
                    count:10,
                },
            },
        },
    });
    document.getElementById("lhCurve").append(chart.element);
}

// Create the FD Graph:
function createFDGraph(reducedData,tableData, testUnitName, fileId,uniqueId, increment) {
    let tableRowData;
    if(fileId == "fdCurve"){
        tableRowData = tableData.filter(row => row['Name'] === testUnitName);
    } else {
        tableRowData = tableData.filter(row => row['Name'].replaceAll('.','').replaceAll('-','').replaceAll(' ','').replaceAll('#','').replaceAll('_','').replaceAll('+','') === testUnitName);
    }
    // Change NaN values to 0 to remove errors:
    for (const item in tableRowData[0]){
        if (tableRowData[0][item] == "NaN"){
            tableRowData[0][item] = 0
        }
    }
    const bilinDrift = ['bilinDrift',(0-tableRowData[0]['du,- [%]']),(0-tableRowData[0]['dy,- [%]']),'0',tableRowData[0]['dy,+ [%]'], tableRowData[0]['du,+ [%]']];
    const bilinForce = ['bilinForce',(0-tableRowData[0]['Vu,- [kN]']),(0-tableRowData[0]['Vu,- [kN]']), '0', tableRowData[0]['Vu,+ [kN]'],tableRowData[0]['Vu,+ [kN]']];
    
    let force = ["force"];
    let drift = ["drift"];
    let title = reducedData[0][1];
    reducedData[2][2] = 'drift [%]'
    reducedData[2][1] = 'hor. force [kN]'
    for (let i = 4; i < reducedData.length-3; i++){
        if((reducedData[i][2]!='NaN' && reducedData[i][1]!='NaN' && reducedData[i][2]!='#VALUE!' && reducedData[i][1]!='#VALUE!') && reducedData[i][2]!='[%]'){
            drift.push(reducedData[i][2]); //x axis
            force.push(reducedData[i][1]); //y axis
        }
    }
    const ticks = getMaxAndMins(force,drift);
    const intYTickValue = Math.round((Math.ceil(Math.abs(ticks.maxY)/2))/10)*10
    const intXTickValue =Math.round((Math.ceil(Math.abs(ticks.maxX)/2))/10)*10
    let chart = c3.generate({
        bindTo: "#"+fileId,
        transition: {
        },
        padding: {
            left: 25,
            right: 30
        },
        data:{
            names: {
                x: 'horizontal force'
            },
            xs: {
                'force':'drift',
                'bilinForce':'bilinDrift',
                'envForce':'envDrift'
            },
            columns:[drift,force,bilinDrift,bilinForce],
            types:{
                'force':'spline',
                'bilinForce':'line',
                'envForce':'line'
            },
            xSort: false,
            colors:{
                'force': config.fdColor,
                'envForce':config.envColor,
                'bilinForce':config.bilinColor,
            }
        },
        point: {
            show: false   
        },
        title:{
            text:title,
            position:"top-center",
        },
        axis:{
            y:{
                label:'hor. force [kN]',
                tick: {
                    fit:true,
                    values:[ticks.minY, 0-intYTickValue, 0, intYTickValue, ticks.maxY]
                },
                culling:{
                    max:4
                },
                count:2,
                min: ticks.minY,
                max: ticks.maxY,
            },
            x:{
                label: 'drift [%]',
                tick:{
                    culling:{
                        max:5
                    },
                    centered:true,
                    fit:true,
                    values:[ticks.minX, 0-intXTickValue, 0, intXTickValue, ticks.maxX]
                },
                min: ticks.minX,
                max: ticks.maxX
            }
        },
        legend: {
            hide:true
        },
        tooltip:{
            format: {
                title: function (x) {return 'drift value: ' + x},
            }
        },
    })
    // Add Envelope Data:
    setTimeout(() => {
        parseEnvelopeData(chart, uniqueId, ticks);
    }, 500);
    
    // Hide the legends again:
    chart.legend.hide()
    //Add Button Event Handling to toggle curves on/off:
    curveDisplayButtonEvents(chart, increment);
    
    // Append Chart element to div:
    document.getElementById(fileId).append(chart.element);

    // Get titles from all plots and add the pop up function to the title names.
    let child = document.getElementById(fileId).getElementsByClassName("c3")[0].children[0].getElementsByClassName("c3-title")[0]
    child.addEventListener("click", (e) => {
        popUp(e,tableRowData,1);
    })
}

// Add the envelope data to the FD Graph:
function parseEnvelopeData(chart,uniqueId, ticks){
    const filePath = config.envelopesFolderPath + "envelope_"+uniqueId + ".csv"
    Papa.parse(filePath, {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(result){
            // Format the data from csv file to append to chart:
            const xs = {'envForce':'envDrift'};
            let envDrift = ['envDrift'];
            let envForce = ['envForce'];
            for (let i = 4; i < result.data.length; i++){
                if((result.data[i][2]!='NaN' && result.data[i][1]!='NaN' && result.data[i][2]!='#VALUE!' && result.data[i][1]!='#VALUE!' ) && result.data[i][2]!='[%]'){
                    envDrift.push(result.data[i][2]); //x axis
                    envForce.push(result.data[i][1]); //y axis
                }
            }
            const columns = [envDrift,envForce];
            const intTickValue = Math.ceil(Math.abs(ticks.maxY)/2)
            chart.load({
                    xs:xs, 
                    columns: columns,
                    axis: {
                        y:{
                            tick: {
                                count:5,
                                fit:true,
                                values:[ticks.minY, 0-intTickValue,0,intTickValue,ticks.maxY]
                            },
                            culling:{
                                max:4
                            },
                            min:ticks.minY,
                            max: ticks.maxY
                        },
                        x: {
                            tick:{
                                format:function (x) {
                                    return x.toFixed()
                                },
                                culling:{
                                    max:2
                                },
                                centered:true,
                                fit:true,
                                count:4,
                                values:[ticks.minX,0,ticks.maxX]
                            },
                            min:ticks.minX,
                            max:ticks.maxX
                        }
                    }
            })
            chart.legend.hide();
        },
    });
}

// Reduces the number of points to plot:
function reduceDataSet(data){
    let reducedData = data.slice(0,3);
    let remainingRows = data.slice(3,data.length);
    const totalPoints = data.length;
    const nbPointsToKeep = 500;
    const ratio = Math.ceil(totalPoints/nbPointsToKeep);

    // Reduce the number of points to plot according to total # of points in csv file:
    for (let i= 0; i < totalPoints; i += ratio ) {
        reducedData.push(remainingRows[i]);
    }
    return reducedData;
}

// Function that returns an object with the max and min of the X and Y axis.
function getMaxAndMins(force,drift){
        // Getting min and max X values for ticks:
        let maxX = Math.max(...drift.slice(1));
        let minX = Math.min(...drift.slice(1));
    
        let maxXTickValue = 0;
        let minXTickValue = 0;
        
        if(Math.abs(minX)>maxX){
            maxXTickValue = Math.ceil(Math.abs(minX));
            minXTickValue = 0 - Math.ceil(Math.abs(minX));
            
        }else {
            maxXTickValue = Math.ceil(maxX);
            minXTickValue = 0 - Math.ceil(maxX);
        }
    
        // Getting min and max Y values for ticks:
        let maxY = Math.max(...force.slice(1));
        let minY = Math.min(...force.slice(1));
        
        let maxYTickValue = 0;
        let minYTickValue = 0;
    
        if(Math.abs(minY)>maxY){
            maxYTickValue = Math.round((Math.ceil(Math.abs(minY)))/10)*10;
            minYTickValue = 0 - Math.round((Math.ceil(Math.abs(minY))/10))*10;
            
        }else {
            maxYTickValue = Math.round((Math.ceil(maxY))/10)*10;
            minYTickValue = 0 - Math.round((Math.ceil(maxY))/10)*10;
        }
        let maxMinTicks = {
            minX: minXTickValue,
            maxX: maxXTickValue,
            minY: minYTickValue,
            maxY: maxYTickValue
        }
        return maxMinTicks;
}