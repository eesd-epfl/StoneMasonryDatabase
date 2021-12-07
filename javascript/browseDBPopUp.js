import { clearBox} from "./browseDBWidgets.js";
import { createGraph} from "./browseDBGraphs.js";
import { fillRefDivs, getLoadHistoryData, getUniqueIdFromData, parseData, popUpGetExcelRefData } from "./browseDBCSVHandling.js";
import { config, dataFolderPath } from "./config.js";

const gridplots = document.getElementById("gridplots");
const plotDiv = document.getElementById("plotDiv");
const radioButtonsDiv = document.getElementById("radio-buttons");
const referenceDiv = document.getElementById("reference");
const plotContainer = document.getElementById("plot-container");
const fdCurveDiv = document.getElementById("fdCurve");
const lhCurveDiv = document.getElementById("lhCurve");
const crackMapDiv = document.getElementById("crack-map");
const photoDiv = document.getElementById("photo");
const crackRadioBtn = document.getElementById("crack-radio");
const photoRadioBtn = document.getElementById("photo-radio");

// This function handles all the one-test selection pop up window functionalities.
// Data is handled differently according to where the call came from:
// 1. Call came directly from clicking on the row -> We have the row data, reference data, etc.
// 2. Call comes from clicking on the plot title -> We need to get the data

// Code is separated in the following sections:
// 1. Reset divs/contents on new pop up
// 2. Add Ref data
// 3. Display the plots
// 4. Add file data to zip for export
// 5. Radio button functionality (switch between plots/images)
export function popUp(excelRefData,e, row, calledFrom){
    let pagination = document.getElementsByClassName("pagination")[0];
    const plotDivChildren = Array.from(plotDiv.children);
    let rowData = [];
    console.log(document.getElementsByClassName("c3")[0])
    // 1. Remove contents, reset display and divs:

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
    
    // Remove fdCurve, crackmap and photo child:
    plotDivChildren.forEach(child =>{
        clearBox(child);
    })

    // Reset the radio button to default F-D Curve:
    fdRadioButton.checked = "true";
    
    // Reinitialise the download test data button on pop up:
    $("#export-curve").replaceWith($('#export-curve').clone());

    // 2. Fill Reference Data:
    // If the call comes from clicking on a row:
    if(calledFrom === 0){
        rowData = [row.getData()];
        // Add the selected row's reference:
        fillRefDivs(rowData,excelRefData);

    // If the call comes from the plot title:  
    }else if (calledFrom === 1){
        rowData = row;
        popUpGetExcelRefData("",rowData)

    }

    // Variables Preparation:
    const uniqueId = getUniqueIdFromData(rowData[0])[0];
    const testUnitName = getUniqueIdFromData(rowData[0])[1];
    const allFilePaths = createPopUpFilePaths(uniqueId);
    let zip = new JSZip();

    // 3. Display all the plots
    // 4a. Add the files to zip (1st part is inside the displayPlots fct):
    for (const file in allFilePaths){
        displayPlots(allFilePaths[file],uniqueId,zip,testUnitName,excelRefData);
    }
    
    // 4b. Second part of zip files to add:
    // Envelope data:
    let dataBlob = fetch(config.envelopesFolderPath+"envelope_"+uniqueId+".csv").then(resp => resp.blob());
    zip.file("envelope_"+uniqueId+".csv", dataBlob);

    // Bibtex Citation:
    dataBlob = fetch(dataFolderPath+ config.bibName).then(resp => resp.blob());
    zip.file(config.bibName, dataBlob);

    // 5. Radio buttons functionality:
    let radios = document.getElementsByName('selected-curve');
    radios.forEach((button)=>{
        button.addEventListener("change", function(event){
            //Start by hiding all the divs inside plotDiv:
            plotDivChildren.forEach(child => {
                child.style.display = "none";
            })
            // Radio button value = ID of div to display.
            // Only change the display of the selected radio button by using this:
            document.getElementById(event.target.value).style.display = "block";
        })
    })

    // 6. Add functionality to download test data button:
    document.getElementById("export-curve").addEventListener("click",() => 
        zip.generateAsync({type:"blob"}).then((content) => 
            saveAs(content, uniqueId+".zip")));

    // 7. Add functionality to the close icon:
    let windowsCloseIcon = document.getElementById("close");
    windowsCloseIcon.addEventListener("click",function(){
        // Remove event listener on button:
        $("#export-curve").replaceWith($('#export-curve').clone());

        // Clear all the contents of the pop-up window
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

// Get and display file data and add to zip
function displayPlots(source,uniqueId,zip,testUnitName,excelRefData) {
    let dataBlob;
    var xhr = new XMLHttpRequest()
    xhr.open('GET', source, true);
    xhr.onreadystatechange = function(e){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                // Get and display FD Curve + Load History Plot
                if(source.includes("FD_")){
                    parseData(createGraph,source,"fdCurve",uniqueId,excelRefData);
                    getLoadHistoryData(source);
                    dataBlob = fetch(source).then(resp => resp.blob());
                    zip.file("FD_"+uniqueId+".csv", dataBlob);

                    // Get and display Photo:
                } else if(source.includes("photo_")){
                    photoDiv.className = "img-data";
                    const photoImage = document.createElement("img")
                    photoImage.id = "photo-image";
                    photoImage.src = source;
                    photoDiv.append(photoImage);
                    photoRadioBtn.disabled = false;
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
                    crackRadioBtn.disabled = false;
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
                    photoRadioBtn.disabled = true;
                }else if(source.includes("FD_")){
                    fdCurveDiv.className = "no-data";
                    fdCurveDiv.innerHTML = testUnitName + " - No FD-Curve available";
                    fdCurveDiv.style.textAlign = "center"
                }else if(source.includes("crackmap")){
                    crackMapDiv.className = "img-no-data";
                    crackMapDiv.innerHTML = "No crackmap available";
                    crackRadioBtn.disabled = true;
                }
            }
        }
    }
    xhr.send(null);
}

// Creates an object with the file paths of the FD, photo and crackmap files:
function createPopUpFilePaths(uniqueId){
    const allFilePaths = {
        fdCurveFilePath:config.curvesFolderPath + "FD_" + uniqueId + ".csv",
        imgFilePath:config.imagesFolderPath + "photo_" + uniqueId + ".jpg",
        crackmapFilePath: config.imagesFolderPath + "crackmap_" + uniqueId + ".png"
    }
    return allFilePaths;
}
