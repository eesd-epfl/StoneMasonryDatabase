import { clearBox } from "./data_table.js";
import { createCSVArray, createGraph, parseData} from "./scatter_plots.js";


export function eventHandler(){
    rowSelect();
}

function rowSelect(){
    let table = Tabulator.findTable("#data-table3")[0];
    table.on("rowClick",function(e,row){
        //e - the click event object
        //row - row component

        //Get data from the selected row:
        let rowData = [row.getData()];

        //Get and disable the plots and pagination divs:
        let gridplots = document.getElementById("gridplots");
        let pagination = document.getElementsByClassName("pagination")[0];
        gridplots.style.display = 'none';
        pagination.style.display = 'none';
        
        //Create new window:
        const container = document.getElementById("container");
        const plotContainer = document.createElement("div");
        plotContainer.id = "plot-container";
        container.append(plotContainer);

        //Creating and giving functionalities to the close window button:
        const closeWindowButton = document.createElement("div")
        plotContainer.append(closeWindowButton);

        closeWindowButton.id = "close";
        closeWindowButton.className = "ui basic button";
        closeWindowButton.innerHTML = "close"
        closeWindowButton.addEventListener("click",function(){
            clearBox(plotContainer);
            gridplots.style.display = 'flex';
            pagination.style.display = 'block';
        })        

        // Read the file data and append it to the container:
        let windowPlot = document.createElement("div");
        const plotData = createCSVArray(rowData);
        const plotName = "#max"+plotData[1][0]; 
        windowPlot.id = "max"+plotData[1][0];
        parseData(createGraph,plotData[0][0],"max"+plotData[1][0]);
        plotContainer.append(windowPlot);

        //Create toggle between plot and crack map:
        let toggleEl = document.createElement("div");
        toggleEl.className = "ui slider checkbox";
        let toggleInput = document.createElement("input");
        toggleInput.type = "radio";
        toggleEl.append(toggleInput);
        let toggleLabel = document.createElement("label");
        toggleLabel.innerHTML = "F-D map and Crack Map";
        toggleEl.append(toggleLabel);
        plotContainer.append(toggleEl);
        e.preventDefault();
        })
}