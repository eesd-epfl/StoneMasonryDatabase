import { clearBox} from "./browseDBTable.js";
import { createGraph} from "./browseDBScatterPlots.js";
import { CSVNamesArray, loadHistoryPlot, makeFileName, parseData } from "./browseDBCSVHandling.js";
import { config, dataFolderPath } from "./config.js";

let gridplots = document.getElementById("gridplots");
let plotDiv = document.getElementById("plotDiv");
let radioButtonsDiv = document.getElementById("radio-buttons");
let referenceDiv = document.getElementById("reference");
let plotContainer = document.getElementById("plot-container");
let windowPlot = document.getElementById("plotDiv");
let fdCurveDiv = document.getElementById("fdCurve");
let lhCurveDiv = document.getElementById("lhCurve");
let crackMapDiv = document.getElementById("crack-map");
let photoDiv = document.getElementById("photo");
let ref1 = document.getElementById("ref1");
let ref2 = document.getElementById("ref2");

export function popUp(excelRefData,e, row, calledFrom){
    $("#export-curve").replaceWith($('#export-curve').clone());
    let pagination = document.getElementsByClassName("pagination")[0];
    // Get data from the selected row:
    let rowData = [];
    if(calledFrom === 0){
        rowData = [row.getData()];  
    }else if (calledFrom === 1){
        rowData = row;
    }
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
    lhCurveDiv.style.display = "none";
    // Reset reference text:
    ref1.innerHTML = "";
    ref2.innerHTML = "";
    
    // Remove fdCurve, crackmap and photo child:
    const plotDivChildren = Array.from(plotDiv.children);
    plotDivChildren.forEach(child =>{
        clearBox(child);
    })

    // Reset the radio button to default F-D Curve:
    fdRadioButton.checked = "true";

    // Get the data of the selected row:
    const plotData = CSVNamesArray(rowData);
    const filePath = plotData[0][0];
    const uniqueId = plotData[1][0];

    // 1. Display the F-D Curve:
    fdCurveDiv.style.display = "block";
    
    let zip = new JSZip();    
    const fdCurveFilePath = config.curvesFolderPath + "FD_" + fileId + ".csv";
    const imgFilePath = config.imagesFolderPath + "photo_" + fileId + ".jpg"
    const crackmapFilePath = config.imagesFolderPath + "crackmap_" + fileId + ".png"

    executeIfFileExist(fdCurveFilePath,filePath,uniqueId,zip,testUnitName,excelRefData);
    executeIfFileExist(imgFilePath,filePath,uniqueId,zip,testUnitName,excelRefData);
    executeIfFileExist(crackmapFilePath,filePath,uniqueId,zip,testUnitName,excelRefData);
    
    loadHistoryPlot(filePath);
    
    // Get Envelope data and send to zip:
    let dataBlob = fetch(config.envelopesFolderPath+"envelope_"+uniqueId+".csv").then(resp => resp.blob());
    zip.file("envelope_"+uniqueId+".csv", dataBlob);

    // Get Bibtex Citation and send to zip:
    dataBlob = fetch(dataFolderPath+ config.bibName).then(resp => resp.blob());
    zip.file(config.bibName, dataBlob);

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
    let downloadButton = document.getElementById("export-curve");
    downloadButton.addEventListener("click",() => zip.generateAsync({type:"blob"}).then((content)=> saveAs(content, uniqueId+".zip")));

    //Give functionality to the close icon:
    let windowsCloseIcon = document.getElementById("close");
    windowsCloseIcon.addEventListener("click",function(){
        // Remove event listener on button:
        $("#export-curve").replaceWith($('#export-curve').clone());

        // Clear all the contents of the pop-up window
        let plotDiv = document.getElementById("plotDiv");
        const plotDivChildren = Array.from(plotDiv.children);
        plotDivChildren.forEach(child =>{
            clearBox(child);
        })

        // Display hidden divs:
        gridplots.style.display = 'flex';
        pagination.style.display = 'block';
        plotDiv.style.display = "none";
        plotContainer.style.display = "none";

        // Force a windows resize to call the c3 resize function on the graphs (otherwise the SVG element overflows on its parent's container)
        window.dispatchEvent(new Event('resize'));
    })        
    e.preventDefault();
}

function executeIfFileExist(source,filePath,uniqueId,zip,testUnitName,excelRefData) {
    let dataBlob;
    var xhr = new XMLHttpRequest()
    xhr.open('GET', source, true);
    xhr.onreadystatechange = function(e){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                // Get and display FD Curve
                if(source.includes("FD_")){
                    parseData(createGraph,filePath,"fdCurve",uniqueId,excelRefData);
                    dataBlob = fetch(filePath).then(resp => resp.blob());
                    zip.file("FD_"+uniqueId+".csv", dataBlob);

                    // Get and display Photo:
                } else if(source.includes("photo_")){
                    photoDiv.className = "img-data";
                    const photoImage = document.createElement("img")
                    photoImage.id = "photo-image";
                    photoImage.src = source;
                    photoDiv.append(photoImage);

                    // Add file to ZIP
                    JSZipUtils.getBinaryContent(source, (err,data) => {
                        if(err){
                            alert("problem downloading image file");
                        }else {
                            zip.file("photo_"+uniqueId+".jpg", data, {binary:true});
                        }
                    });

                } else if(source.includes("crackmap")){
                    // Create child and append it to the div:
                    const crackmapImage = document.createElement("img");
                    crackMapDiv.className = "img-data";
                    crackmapImage.id = "crackmap-image";
                    crackmapImage.src = source;
                    crackMapDiv.append(crackmapImage);

                    // Add file to ZIP
                    JSZipUtils.getBinaryContent(source, (err,data) => {
                        if(err){
                            alert("problem downloading image file");
                        }else {
                            zip.file("crackmap_"+uniqueId+".png", data);
                        }
                    });

                }
            // If no file found:
            }else {
                if(source.includes("photo_")){
                    photoDiv.className = "img-no-data";
                    photoDiv.innerHTML = "No photo available";
                }else if(source.includes("FD_")){
                    fdCurveDiv.className = "no-data";
                    fdCurveDiv.innerHTML = testUnitName + " - No FD-Curve available";
                    fdCurveDiv.style.textAlign = "center"
                }else if(source.includes("crackmap")){
                    crackMapDiv.className = "img-no-data";
                    crackMapDiv.innerHTML = "No crackmap available";
                }
            }
        }
    }
    xhr.send(null);
}