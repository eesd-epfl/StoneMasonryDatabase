
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

    //Creating objects:

    //1. Checkboxes:
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");

    // //2. Sliders:
    //Size slider:
    let minSize = Math.min.apply(null, data.map(item => item['H [mm]'])),
        maxSize = Math.max.apply(null, data.map(item => item['H [mm]']));
    let sizeStep = 1
    let sizeSlider = document.getElementById('size-slider');
    noUiSlider.create(sizeSlider, {
        range: {
            'min':1000, 
            'max': maxSize, 
        },
        step: sizeStep,
        start: [minSize,maxSize],
        connect:true,
    });

    //Strength slider:
    let minStrength = Math.min.apply(null, data.map(item => item['H [mm]'])),
        maxStrength = Math.max.apply(null, data.map(item => item['H [mm]']));
    let stengthStep = 1;
    let strengthSlider = document.getElementById('strength-slider');
    noUiSlider.create(strengthSlider, {
        range: {
            'min':minStrength, 
            'max': maxStrength, 
        },
        step: stengthStep,
        start: [minStrength,maxStrength],
        connect:true,
    });

    //Stiffness slider:
    let minStiffness = Math.min.apply(null, data.filter(item => item['σ0,tot /fc'] != undefined?true:false).map(item => item['σ0,tot /fc'])),
        maxStiffness = Math.max.apply(null, data.filter(item => item['σ0,tot /fc'] != undefined?true:false).map(item => item['σ0,tot /fc']));
    let stiffnessStep = 0.010;
    let stiffnessSlider = document.getElementById('stiffness-slider');
    noUiSlider.create(stiffnessSlider, {
        range: {
            'min':minStiffness, 
            'max': maxStiffness, 
        },
        step: stiffnessStep,
        start: [minStiffness,maxStiffness],
        connect:true,
    });

    //Create a function to get all filters and current values:
    function getFilterValues(){
        let myFilter = [
            //Size slider:
            {field:'H [mm]',type:'>',value:sizeSlider.noUiSlider.get()[0]},
            {field:'H [mm]',type:'<',value:sizeSlider.noUiSlider.get()[1]},
            //Strength slider:
            // {field:'H [mm]',type:'>',value:strengthSlider.noUiSlider.get()[0]},
            // {field:'H [mm]',type:'<',value:strengthSlider.noUiSlider.get()[1]},
            //Stiffness slider:
            {field:'σ0,tot /fc',type:'>',value:stiffnessSlider.noUiSlider.get()[0]},
            {field:'σ0,tot /fc',type:'<',value:stiffnessSlider.noUiSlider.get()[1]},
            //checkboxes:
            {field:'Stone masonry typology',type:'in',value:Array.from(checkboxes).filter(i => i.checked).map(i => i.value)}
        ];
        return myFilter;
    }

    //Give the table current filter:
    table.setFilter(getFilterValues());

    //Handling Events:
    //1. Checkboxes:
    checkboxes.forEach(function(checkbox){
        //Apply new filter values to table
        checkbox.addEventListener('change',function(){
            table.clearFilter();
            table.setFilter(getFilterValues());
            });
        });

        let sliders = document.querySelectorAll("div[name=slider]");
        sliders.forEach(function(slider){
            //Apply new filter values to table
            slider.noUiSlider.on('update',function(values,handle){
                table.clearFilter();
                table.setFilter(getFilterValues());
            });
        });
}