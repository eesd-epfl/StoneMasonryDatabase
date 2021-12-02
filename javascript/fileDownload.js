import { onClickEvent } from "./browseDBPopUp.js";
import { config } from "./config.js";

export function downloadCurveData(uniqueId,downloadButton){
    //Make the .zip file based on the current selected row:
    const zipFile = createZIPFile(uniqueId);
    
    zipFile.generateAsync({type:"blob"}).then(function (blob){
        saveAs(blob, uniqueId+".zip");
    });
    //Set the File URL.
    // var url = "Files/" + fileName;
 
    //Create XMLHTTP Request.
    // var req = new XMLHttpRequest();
    // req.open("GET", url, true);
    // req.responseType = "blob";
    // req.onload = function () {
    //     //Convert the Byte Data to BLOB object.
    //     var blob = new Blob([req.response], { type: "application/octetstream" });

    //     //Check the Browser type and download the File.
    //     var isIE = false || !!document.documentMode;
    //     if (isIE) {
    //         window.navigator.msSaveBlob(blob, fileName);
    //     } else {
    //         var url = window.URL || window.webkitURL;
    //         link = url.createObjectURL(blob);
    //         var a = document.createElement("a");
    //         a.setAttribute("download", fileName);
    //         a.setAttribute("href", link);
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    //     }
    // };
    // req.send();
}

function createZIPFile(uniqueId){
    
    let zip = new JSZip();
    const fileNames = ["FD_" + uniqueId + ".csv","envelope_" + uniqueId + ".csv","photo_" + uniqueId + ".jpg","crackmap_" + uniqueId + ".png"];
    const filePaths = [ config.curvesFolderPath+ fileNames[0], config.envelopesFolderPath +fileNames[1],
    config.imagesFolderPath+fileNames[2], config.imagesFolderPath+fileNames[3]];
    
    for (let i = 0; i<filePaths.length; i++){
        getFile(fileNames[i],filePaths[i], zip);
    }
    return zip;
}

function getFile(fileName, filePath, zip){
    var xhr = new XMLHttpRequest()
    xhr.open('GET', filePath, true);
    xhr.onreadystatechange = function(e){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                console.log(e.target.result)
                const blob = new Blob(e.target.result, {type:'blob'})
                zip.file(fileName,blob)
            }
        }
    }
    xhr.send();

}