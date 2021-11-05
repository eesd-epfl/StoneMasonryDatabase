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

    //Initialise arrays:
    let intObject = [];

    //Remove empty rows from array:
    for (let i = 0; i<excelObject.length; i++){
        if(excelObject[i].length!=0){
            intObject.push(excelObject[i]);
        }
    };

    //Filter JSON object to get only wanted columns:
    let filtered = intObject.map(function(row){
        let newRow = {}
        for (let i = 0; i< excelColumns.length; i++){
            newRow[excelColumns[i]]= row[excelColumns[i]];
        }
        return newRow;
    });
    //Create table in next function:
    createTable(filtered);
    return filtered;
};

function createTable(data){
    let table = new Tabulator('#data-table3',{
        data:data,
        autoColumns:true,
        // layout:"fitColumns",
        pagination:"remote",
        // paginationSize:20,
        height:"87vh",
        });

    //Handle Events:

    //1. Checkboxes:
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    let enabledSettings = [];

    //Iterate through all checkboxes:
    checkboxes.forEach(function(checkbox){
        //add event Listeners to all checkboxes
        checkbox.addEventListener('change',function(){
            //get all the active checkboxes and create a Tabulator filter:
            enabledSettings = 
                Array.from(checkboxes).filter(i => i.checked).map(i => i.value);
                table.setFilter('Stone masonry typology','in',enabledSettings);
            });
        });


    
    // //2. Sliders:
    let minSize = Math.min.apply(null, data.map(item => item['H [mm]'])),
    maxSize = Math.max.apply(null, data.map(item => item['H [mm]']));
    let sizeStep = 1
    let sizeSlider = document.getElementById('size-slider');
    noUiSlider.create(sizeSlider, {
        range: {
            'min':minSize, 
            'max': maxSize, 
        },
        step: sizeStep,
        start: [minSize,maxSize],
    });

    // sizeSlider.style.height = '400px'
    // sizeSlider.style.margin = '0 auto 30px'
        // start: maxSize, 
    // $('#size-slider').range({
    //     min: minSize,
    //     max: maxSize,
    //     start: maxSize,
    //     smooth:true
    // });
    // let sliders = document.querySelectorAll("div[name=slider]");
    
}