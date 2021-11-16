import { clearBox } from "./data_table.js";
import { createCSVArray, createGraph, parseData} from "./scatter_plots.js";


export function eventHandler(){
    rowSelect();
}

function rowSelect(){
    let table = Tabulator.findTable("#data-table3")[0];
    table.on("rowClick",function(e,row){
        // Get data from the selected row:
        let rowData = [row.getData()];

        // Get and disable the plots and pagination divs:
        let gridplots = document.getElementById("gridplots");
        let pagination = document.getElementsByClassName("pagination")[0];
        gridplots.style.display = 'none';
        pagination.style.display = 'none';
        
        // Create new window:
        const container = document.getElementById("container");
        const plotContainer = document.createElement("div");
        plotContainer.id = "plot-container";
        // plotContainer.className = "ui grid"
        container.append(plotContainer);

        // Creating and giving functionalities to the close window icon:
        // 1. Create Element:
        let windowsCloseIcon = document.createElement("i");
        windowsCloseIcon.id = "close"
        windowsCloseIcon.classList.add("close","icon");
        plotContainer.append(windowsCloseIcon);
        // 2. Give it functionalities:
        windowsCloseIcon.addEventListener("click",function(){
            clearBox(plotContainer);
            gridplots.style.display = 'flex';
            pagination.style.display = 'block';
        })        

        // Read the file data and append it to the container:
        let windowPlot = document.createElement("div");
        windowPlot.style.paddingTop = "2vh"
        const plotData = createCSVArray(rowData);
        const plotName = "#max"+plotData[1][0]; 
        windowPlot.id = "max"+plotData[1][0];
        parseData(createGraph,plotData[0][0],windowPlot.id);
        plotContainer.append(windowPlot);

        
        // Placeholder for crackmap:
        let crackMapDiv = document.createElement("div");
        crackMapDiv.style.display = "none";
        crackMapDiv.style.height = "30vh";
        crackMapDiv.id = "crack-map"
        crackMapDiv.classList.add("ui","placeholder");
        let crackMapImage = document.createElement("div");
        crackMapImage.classList.add("image");
        crackMapDiv.append(crackMapImage);
        plotContainer.append(crackMapDiv);
        // Create toggle between plot and crack map:
        // 1. Div that will contain the left-side text, the toggle, and the right hand text:
        let toggleContainer = document.createElement("div");

        // 2. Left-hand text div:
        let fdCurveDiv = document.createElement("div");
        fdCurveDiv.append(document.createTextNode("F-D Curve"));
        fdCurveDiv.classList.add("toggleSlider");
        toggleContainer.append(fdCurveDiv);

        // 3. Toggle Slider:
        let toggleEl = document.createElement("div");
        toggleEl.id = "crackmap-toggle";
        noUiSlider.create(toggleEl, {
            start: 0,
            range: {
                'min': [0,1],
                'max': 1
            },
            format: {
                from: function(value){
                    return parseInt(value);
                },
                to: function(value){
                        return parseInt(value);
                    }
            }
        });
        switchCurveDivs (toggleEl,windowPlot.id);
        // toggleEl.noUiSlider.on('update', function (values, handle) {
        //     if (values[handle] === '1') {
        //         toggleEl.classList.add('off');
        //     } else {
        //         toggleEl.classList.remove('off');
        //     }
        // });
        toggleContainer.append(toggleEl);

        // 4. Right-hand text div:
        let crackMapText= document.createElement("div");
        crackMapText.append(document.createTextNode("Crack Map"));
        crackMapText.classList.add("toggleSlider");
        toggleContainer.append(crackMapText);
        plotContainer.append(toggleContainer);

        //TODO - Remove all child nodes when CLOSE icon is clicked (plot-container div persists atm)
        //TODO - If another row is selected while first plot is open, remove all divs first (stacking plots atm).

        e.preventDefault();
    })
}

function switchCurveDivs (slider, FDCurveID){
    let FDCurve = document.getElementById(FDCurveID);
    let CrackMap = document.getElementById("crack-map")
    slider.noUiSlider.on('update', function (values, handle) {
        if (values[handle] === 1) {
            FDCurve.style.display = "none";
            CrackMap.style.display = "block";
            // slider.classList.add('off');

        } else {
            console.log("Hi - " +values[handle])
            FDCurve.style.display = "block";
            CrackMap.style.display = "none";
            // slider.classList.remove('off');
        }
    });
}