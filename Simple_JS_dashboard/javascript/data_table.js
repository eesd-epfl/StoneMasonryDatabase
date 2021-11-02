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
    let excelRows = XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet],{header:1});

    console.log(excelRows);
    
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

Display()