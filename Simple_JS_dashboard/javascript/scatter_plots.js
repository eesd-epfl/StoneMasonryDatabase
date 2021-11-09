import {config} from '/javascript/config.js';
let gridplots = document.getElementById('gridplots');

export function createSubPlots(data){

    //1. Randomize array

    //2. Paginate full randomized array --> Check w/ Charlie if this should only be done on initial load.

    //3. Plot first 6 elements of array

    //4. On paginate next, empty and plot next 6
    const fileNames = iterateCSVs(data);
    for (let i = 0; i<fileNames[0].length; i++){
        parseData(createGraph, fileNames[0][i],fileNames[1][i]);
        }
        

}
function iterateCSVs(data){
    //Empty grid plot div container before starting:
    function clearBox(div) {
        while(div.firstChild) {
            div.removeChild(div.firstChild);
            console.log("hi")
        }
    }
    clearBox(gridplots);

    let divName = [];
    // let selectedCurvesFilePaths = ['data/curve001.csv','data/curve002.csv','data/curve003.csv','data/curve004.csv',
    // 'data/curve005.csv','data/curve006.csv','data/curve007.csv','data/curve008.csv','data/curve009.csv'];

    let activePlotData = data;
    let selectedCurvesFilePaths = [];

    //Testing loop:
    for (let i = 0; i<10; i++){
    // for (let i = 0; i<activePlotData.length; i++){
        if(activePlotData[i]['ID']>99){
            selectedCurvesFilePaths.push("data/curve"+activePlotData[i]['ID'] + ".csv");
        } else if (activePlotData[i]['ID']>9){
            selectedCurvesFilePaths.push("data/curve0"+ activePlotData[i]['ID']+ ".csv");
        } else{
            selectedCurvesFilePaths.push("data/curve00"+ activePlotData[i]['ID'] + ".csv"); 
        }
     }
    for (let i = 0; i<selectedCurvesFilePaths.length; i++){
        divName.push(selectedCurvesFilePaths[i].split('/')[1].split('.')[0]);
    }
    const csvData = [selectedCurvesFilePaths,divName];
    return csvData;
}

function parseData(createGraph,file,divName){
    Papa.parse(file, {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(results){
            createGraph(results.data,divName);
        }
    });
}

function createGraph(data,divName){
    let force = [];
    let displacement = [];
    let title = data[0][1];
    data[2][0] = 'top. disp. [mm]'
    data[2][1] = 'hor. force [kN]'

    for (let i = 2; i < data.length; i++){
        if((data[i][0]!='NaN' && data[i][1]!='NaN') && data[i][0]!='[mm]'){
            displacement.push(data[i][0]); //x axis
            force.push(data[i][1]); //y axis
        }
    }
    // console.log(data);
    let chart = c3.generate({
        bindto: '#'+divName,
        data:{
            names: {
                x: 'horizontal force'
            },
            x:displacement[0],
            columns:[displacement,force],
            type: 'scatter',
        },
        title:{
            text:title,
            position:"top-center"
        },
        axis:{
            y:{
                label:'hor. force [kN]',
                
            },
            x:{
                label: 'top. disp. [mm]',
                tick:{
                    format:function (x) {return x.toFixed()},
                    culling:{
                        max:4
                    },
                    fit:true,
                    count:3
                },
            }
        },
        legend: {
            hide:true
        },
        tooltip:{
            format: {
                title: function (x) {return 'displ. value: ' + x},
            }
        }
    })
    let newDiv = document.createElement('div');
    newDiv.id = divName;
    newDiv.className = "five wide column"
    newDiv.append(chart.element);
    gridplots.append(newDiv);
    $("#gridplots").pagify(6, ".five.wide.column");
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
			this.items.hide();
			let base = this.perPage * this.currentPage;
			this.items.slice(base, base + this.perPage).show();

			this.updateNavigation();
		},
		init: function(container, items, perPage) {
			this.container = container;
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
			perPage = 3;
		}

		// don't fire if fewer items than perPage
		if (items.length <= perPage) {
			return true;
		}

		pagify.init(el, items, perPage);
	};
})(jQuery);
