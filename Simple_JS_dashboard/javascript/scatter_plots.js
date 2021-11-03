$('.ui.slider')
  .slider()
;

var gridplots = document.getElementById('gridplots');

function iterateCSVs(){
    var divName = [];
    var fileNames = ['data/curve001.csv','data/curve002.csv','data/curve003.csv','data/curve004.csv',
    'data/curve005.csv','data/curve006.csv','data/curve007.csv','data/curve008.csv','data/curve009.csv'];

    for (var i = 0; i<fileNames.length; i++){
        divName.push(fileNames[i].split('/')[1].split('.')[0]);
    }
    const csvData = [fileNames,divName];
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
}

export function createSubPlots(){
    const fileNames = iterateCSVs();
    for (var i = 0; i<fileNames[0].length; i++){
        parseData(createGraph, fileNames[0][i],fileNames[1][i]);
        }
}
