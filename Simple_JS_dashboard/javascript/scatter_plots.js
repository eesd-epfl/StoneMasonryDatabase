var gridplots = document.getElementById('gridplots');


function iterateCSVs(){
    let divName = [];
    let selectedCurvesFilePaths = ['data/curve001.csv','data/curve002.csv','data/curve003.csv','data/curve004.csv',
    'data/curve005.csv','data/curve006.csv','data/curve007.csv','data/curve008.csv','data/curve009.csv'];

    // let activePlotData = table.searchData("Availability of F-Δ curve");
    // let plotArray = [];
    // for (let i = 0; i<activePlotData.length; i++){
    //     if(activePlotData[i]['Availability of F-Δ curve']!=0){
    //         if(activePlotData[i]['ID']>99){
    //             plotArray.push("data/curve"+str(i)+".csv");
    //         } else if (activePlotData[i]['ID']>9){
    //             plotArray.push("data/curve0"+ str(i)+ ".csv");
    //         } else{
    //             plotArray.push("data/curve00"+ str(i)+ ".csv"); 
    //         }
    //     }
    // }

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
    var force = [];
    var displacement = [];
    for (var i = 2; i < data.length; i++){
        if((data[i][0]!='NaN' && data[i][1]!='NaN') && data[i][0]!='[mm]'){
            displacement.push(data[i][0]); //x axis
            force.push(data[i][1]); //y axis
        }
    }
    var chart = c3.generate({
        bindto: '#'+divName,
        data:{
            x:displacement[0],
            columns:[force,displacement],
            type: 'scatter',
        },
        axis:{
            y:{
                label:'top displacement',
                
            },
            x:{
                label:'horizontal force'
            }
        }
    })
    var newDiv = document.createElement('div');
    newDiv.id = divName;
    newDiv.className = "five wide column"
    newDiv.append(chart.element);
    gridplots.append(newDiv);
    $("#gridplots").pagify(3, ".five.wide.column");
}

export function createSubPlots(){
    const fileNames = iterateCSVs();
    for (var i = 0; i<fileNames[0].length; i++){
        parseData(createGraph, fileNames[0][i],fileNames[1][i]);
        }
        

}

(function($) {
	var pagify = {
		items: {},
		container: null,
		totalPages: 1,
		perPage: 3,
		currentPage: 0,
		createNavigation: function() {
			this.totalPages = Math.ceil(this.items.length / this.perPage);

			$('.pagination', this.container.parent()).remove();
			var pagination = $('<div class="pagination"></div>').append('<a class="nav prev disabled" data-next="false"><</a>');

			for (var i = 0; i < this.totalPages; i++) {
				var pageElClass = "page";
				if (!i)
					pageElClass = "page current";
				var pageEl = '<a class="' + pageElClass + '" data-page="' + (
				i + 1) + '">' + (
				i + 1) + "</a>";
				pagination.append(pageEl);
			}
			pagination.append('<a class="nav next" data-next="true">></a>');

			this.container.after(pagination);

			var that = this;
			$("body").off("click", ".nav");
			this.navigator = $("body").on("click", ".nav", function() {
				var el = $(this);
				that.navigate(el.data("next"));
			});

			$("body").off("click", ".page");
			this.pageNavigator = $("body").on("click", ".page", function() {
				var el = $(this);
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

			var pages = $(".pagination .page");
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
			var base = this.perPage * this.currentPage;
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
		var el = $(this);
		var items = $(itemSelector, el);

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
