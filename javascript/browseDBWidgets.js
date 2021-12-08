import {config} from './config.js';
import {generatePlots} from './browseDBGraphs.js';

// This Script contains all the items that appear on the Browse DB Tab.
// 1. Tab
// 2. Sliders
// 3. Filter Events
// 4. Clear contents of divs fct.
// 5. Tooltip icon information
// 6. Search bar
// 7. FD/Env/Bilin Curve display buttons

// 1. Table:
export function createTable(data){
    let table = new Tabulator('#data-table3',{
        data:data,
        autoColumnsDefinitions:config.tableColumns,
        autoColumns:true,
        pagination:"remote",
    });
    return table;
}

// 2.Slider widgets
export function createSliders(data){
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

// 3a. Get all filters and current values:
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

// 4b. Assign events to the widgets:
export function filterEvents(excelRefData){
    let table = Tabulator.findTable("#data-table3")[0];
    // 1. Checkboxes:
    const checkboxes = document.querySelectorAll("input[type=checkbox][name=check]");
    checkboxes.forEach(function(checkbox){
        checkbox.addEventListener('change',function(){
            table = Tabulator.findTable("#data-table3")[0];
            clearBox(document.getElementById('gridplots'));
            //Clear and Apply new filter values to table
            table.clearFilter();
            table.setFilter(getFilterValues());
            //Add first 9 plots to table
            generatePlots(table.getData("active"),excelRefData);
            });
        });

    // 2. Sliders
    let sliders = document.querySelectorAll("div[name=slider]");
    sliders.forEach((slider) => {
        //Apply new filter values to table
        slider.noUiSlider.on('change',()=>{
            clearBox(document.getElementById('gridplots'));
            table.clearFilter();
            table.setFilter(getFilterValues());
            generatePlots(table.getData("active"),excelRefData);
        });
    });
}

// 4. Clear contents of child divs:
export function clearBox(div) {
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// 5. Tooltip icon:
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


// 6. Search bar:
export function searchBar() {
    let table = Tabulator.findTable("#data-table3")[0];
    const input = document.getElementById("filter");
    input.addEventListener("keyup", function(){
        var filters = [];
        var columns = table.getColumns();
        var search = input.value;

        columns.forEach(function(column){
            filters.push({
                field:column.getField(),
                type:"like",
                value:search,
            });
        });

        table.setFilter([filters]);
    })
}

// 7. Toggle on/off the curves through the buttons:
export function curveDisplayButtonEvents(chart){
    let cButtons = document.querySelectorAll("button[name=curveButton]")   
    cButtons.forEach(button => {
        button.addEventListener("click",() => {
            // let style = getComputedStyle(button);
            // switch (style['background-color']){
            //     case config.fdColor:
            //         chart.toggle('force');
            //         break;
            //     case config.envColor:
            //         chart.toggle('envForce');
            //         break;
            //     case config.bilinColor:
            //         chart.toggle('bilinForce');
            //         break;
            // }
            
            if(button.id == "fd-button"){
                chart.toggle('force');
                
            }else if(button.id == "env-button"){
                chart.toggle('envForce');
                
            } else {
                chart.toggle('bilinForce');
            }
            button.value = parseInt(button.value)+1;
            
            if(parseInt(button.value) == 9){
                button.className =  "ui button hidden";
                
            }else if (parseInt(button.value) == 18){
                button.className = "ui button"   
                if(button.id == "fd-button"){
                    button.backgroundColor = config.fdColor;
                }else if (button.id == "env-button"){
                    button.backgroundColor = config.envColor;
                } else {
                    button.backgroundColor = config.bilinColor;
                }
                button.value = 0;
            }
        });
    });
}