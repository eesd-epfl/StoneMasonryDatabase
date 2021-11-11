import {createDivPagination} from '/javascript/scatter_plots.js';
// import {paginatePlot} from '/javascript/scatter_plots.js';

export function dataTable(inputFilePath, excelColumns, callback) {
    let tableData;
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
                let data = ProcessExcel(e.target.result,excelColumns);
                createTable(data);
                preparePlot(data);
            };
            reader.readAsBinaryString(file);
        } 
        else {
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
    return filtered;
    //Create table in next function:
    // createTable(filtered);
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

    table.on("tableBuilt", createWidgets(data));
}

export function createWidgets(data){
    // let table = Tabulator.findTable('#data-table3')[0];

    //Initializing objects:

    //2. Sliders:
    //Size slider:
    let sizeData = data.map(item => item['H [mm]']);
    let minSize = Math.min.apply(null, sizeData),
        maxSize = Math.max.apply(null, sizeData);
    let sizeStep = 1
    let sizeSlider = document.getElementById('size-slider');
    noUiSlider.create(sizeSlider, {
        range: {
            'min':1000, 
            'max': maxSize, 
        },
        step: sizeStep,
        start: [minSize,maxSize],
        tooltips:[true,true],
        connect:true,
    });

    //Strength slider:
    // let minStrength = Math.min.apply(null, data.map(item => item['H [mm]'])),
    //     maxStrength = Math.max.apply(null, data.map(item => item['H [mm]']));
    // let stengthStep = 1;
    // let strengthSlider = document.getElementById('strength-slider');
    // noUiSlider.create(strengthSlider, {
    //     range: {
    //         'min':minStrength, 
    //         'max': maxStrength, 
    //     },
    //     step: stengthStep,
    //     start: [minStrength,maxStrength],
    //     tooltips:[true,true],
    //     connect:true,
    // });

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
        tooltips:[true,true],
        connect:true,
    });
}
//Create a function to get all filters and current values:
function getFilterValues(){
    //1. Checkboxes:
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    let sizeSlider = document.getElementById("size-slider");
    let stiffnessSlider = document.getElementById("stiffness-slider");
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

export function filterEvents(){
    //1. Checkboxes:
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    checkboxes.forEach(function(checkbox){
        checkbox.addEventListener('change',function(){
            let table = Tabulator.findTable("#data-table3")[0];
            clearBox(document.getElementById('gridplots'));
            //Clear and Apply new filter values to table
            table.clearFilter();
            table.setFilter(getFilterValues());
            //Add first 9 plots to table
            preparePlot(table.getData("active"));
            });
        });
    let sliders = document.querySelectorAll("div[name=slider]");
    sliders.forEach(function(slider){
        //Apply new filter values to table
        slider.noUiSlider.on('slide',function(){
            clearBox(document.getElementById('gridplots'));
            table.clearFilter();
            table.setFilter(getFilterValues());
            preparePlot(table.getData("active"));
        });
    });
}

function preparePlot(data){
    createDivPagination(data.filter(item => item['Availability of F-Δ curve']=='1'?true:false));
}

function clearBox(div) {
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}