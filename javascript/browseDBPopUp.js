import { clearBox } from "./browseDBTable.js";
import { createGraph} from "./browseDBScatterPlots.js";
import { createCSVArray, parseData } from "./browseDBCSVHandling.js";


export function popUp(excelRefData){
    let table = Tabulator.findTable("#data-table3")[0];
    table.on("rowClick",function(e,row){
        // Get data from the selected row:
        let rowData = [row.getData()];  

        let gridplots = document.getElementById("gridplots");
        let pagination = document.getElementsByClassName("pagination")[0];
        let plotDiv = document.getElementById("plotDiv");
        let radioButtonsDiv = document.getElementById("radio-buttons");
        let referenceDiv = document.getElementById("reference");
        let plotContainer = document.getElementById("plot-container");
        let windowPlot = document.getElementById("plotDiv");
        let fdCurveDiv = document.getElementById("fdCurve");
        let crackMapDiv = document.getElementById("crack-map");
        let photoDiv = document.getElementById("photo");
        let ref1 = document.getElementById("ref1");
        let ref2 = document.getElementById("ref2");
        
        
        // Disable the plots and pagination divs:
        gridplots.style.display = 'none';
        pagination.style.display = 'none';

        // Show the hidden divs that contain the selected curve window:
        plotContainer.style.display = "block";
        plotDiv.style.display = "block";
        radioButtonsDiv.style.display = "block";
        referenceDiv.style.display = "block";
        fdCurveDiv.style.display = "block";

        // Hide crack map and photo divs
        crackMapDiv.style.display = "none";
        photoDiv.style.display = "none";

        // Reset reference text:
        ref1.innerHTML = "";
        ref2.innerHTML = "";

        // Remove fdCurve child: 
        clearBox(fdCurveDiv);

        // Reset the radio button to default F-D Curve:
        fdRadioButton.checked = "true";

        //Give functionality to the close icon:
        let windowsCloseIcon = document.getElementById("close");
        windowsCloseIcon.addEventListener("click",function(){
            let plotDiv = document.getElementById("plotDiv");
            const plotDivChildren = Array.from(plotDiv.children);
            plotDivChildren.forEach(child =>{
                clearBox(child);
            })
            gridplots.style.display = 'flex';
            pagination.style.display = 'block';
            plotDiv.style.display = "none";
            plotContainer.style.display = "none";
        })        
        windowPlot.style.paddingTop = "2vh"

        const plotData = createCSVArray(rowData);
        parseData(createGraph,plotData[0][0],"fdCurve");
        fdCurveDiv.style.display = "block";
        
        // Placeholder for crackmap:
        crackMapDiv.style.display = "none";
        crackMapDiv.style.height = "28vh";
        crackMapDiv.innerHTML = "No crack map available";
        // crackMapDiv.classList.add("ui","placeholder");
        // let crackMapImage = document.createElement("div");
        // crackMapImage.classList.add("image");
        // crackMapDiv.append(crackMapImage);
        
        // Placeholder for photo:
        photoDiv.innerHTML = "No photo available";
        photoDiv.style.height = "28vh";

        //Change div according to the radio buttons:
        let radios = document.getElementsByName('selected-curve');
        radios.forEach((button)=>{
            button.addEventListener("change", function(event){
                //Start by removing hiding all the divs inside plotDiv:
                const plotDivChildren = Array.from(plotDiv.children);
                plotDivChildren.forEach(child => {
                    child.style.display = "none";
                })
                // Radio button value = ID of div to display.
                // Only change the display of the selected radio button by using this:
                let divId = event.target.value;
                let myDivToDisplay = document.getElementById(divId);
                myDivToDisplay.style.display = "block";
            })
        })

        // Add reference information to the window
        // Add the selected row's reference:
        for (let i = 0; i< excelRefData.length; i++){
            if(excelRefData[i]['Number'] == rowData[0]['Reference nb']){
                ref1.innerHTML = excelRefData[i]['Reference 1'];
                if(excelRefData[i]['Reference 2'] != undefined){
                    ref2.innerHTML = excelRefData[i]['Reference 2'];
                }
            }
        }
        //TODO - Remove all child nodes when CLOSE icon is clicked (plot-container div persists atm)
        //TODO - If another row is selected while first plot is open, remove all divs first (stacking plots atm).
        e.preventDefault();
    })
}