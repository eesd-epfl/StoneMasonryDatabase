import { CSVNamesArray, parseData, parseEnvelopeData } from "./browseDBCSVHandling.js";
import { popUp } from "./browseDBPopUp.js";
import { clearBox } from "./browseDBTable.js";
import { config } from "./config.js";

let gridplots = document.getElementById('gridplots');

//Final function.
export function generatePlots(data,excelRefData){
    clearBox(gridplots);
    //Create array with filepaths and filenames:
    const fileNames = CSVNamesArray(data);

    //Create empty divs that will be paginated (hide all except 9):
    for (let i = 0; i<fileNames[0].length; i++){
        let newDiv = document.createElement('div');
        newDiv.id = fileNames[1][i];
        newDiv.className = "five wide column"
        gridplots.append(newDiv);
    }
    $("#gridplots").pagify(9, ".five.wide.column",excelRefData);
}

//Create the plot:
export function createGraph(data,divId,uniqueId,excelRefData){
    let testUnitName;
    const table = Tabulator.findTable('#data-table3')[0];
    const tableData = table.getData('active');
    const reducedData = reduceDataSet(data);
    // If the div ID comes from the pop up window, the name will contain "fdCurve" or "lhCurve". 
    // If it comes from the main window, it will contain the testUnitName_AuthorYear
    if(divId.includes('fdCurve')){
        testUnitName = data[0][1].replaceAll('.','').replaceAll('-','').replaceAll(' ','');
        createFDGraph(reducedData,tableData,testUnitName,divId,uniqueId,excelRefData);
    }else{
        testUnitName = divId.split('_')[0];
        createFDGraph(reducedData,tableData,testUnitName,divId,uniqueId,excelRefData);
    }
}

function curveDisplayButtonEvents(chart){
   let cButtons = document.querySelectorAll("button[name=curveButton]")   
   cButtons.forEach(button => {
       button.addEventListener("click",() => {
           let style = getComputedStyle(button);
           // FD Curve (blue)
           if(style['background-color'] == "rgb(31, 119, 180)"){
                chart.toggle('force')

            // Envelope Curve (green)
           }else if(style['background-color'] == "rgb(44, 160, 44)"){
               chart.toggle('envForce')

            // Bilinearisation Curve (orange)
           }else {
               chart.toggle('bilinForce')
           }
       });
   });
}

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
        // padding: {
        //     left: 25,
        //     right: 30
        // },
        data:{
            names: {
                x: 'index'
            },
            xs: {
                'drift':'index',
            },
            columns:[xData,yData],
            type: 'spline',
            // xSort: false
        },
        point: {
            // show: false   
        },
        title:{
            text:title,
            position:"top-center",
        },
        axis:{
            y:{
                padding:{
                    // top:0,
                    // bottom:10
                },
                label:'drift [%]',
                tick: {
                    fit:true,
                },
                culling:{
                    max:4
                },
                count:4,
                // min:minYTickValue,
                // max:maxYTickValue,
            },
            x:{
                label: 'index',
                tick:{
                    format:function (x) {return x.toFixed()},
                    culling:{
                        max:4
                    },
                    centered:true,
                    fit:true,
                    count:4,
                //     values:[minXTickValue,0,maxXTickValue]
                },
                // min:minXTickValue,
                // max:maxXTickValue
            }
        },
    });
    document.getElementById("lhCurve").append(chart.element);
}

function createFDGraph(reducedData,tableData, testUnitName, fileId,uniqueId,excelRefData) {
    const tableRowData = tableData.filter(row => row['Name'].replaceAll('.','').replaceAll('-','').replaceAll(' ','').replaceAll('#','') === testUnitName);
    const bilinDrift = ['bilinDrift',(0-tableRowData[0]['du,- [%]']),(0-tableRowData[0]['dy,- [%]']),'0',tableRowData[0]['dy,+ [%]'], tableRowData[0]['du,+ [%]']];
    const bilinForce = ['bilinForce',(0-tableRowData[0]['Vu,- [kN]']),(0-tableRowData[0]['Vu,- [kN]']), '0', tableRowData[0]['Vu,+ [kN]'],tableRowData[0]['Vu,+ [kN]']];
    
    let force = ["force"];
    let drift = ["drift"];
    let title = reducedData[0][1];
    reducedData[2][2] = 'drift [%]'
    reducedData[2][1] = 'hor. force [kN]'
    for (let i = 4; i < reducedData.length-3; i++){
        if((reducedData[i][2]!='NaN' && reducedData[i][1]!='NaN') && reducedData[i][2]!='[%]'){
            drift.push(reducedData[i][2]); //x axis
            force.push(reducedData[i][1]); //y axis
        }
    }

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
        maxYTickValue = Math.ceil(Math.abs(minY));
        minYTickValue = 0 - Math.ceil(Math.abs(minY));
        
    }else {
        maxYTickValue = Math.ceil(maxY);
        minYTickValue = 0 - Math.ceil(maxY);
    }
    let chart = c3.generate({
        transition: {
            duration:500
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
            type: 'spline',
            xSort: false
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
                padding:{
                    // top:0,
                    // bottom:10
                },
                label:'hor. force [kN]',
                tick: {
                    fit:true,
                },
                culling:{
                    max:4
                },
                count:4,
                min:minYTickValue,
                max:maxYTickValue,
            },
            x:{
                label: 'drift [%]',
                tick:{
                    format:function (x) {return x.toFixed()},
                    culling:{
                        max:2
                    },
                    centered:true,
                    fit:true,
                    count:4,
                    values:[minXTickValue,0,maxXTickValue]
                },
                min:minXTickValue,
                max:maxXTickValue
            }
        },
        legend: {
            hide:true
        },
        tooltip:{
            format: {
                title: function (x) {return 'drift value: ' + x},
            }
        }
    })
    
    // Add Envelope Data:
    const minValues = [minXTickValue, maxXTickValue, minYTickValue, maxYTickValue]

    parseEnvelopeData(chart, uniqueId, minValues);
    
    // Hide the legends again:
    chart.legend.hide()
    
    //Add Button Event Handling to toggle curves on/off:
    curveDisplayButtonEvents(chart);
    
    // Append Chart element to div:
    document.getElementById(fileId).append(chart.element);

    let child = document.getElementById(fileId).getElementsByClassName("c3")[0].children[0].getElementsByClassName("c3-title")[0]
    child.addEventListener("click", (e) => {
        popUp(excelRefData,e,tableRowData,1);
    })
}

function reduceDataSet(data){
    let reducedData = data.slice(0,3);
    let remainingRows = data.slice(3,data.length);
    const totalPoints = data.length;
    const nbPointsToKeep = 100;
    const ratio = Math.ceil(totalPoints/nbPointsToKeep);

    // Reduce the number of points to plot according to total # of points in csv file:
    for (let i= 0; i < totalPoints; i += ratio ) {
        reducedData.push(remainingRows[i]);
    }
    return reducedData;
}