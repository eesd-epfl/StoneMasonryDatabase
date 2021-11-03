
function dataTable() {

    //Get data from Excel File:
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "data/Vanin et al. (2017) StoneMasonryDatabase.xls", true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
        let file = this.response;
        let reader = new FileReader();
        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                ProcessExcel(e.target.result);
            };
            reader.readAsBinaryString(file);
        } else {
            //For IE Browser.
            reader.onload = function (e) {
                let data = "";
                let bytes = new Uint8Array(e.target.result);
                for (let i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                ProcessExcel(data);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    xhr.send();
};

function ProcessExcel(data) {
    excelColumns = ['ID','Reference','Test unit name', 'Cyclic / Monotonic', 'Lab / In-situ',
                    'Stone masonry typology','Joints','Stones','H [mm]', 'L [mm]', 't [mm]', 'H0/H',
                    'σ0,tot /fc','Failure type']
    //Read the Excel File data. 
    let workbook = XLS.read(data, {
        type: 'binary'
    });
    //Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    let excelObject = XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet],{header:1});

    //Remove empty rows from array:
    let intObject = [];
    let indexArray = [];
    for (let i = 0; i<excelObject.length; i++){
        if(excelObject[i].length!=0){
            intObject.push(excelObject[i]);
        }
    }
    //get index of wanted columns:
    for (let i = 0; i < intObject[0].length; i++){
        if(excelColumns.includes(intObject[0][i])){
            // console.log(intObject[0][i]);
            indexArray.push(i);
        }
    }
    //map into new Array the final data table:
    finalObject = intObject.map(function(row){
        let newRow = [];
        for (let i = 0; i<indexArray.length; i++){
            newRow.push(row[i]);
        }
        return newRow;
    });

    //Push Excel Object to create data table Function
    createTable(finalObject);
};

function createTable(excelArray){
    //Create Data table element and give it a class name
    const dataTable = document.getElementById('data-table');
    const tbl = document.createElement('table');
    tbl.className = "ui collapsing table";

    //Add tHead and tBody to the table
    const header = tbl.createTHead();
    const tblBody = tbl.createTBody();

    //Create thead element in table: 
    const headerRow = header.insertRow(0);

    //Empty array to be filled in loop for List.JS
    let nameValues = [];

    //Loop through each row and element of Excel Object:
    for (let i = 0; i < excelArray.length; i++) {
        
        let tr;

        if(i != 0){
            tr = tblBody.insertRow();
        }

        for (let j = 0; j < excelArray[i].length; j++) {
        if (i === excelArray.length-1 && j === excelArray[i].length-1) {
            break;
        } else {
            if(i == 0){
                //Add headers to array for List.JS
                nameValues.push(excelArray[i][j]);

                //Add all cells to header row:        
                const cell = headerRow.insertCell(j);
                cell.innerHTML = excelArray[i][j];

            } else {
                //Add all rows to tBody
                const td = tr.insertCell();
                td.className=excelArray[0][j];
                td.appendChild(document.createTextNode(excelArray[i][j]));
            }
        }
        }
    }
    //Push Data table to HTML
    dataTable.appendChild(tbl);

    //give tBody a class name and create options for List.JS
    const tBody = tbl.getElementsByTagName('tbody')[0];
    tBody.className = 'list';

    let options= {
        valueNames: nameValues
    };
    //Create the table List for filtering with List.JS
    let tableList = new List('data-table',options);
}

dataTable();