import {config} from './config.js';
import {generatePlots} from './browseDBScatterPlots.js';


//Create table and sliders:
export function createTable(data){
    let table = new Tabulator('#data-table3',{
        data:data,
        autoColumnsDefinitions:config.tableColumns,
        autoColumns:true,
        pagination:"remote",
        // layout:"fitColumns",
        // paginationSize:20,
    });
    table.on("tableBuilt", createSliders(data));
    return table;
}

//Assign events to the widgets:
export function filterEvents(){
    // 1. Checkboxes:
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    checkboxes.forEach(function(checkbox){
        checkbox.addEventListener('change',function(){
            let table = Tabulator.findTable("#data-table3")[0];
            clearBox(document.getElementById('gridplots'));
            //Clear and Apply new filter values to table
            table.clearFilter();
            table.setFilter(getFilterValues());
            //Add first 9 plots to table
            generatePlots(table.getData("active"));
            });
        });

    // 2. Sliders
    let sliders = document.querySelectorAll("div[name=slider]");
    sliders.forEach(function(slider){
        let table = Tabulator.findTable("#data-table3")[0];
        //Apply new filter values to table
        slider.noUiSlider.on('change',function(){
            clearBox(document.getElementById('gridplots'));
            table.clearFilter();
            table.setFilter(getFilterValues());
            generatePlots(table.getData("active"));
        });
    });
}

//Creating the slider widgets
function createSliders(data){
    // Create noUiSliders:

    // 1. Size slider:
    let sizeData = data.map(item => item['H [mm]']);
    let minSize = Math.min.apply(null, sizeData),
        maxSize = Math.max.apply(null, sizeData);
    let sizeSlider = document.getElementById('size-slider');
    noUiSlider.create(sizeSlider, {
        range: {
            'min':minSize, 
            'max': maxSize, 
        },
        step: 50,
        start: [minSize,maxSize],
        tooltips:[true,true],
        connect:true,
        format:{
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0)
        }
    });

    // 2. Shear Span slider:
    let minShear = Math.min.apply(null, data.map(item => item['H0/H'])),
        maxShear = Math.max.apply(null, data.map(item => item['H0/H']));
    let shearStep = 0.1;
    let shearSlider = document.getElementById('shear-slider');
    noUiSlider.create(shearSlider, {
        range: {
            'min':minShear, 
            'max': maxShear, 
        },
        step: shearStep,
        start: [minShear,maxShear],
        tooltips:[true,true],
        connect:true,
    });

    // 3. ALR slider:
    let minALR = Math.min.apply(null, data.filter(item => item['σ0,tot /fc'] != undefined?true:false).map(item => item['σ0,tot /fc'])),
        maxALR = Math.max.apply(null, data.filter(item => item['σ0,tot /fc'] != undefined?true:false).map(item => item['σ0,tot /fc']));
    let ALRStep = 0.05;
    let ALRSlider = document.getElementById('ALR-slider');
    noUiSlider.create(ALRSlider, {
        range: {
            'min':minALR, 
            'max': maxALR, 
        },
        step: ALRStep,
        start: [minALR,maxALR],
        tooltips:[true,true],
        connect:true,
    });
}

//Create a function to get all filters and current values:
function getFilterValues(){
    //1. Checkboxes:
    let checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    let sizeSlider = document.getElementById("size-slider");
    let ALRSlider = document.getElementById("ALR-slider");
    let shearSlider = document.getElementById("shear-slider");
    let myFilter = [
        //Size slider:
        {field:'H [mm]',type:'>',value:parseInt(sizeSlider.noUiSlider.get()[0])},
        {field:'H [mm]',type:'<',value:parseInt(sizeSlider.noUiSlider.get()[1])},
        //Shear slider:
        {field:'H0/H',type:'>',value:shearSlider.noUiSlider.get()[0]},
        {field:'H0/H',type:'<',value:shearSlider.noUiSlider.get()[1]},
        //ALR slider:
        {field:'σ0,tot /fc',type:'>',value:ALRSlider.noUiSlider.get()[0]},
        {field:'σ0,tot /fc',type:'<',value:ALRSlider.noUiSlider.get()[1]},
        //checkboxes:
        {field:'Typ',type:'in',value:Array.from(checkboxes).filter(i => i.checked).map(i => i.value)}
    ];
    return myFilter;
}

export function clearBox(div) {
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

export function tooltip(){
    let tooltipText = document.getElementById("info-tooltip-text");
    let tooltip = document.getElementById("info-tooltip");
    tooltip.onmouseover = function(){
        tooltipText.style.visibility = "visible";
    }
    tooltip.onmouseout = function(){
        tooltipText.style.visibility = "hidden";
    }

}