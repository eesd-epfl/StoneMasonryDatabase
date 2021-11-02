function Display() {
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
    //Read the Excel File data. 
    let workbook = XLS.read(data, {
        type: 'binary'
    });
    //Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    let excelObject = XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet],{header:1});

    //Remove empty rows from array:
    let finalObject = [];
    for (let i = 0; i<excelObject.length; i++){
        if(excelObject[i].length!=0){
            finalObject.push(excelObject[i]);
        }
    }
    createTable(finalObject);

    // //Create a HTML Table element.
    // let table = document.createElement("table");

    // //Add the header row.
    // let row = table.insertRow(-1);

    // //Add the header cells.
    // let headerCell = document.createElement("TH");
    // headerCell.innerHTML = "Id";
    // row.appendChild(headerCell);

    // headerCell = document.createElement("TH");
    // headerCell.innerHTML = "Name";
    // row.appendChild(headerCell);

    // headerCell = document.createElement("TH");
    // headerCell.innerHTML = "Country";
    // row.appendChild(headerCell);

    // //Add the data rows from Excel file.
    // for (let i = 0; i < excelRows.length; i++) {
    //     //Add the data row.
    //     let row = table.insertRow(-1);

    //     //Add the data cells.
    //     let cell = row.insertCell(-1);
    //     cell.innerHTML = excelRows[i].Id;

    //     cell = row.insertCell(-1);
    //     cell.innerHTML = excelRows[i].Name;

    //     cell = row.insertCell(-1);
    //     cell.innerHTML = excelRows[i].Country;
    // }

    // let datatable = document.getElementById("data-table");
    // datatable.innerHTML = "";
    // datatable.appendChild(table);
};

function createTable(excelArray){
    //Create Data table element and give it a class name
    const dataTable = document.getElementById('data-table');
    const tbl = document.createElement('table');
    tbl.className = "ui collapsing table";

    //Add tHead and tBody to the table
    const header = tbl.createTHead();
    const tblBody = tbl.createTBody();

    const headerRow = header.insertRow(0);

    //Empty array to be filled in loop for List.JS
    let nameValues = [];

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
                const cell = headerRow.insertCell(j);
                cell.innerHTML = excelArray[i][j];
                //create header row
                // const th = tr.insertCell();
                // th.appendChild(document.createTextNode)

            } else {
                const td = tr.insertCell();
                td.className=excelArray[0][j];
                td.appendChild(document.createTextNode(excelArray[i][j]));
            }
        }
        }
    }
    const tBody = tbl.getElementsByTagName('tbody')[0];
    tBody.className = 'list';

    let options= {
        valueNames: nameValues
    };
    dataTable.appendChild(tbl);
    let tableList = new List('data-table',options);
}

Display();