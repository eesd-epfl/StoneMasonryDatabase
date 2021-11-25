import { clearBox } from "./browseDBTable.js";
import { createGraph} from "./browseDBScatterPlots.js";
import { createCSVArray, makeFileName, parseData } from "./browseDBCSVHandling.js";
import { config } from "./config.js";



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
        let photoImage = document.getElementById("photo-image");
        let crackmapImage = document.getElementById("crackmap-image");
        const fileId = makeFileName(rowData[0])[0];
        const testUnitName = makeFileName(rowData[0])[1];
        
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
        
        // Remove fdCurve, crackmap and photo child: 
        clearBox(fdCurveDiv);
        clearBox(photoDiv);
        clearBox(crackMapDiv);

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
        // Fix some css:
        windowPlot.style.paddingTop = "2vh"

        // Get the data of the selected row:
        const plotData = createCSVArray(rowData);
        
        // 1. Display the F-D Curve:
        fdCurveDiv.style.display = "block";
        
        const fdCurveFilePath = config.curvesFolderPath + "FD_" + fileId + ".csv";
        const imgFilePath = config.imagesFolderPath + "photo_" + fileId + ".jpg"
        const crackmapFilePath = config.imagesFolderPath + "crackmap_" + fileId + ".jpg"

        function executeIfFileExist(source) {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', source, true);
            xhr.onreadystatechange = function(e){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        if(source.includes("FD_")){
                            parseData(createGraph,plotData[0][0],"fdCurve");
                            fdCurveDiv.style.height = "28vh";
                            fdCurveDiv.style.paddingTop = "0vh";
                            fdCurveDiv.style.paddingBottom = "0vh";
                        } else if(source.includes("photo_")){
                            // Create child and append it to the div:
                            const photoImage = document.createElement("img")
                            photoImage.id = "photo-image";
                            photoImage.src = imgFilePath;
                            photoDiv.append(photoImage);
                            // Fix CSS:
                            photoDiv.style.paddingTop = "0vh";
                            photoDiv.style.paddingBottom = "0vh";
                            photoDiv.style.height = "28vh";
                            photoImage.style.height = "28vh"
                        } else if(source.includes("crackmap")){
                            // Create child and append it to the div:
                            const crackmapImage = document.createElement("img");
                            crackmapImage.id = "crackmap-image";
                            crackmapImage.src = crackmapFilePath;
                            crackMapDiv.append(crackmapImage);
                            // Fix CSS:
                            crackMapDiv.style.paddingTop = "0vh";
                            crackMapDiv.style.paddingBottom = "0vh";
                            crackMapDiv.style.height = "28vh";
                            crackmapImage.style.height = "28vh"
                        }
                    }else {
                        if(source.includes("photo_")){
                            photoDiv.innerHTML = "No photo available";
                            photoDiv.style.height = "28vh";
                            photoDiv.style.paddingTop = "12vh";
                            photoDiv.style.paddingBottom = "12vh";
                        }else if(source.includes("FD_")){
                            fdCurveDiv.innerHTML = testUnitName + " - No FD-Curve available";
                            fdCurveDiv.style.height = "28vh";
                            fdCurveDiv.style.paddingTop = "12vh";
                            fdCurveDiv.style.paddingBottom = "12vh";
                            fdCurveDiv.style.textAlign = "center"
                        }else if(source.includes("crackmap")){
                            crackMapDiv.innerHTML = "No crackmap available";
                            crackMapDiv.style.height = "28vh";
                            crackMapDiv.style.paddingTop = "12vh";
                            crackMapDiv.style.paddingBottom = "12vh";
                        }
                    }
                }
            }
            xhr.send(null);
        }
        executeIfFileExist(fdCurveFilePath);
        executeIfFileExist(imgFilePath);
        executeIfFileExist(crackmapFilePath);

        //Change div according to the radio buttons:
        let radios = document.getElementsByName('selected-curve');
        radios.forEach((button)=>{
            button.addEventListener("change", function(event){
                //Start by hiding all the divs inside plotDiv:
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
