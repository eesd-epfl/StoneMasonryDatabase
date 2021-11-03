export function dataTable(inputFilePath, excelColumns) {
    //Get data from Excel File:
    let xhr = new XMLHttpRequest();
    xhr.open("GET", inputFilePath, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
        let file = this.response;
        let reader = new FileReader();
        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                ProcessExcel(e.target.result,excelColumns);
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
                ProcessExcel(data,excelColumns);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    xhr.send();
};

function ProcessExcel(data,excelColumns) {
    //Read the Excel File data. 
    let workbook = XLS.read(data, {
        type: 'binary'
    });
    //Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    let excelObject = XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    console.log(excelColumns);
    //Data for simple-datatable or 
    // let excelObject2 = XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet], {header:1});

    //Initialise arrays:
    let intObject = [];
    let indexArray = [];
    let finalObject = [];
    
    //Remove empty rows from array:
    for (let i = 0; i<excelObject.length; i++){
        if(excelObject[i].length!=0){
            intObject.push(excelObject[i]);
        }
    }

    //Example 1 - Tabulator Version:
    //Filter JSON object to get only wanted columns:
    let filtered = intObject.map(function(row){
        let newRow = {}
        for (let i = 0; i< excelColumns.length; i++){
            newRow[excelColumns[i]]= row[excelColumns[i]];
        }
        return newRow;
    });
    let table = new Tabulator('#data-table3',{
        data:filtered,
        autoColumns:true,
        layout:"fitColumns",
        pagination:"local",
        paginationSize:20,
        });

    //Example 2: Simple Datatables
    //get index of wanted columns:
    // for (let i = 0; i < intObject[0].length; i++){
    //     if(excelColumns.includes(intObject[0][i])){
    //         // console.log(intObject[0][i]);
    //         indexArray.push(i);
    //     }
    // }
    //map into new Array the final data table:
    // finalObject = intObject.map(function(row){
    //     let newRow = [];
    //     for (let i = 0; i<indexArray.length; i++){
    //         newRow.push(row[indexArray[i]]);
    //     }
    //     return newRow;
    // });

    //Simple data-tables version:
    // let options = {
    //     paging:false,
    //     searchable:false,
    //     truncatePager:true,
    //     fixedColumns:true,
           
    // }

    // let dataTable = new simpleDatatables.DataTable('#data-table2',options);
    // let newData = {
    //     headings: finalObject[0],
    //     data: finalObject.slice(1)
    // }
    // dataTable.insert(newData);
    //Push Excel Object to create data table Function
    // createTable(finalObject);
};

function filterHandler(){

}

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
    let tableList = new List('data-table2',options);
}
