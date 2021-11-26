import { createCSVArray, parseData, parseEnvelopeData } from "./browseDBCSVHandling.js";
import { config } from "./config.js";

let gridplots = document.getElementById('gridplots');

//Final function.
export function generatePlots(data){

    //Create array with filepaths and filenames:
    const fileNames = createCSVArray(data);
    //Create empty divs that will be paginated (hide all except 9):
    for (let i = 0; i<fileNames[0].length; i++){
        let newDiv = document.createElement('div');
        newDiv.id = fileNames[1][i];
        newDiv.className = "five wide column"
        gridplots.append(newDiv);
    }
    $("#gridplots").pagify(9, ".five.wide.column");
}

//Create the plot:
export function createGraph(data,divId,fileId){
    let testUnitName;
    const table = Tabulator.findTable('#data-table3')[0];
    const tableData = table.getData('active');

    if(divId.includes('fdCurve')){
        testUnitName = data[0][1].replaceAll('.','').replaceAll('-','').replaceAll(' ','');
        
    }else{
        testUnitName = divId.split('_')[0];
    }

    // Make this a function in browseDBCSVHandling
    const excelRowData = tableData.filter(row => row['Name'].replaceAll('.','').replaceAll('-','').replaceAll(' ','').replaceAll('#','') === testUnitName);
    
    const bilinDrift = ['bilinDrift',(0-excelRowData[0]['du,- [%]']),(0-excelRowData[0]['dy,- [%]']),'0',excelRowData[0]['dy,+ [%]'], excelRowData[0]['du,+ [%]']];
    const bilinForce = ['bilinForce',(0-excelRowData[0]['Vu,- [kN]']),(0-excelRowData[0]['Vu,- [kN]']), '0', excelRowData[0]['Vu,+ [kN]'],excelRowData[0]['Vu,+ [kN]']];
    let reducedData = data.slice(0,3);
    let remainingRows = data.slice(3,data.length);

    // Reduce the number of points to plot according to total # of points in csv file:
    if (data.length > 100000){
        for (let i = 0; i<data.length; i += 1000){
            reducedData.push(remainingRows[i]);
        }
    }
    else if(data.length > 10000){
        for (let i = 0; i<data.length; i += 100){
            reducedData.push(remainingRows[i]);
        }
    }
    else if (data.length > 1000){
        for (let i = 0; i<data.length; i += 10){
            reducedData.push(remainingRows[i]);
        }
    }else {
        for (let i = 0; i < data.length; i++){
            reducedData.push(remainingRows[i]);
        }
    }
    let force = ["force"];
    let drift = ["drift"];
    let title = reducedData[0][1];
    reducedData[2][2] = 'drift [%]'
    reducedData[2][1] = 'hor. force [kN]'
    for (let i = 4; i < reducedData.length-3; i++){
        if((reducedData[i][2]!='NaN' && reducedData[i][1]!='NaN') && reducedData[i][2]!='[%]'){
            drift.push(reducedData[i][2]); //x axis
            force.push(reducedData[i][1]); //y axis
        }
    }

    // Getting min and max X values for ticks:
    let maxX = Math.max(...drift.slice(1));
    let minX = Math.min(...drift.slice(1));

    let maxXTickValue = 0;
    let minXTickValue = 0;
    
    if(Math.abs(minX)>maxX){
        maxXTickValue = Math.ceil(Math.abs(minX));
        minXTickValue = 0 - Math.ceil(Math.abs(minX));
        
    }else {
        maxXTickValue = Math.ceil(maxX);
        minXTickValue = 0 - Math.ceil(maxX);
    }

    // Getting min and max Y values for ticks:
    let maxY = Math.max(...force.slice(1));
    let minY = Math.min(...force.slice(1));
    
    let maxYTickValue = 0;
    let minYTickValue = 0;

    if(Math.abs(minY)>maxY){
        maxYTickValue = Math.ceil(Math.abs(minY));
        minYTickValue = 0 - Math.ceil(Math.abs(minY));
        
    }else {
        maxYTickValue = Math.ceil(maxY);
        minYTickValue = 0 - Math.ceil(maxY);
    }
    let chart = c3.generate({
        transition: {
            duration:500
        },
        padding: {
            left: 25,
            right: 30
        },
        data:{
            names: {
                x: 'horizontal force'
            },
            xs: {
                'force':'drift',
                'bilinForce':'bilinDrift',
                'envForce':'envDrift'
            },
            columns:[drift,force,bilinDrift,bilinForce],
            // type: 'scatter',
            xSort: false
        },
        point: {
            show: false   
        },
        title:{
            text:title,
            position:"top-center"
        },
        axis:{
            y:{
                padding:{
                    top:10,
                    bottom:10
                },
                label:'hor. force [kN]',
                tick: {
                    fit:true,
                },
                culling:{
                    max:4
                },
                count:4,
                min:minYTickValue,
                max:maxYTickValue,
            },
            x:{
                label: 'drift [%]',
                tick:{
                    format:function (x) {return x.toFixed()},
                    culling:{
                        max:2
                    },
                    centered:true,
                    fit:true,
                    count:4,
                    values:[minXTickValue,0,maxXTickValue]
                },
                min:minXTickValue,
                max:maxXTickValue
            }
        },
        legend: {
            position:'right'
            // hide:true
        },
        tooltip:{
            format: {
                title: function (x) {return 'drift value: ' + x},
            }
        }
    })
    parseEnvelopeData(chart, fileId);

    //Append chart element to the div that has its Id (e.g. curve001):§
    document.getElementById(divId).append(chart.element);
}

//Pagination Function:
(function($) {
	let pagify = {
		items: {},
		container: null,
		totalPages: 1,
		perPage: 3,
		currentPage: 0,
		createNavigation: function() {
			this.totalPages = Math.ceil(this.items.length / this.perPage);

			$('.pagination', this.container.parent()).remove();
			let pagination = $('<div class="pagination"></div>').append('<a class="nav prev disabled" data-next="false"><</a>');

			for (let i = 0; i < this.totalPages; i++) {
				let pageElClass = "page";
				if (!i)
					pageElClass = "page current";
				const pageEl = '<a class="' + pageElClass + '" data-page="' + (
				i + 1) + '">' + (
				i + 1) + "</a>";
				pagination.append(pageEl);
			}
			pagination.append('<a class="nav next" data-next="true">></a>');
			this.container.after(pagination);

			let that = this;
			$("body").off("click", ".nav");
			this.navigator = $("body").on("click", ".nav", function() {
				let el = $(this);
				that.navigate(el.data("next"));
			});

			$("body").off("click", ".page");
			this.pageNavigator = $("body").on("click", ".page", function() {
				let el = $(this);
				that.goToPage(el.data("page"));
			});
		},
		navigate: function(next) {
			// default perPage to 5
			if (isNaN(next) || next === undefined) {
				next = true;
			}
			$(".pagination .nav").removeClass("disabled");
			if (next) {
				this.currentPage++;
				if (this.currentPage > (this.totalPages - 1))
					this.currentPage = (this.totalPages - 1);
				if (this.currentPage == (this.totalPages - 1))
					$(".pagination .nav.next").addClass("disabled");
				}
			else {
				this.currentPage--;
				if (this.currentPage < 0)
					this.currentPage = 0;
				if (this.currentPage == 0)
					$(".pagination .nav.prev").addClass("disabled");
				}

			this.showItems();
		},
		updateNavigation: function() {

			let pages = $(".pagination .page");
			pages.removeClass("current");
			$('.pagination .page[data-page="' + (
			this.currentPage + 1) + '"]').addClass("current");
		},
		goToPage: function(page) {

			this.currentPage = page - 1;

			$(".pagination .nav").removeClass("disabled");
			if (this.currentPage == (this.totalPages - 1))
				$(".pagination .nav.next").addClass("disabled");

			if (this.currentPage == 0)
				$(".pagination .nav.prev").addClass("disabled");
			this.showItems();
		},
		showItems: function() {
            let divArray = Array.from(gridplots.children)
            for (let i = 0; i<divArray.length; i++){
                let myDivNode = document.getElementById(divArray[i].id)
                while (myDivNode.firstChild){
                    myDivNode.removeChild(myDivNode.lastChild);
                }
            }
            for (let i = (this.currentPage*this.perPage); i < (this.currentPage+1)*this.perPage; i++){
                let fileName = divArray[i].id
                let filePath = config.curvesFolderPath+ "FD_"+fileName + ".csv"
                parseData(createGraph,filePath,fileName,fileName);
                if(i==divArray.length-1){
                    i+= 10;
                }
            }
            this.items.hide();
			let base = this.perPage * this.currentPage;
			this.items.slice(base, base + this.perPage).show();
			this.updateNavigation();
		},
		init: function(container, items, perPage) {
			this.container = $("#pagination");
			this.currentPage = 0;
			this.totalPages = 1;
			this.perPage = perPage;
			this.items = items;
			this.createNavigation();
			this.showItems();
		}
	};

	// stuff it all into a jQuery method!
	$.fn.pagify = function(perPage, itemSelector) {
		let el = $(this);
		let items = $(itemSelector, el);

		// default perPage to 5
		if (isNaN(perPage) || perPage === undefined) {
			perPage = 9;
		}

		// don't fire if fewer items than perPage
		// if (items.length <= perPage) {
		// 	return true;
		// }

		pagify.init(el, items, perPage);
	};
})(jQuery);
