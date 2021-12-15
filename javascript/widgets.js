import {config} from './config.js';
import {generatePlots} from './browseDBGraphs.js';
import { parCoords } from './overviewDBTab.js';

// This script contains all the items that appear on the Browse DB Tab.
// 1. Tab
// 2. Sliders
// 3. Filter Events
// 4. Clear contents of divs fct.
// 5. Tooltip icon information
// 6. Search bar
// 7. FD/Env/Bilin Curve display buttons

// 1. Table:
export function createTable(data, tableId){
    let table = new Tabulator(tableId,{
        data:data,
        autoColumnsDefinitions:config.tableColumns,
        autoColumns:true,
        pagination:"remote",
    });
    return table;
}

// 2.Slider widgets
export function createSliders(data,tab){
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

    // If tab = 1, then it's the Browse DB tab:
    if(tab==1){
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
}

// 3a. Get all filters and current values:
function getFilterValues(tab){
    let myFilter;
    //1. Checkboxes:
    const typCheckboxes = document.querySelectorAll("input[type=checkbox][name=typ-check]");
    const sizeSlider = document.getElementById("size-slider");
    const sizeSliderMin = {field:'H [mm]',type:'>',value:parseInt(sizeSlider.noUiSlider.get()[0])};
    const sizeSliderMax = {field:'H [mm]',type:'<',value:parseInt(sizeSlider.noUiSlider.get()[1])};
    const typCheckObject = {field:'Typ',type:'in',value:Array.from(typCheckboxes).filter(i => i.checked).map(i => i.value)}

    if(tab==1){
        const ALRSlider = document.getElementById("ALR-slider");
        const shearSlider = document.getElementById("shear-slider");
        const shearSliderMin = {field:'H0/H',type:'>',value:shearSlider.noUiSlider.get()[0]};
        const shearSliderMax = {field:'H0/H',type:'<',value:shearSlider.noUiSlider.get()[1]};
        const ALRSliderMin = {field:'σ0,tot /fc',type:'>',value:ALRSlider.noUiSlider.get()[0]};
        const ALRSliderMax = {field:'σ0,tot /fc',type:'<',value:ALRSlider.noUiSlider.get()[1]};

        myFilter = [sizeSliderMin,
                        sizeSliderMax,
                        shearSliderMin,
                        shearSliderMax,
                        ALRSliderMin,
                        ALRSliderMax,
                        typCheckObject];
    }else if (tab == 0){
        myFilter = [sizeSliderMin, sizeSliderMax, typCheckObject];
        const fittingCheckboxes = document.querySelectorAll("input[type=checkbox][name=fitting-check]");
        const bendCheckboxes = document.querySelectorAll("input[type=checkbox][name=bend-check]");
        const labCheckboxes = document.querySelectorAll("input[type=checkbox][name=lab-check]");
        let bendCheckedArray = [];
        // const fittingCheckObject = {field:'Typ',type:'in',value:Array.from(fittingCheckboxes).filter(i => i.checked).map(i =>i.value)}
        for (let i = 0; i<bendCheckboxes.length; i++){
            if(bendCheckboxes[i].checked == true){
                if(bendCheckboxes[i].value == "0.5"){
                    bendCheckedArray.push({field:'H0/H',type:'=',value:'0.50'})
                }else if(bendCheckboxes[i].value == "1.0"){
                    bendCheckedArray.push({field:'H0/H',type:'>=',value:'0.95'});
                    bendCheckedArray.push({field:'H0/H',type:'<=',value:'1.15'});
                }else if(bendCheckboxes[i].value == '0.25'){
                    bendCheckedArray.push({field:'H0/H',type:'<',value:'0.50'});
                    bendCheckedArray.push({field:'H0/H',type:'>',value:'1.15'});
                }
            }
        }
        myFilter.push(bendCheckedArray);
    }
    return myFilter;
}

// 4b. Assign events to the widgets:
export function filterEvents(tab,tableId){
    let table = Tabulator.findTable(tableId)[0];
    // 1. Checkboxes:
    const checkboxes = document.querySelectorAll("input[type=checkbox][name=typ-check]");
    checkboxes.forEach(function(checkbox){
        checkbox.addEventListener('change',function(){
            table = Tabulator.findTable(tableId)[0];
            //Clear and Apply new filter values to table
            table.clearFilter();
            table.setFilter(getFilterValues(tab));

            if(tab == 1){
                clearBox(document.getElementById('gridplots'));
                //Add first 9 plots to table
                generatePlots(table.getData("active"));
            }else if(tab == 0){
                parCoords(table.getData("active"));
            }
        });
    });

    // 2. Sliders
    let sliders = document.querySelectorAll("div[name=slider]");
    sliders.forEach((slider) => {
        //Apply new filter values to table
        slider.noUiSlider.on('change',()=>{
            table.clearFilter();
            table.setFilter(getFilterValues(tab));

            if(tab == 1){
                clearBox(document.getElementById('gridplots'));
                generatePlots(table.getData("active"));
            }else if(tab == 0){
                parCoords(table.getData("active"));
            }
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
export function curveDisplayButtonEvents(chart,increment){
    let cButtons = document.querySelectorAll("button[name=curveButton]")   
    cButtons.forEach(button => {
        button.addEventListener("click",() => {
            if(button.id == "fd-button"){
                chart.toggle('force');
                
            }else if(button.id == "env-button"){
                chart.toggle('envForce');
                
            } else {
                chart.toggle('bilinForce');
            }
            button.value = parseInt(button.value)+increment;
            
            if(parseInt(button.value) == 9){
                if(button.className == "ui button display"){
                    button.classList.remove("ui","button", "display");
                    button.classList.add("ui","button","hidden")
                }
            }else if (parseInt(button.value) == 18 || parseInt(button.value) == 0){
                if(button.className == "ui button hidden"){
                    button.classList.remove("ui","button", "hidden");
                    button.classList.add("ui","button","display")
                } 
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