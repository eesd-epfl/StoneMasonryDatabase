
var height = 170;
var parcoords;

export function allPlots(data){
    sizeSlider(data);
    // parCoords(data);
    // plotA(data);
    // plotB(data);
    // plotC(data);
    // plotD(data);
    // plotE(data);
    // plotF(data);
    // plotG(data);
    // plotH(data);
    // plotI(data);
}

function sumTyp(typ,typArray,labSitu,labSituArray){
    let count = 0;
    for (let i = 0; i<typArray.length; i++){
        if(typArray[i]==typ && labSituArray[i].includes(labSitu)){
            count++;
        }
    };
    return count;
}

function parCoords(data){
    parcoords = d3.parcoords()('#parcoords')
    .data(data)
    .render()

}
function plotA(data){
    const laboratoryName = 'Laboratory';
    const inSituName = 'In-situ';
    let typArray = [];
    let labSitu = [];

    // get array with all the typologies and type of data (lab/in-situ):
    for (let i = 0; i< data.length; i++){
        typArray.push(data[i]['Stone masonry typology']);
        labSitu.push(data[i]['Lab / In-situ'])
    };

    //Store the sums of each type in a variable:
    let sumALab = sumTyp('A',typArray,laboratoryName,labSitu);
    let sumASitu = sumTyp('A',typArray,inSituName,labSitu);
    let sumBLab = sumTyp('B',typArray,laboratoryName,labSitu);
    let sumBSitu = sumTyp('B',typArray,inSituName,labSitu);
    let sumCLab = sumTyp('C',typArray,laboratoryName,labSitu);
    let sumCSitu = sumTyp('C',typArray,inSituName,labSitu);
    let sumDLab = sumTyp('D',typArray,laboratoryName,labSitu);
    let sumDSitu = sumTyp('D',typArray,inSituName,labSitu);
    let sumELab = sumTyp('E',typArray,laboratoryName,labSitu);
    let sumESitu = sumTyp('E',typArray,inSituName,labSitu);
    let sumE1Lab = sumTyp('E1',typArray,laboratoryName,labSitu);
    let sumE1Situ = sumTyp('E1',typArray,inSituName,labSitu);

    //Create final array to go in the bar graph:
    let sumLabArray = ['Lab',sumALab,sumBLab,sumCLab,sumDLab,sumELab,sumE1Lab];
    let sumInSituArray = ['In-Situ',sumASitu,sumBSitu,sumCSitu,sumDSitu,sumESitu,sumE1Situ];

    let plotAEl = document.getElementById('plot-a');

    const xAxis = ['A','B','C','D','E','E1'];

    // let plotADom =document.getElementById('plot-a');
    // let myChart = echarts.init(plotADom);
    // let option;

    // option = {
    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'shadow'
    //         },
    //         // formatter: function(params) {
    //             // if(params.encode.y[0]!=0){
    //             //     params.value = params.encode.y[0];
    //             // }
    //         // }
    //     },
    //     legend: {
    //         show:false
    //     },
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //     },
    //     title: {
    //         text:'#Tests per Typology',
    //         left:'center'
    //         // textAlign: 'left'
    //     },
    //     xAxis: [
    //       {
    //           type: 'category',
    //           data: ['A', 'B', 'C', 'D', 'E', 'E1']
    //       }
    //     ],
    //     yAxis: [
    //       {
    //           type: 'value'
    //       }
    //     ],
    //     series: [
    //         {
    //             name: 'Lab A',
    //             type: 'bar',
    //             emphasis: {
    //                 focus: 'series'
    //             },
    //             stack: 'A',
    //             data: [sumALab,0,0,0,0,0]
    //         },
    //         {
    //             name:'Situ A',
    //             type:'bar',
    //             stack:'A',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[sumASitu,0,0,0,0,0]
    //         },
    //         {
    //             name:'Lab B',
    //             type:'bar',
    //             stack:'B',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,sumBLab,0,0,0,0]
    //         },
    //         {
    //             name:'Situ B',
    //             type:'bar',
    //             stack:'B',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,sumBSitu,0,0,0,0]
    //         },
    //         {
    //             name:'Lab C',
    //             type:'bar',
    //             stack:'C',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,sumCLab,0,0,0]
    //         },
    //         {
    //             name:'Situ C',
    //             type:'bar',
    //             stack:'C',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,sumCSitu,0,0,0]
    //         },
    //         {
    //             name:'Lab D',
    //             type:'bar',
    //             stack:'D',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,0,sumDLab,0,0]
    //         },
    //         {
    //             name:'Situ D',
    //             type:'bar',
    //             stack:'D',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,0,sumDSitu,0,0]
    //         },
    //         {
    //             name:'Lab E',
    //             type:'bar',
    //             stack:'E',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,0,0,sumELab,0]
    //         },
    //         {
    //             name:'Situ E',
    //             type:'bar',
    //             stack:'E',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,0,0,sumESitu,0]
    //         },
    //         {
    //             name:'Lab E1',
    //             type:'bar',
    //             stack:'E1',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,0,0,0,sumE1Lab]
    //         },
    //         {
    //             name:'Situ E1',
    //             type:'bar',
    //             stack:'E1',
    //             empahasis:{
    //                 focus: 'series'
    //             },
    //             data:[0,0,0,0,0,sumE1Situ]
    //         },
    //     ]
    // };
    // option && myChart.setOption(option);

    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['Lab A',sumALab,0,0,0,0,0],
                ['Situ A',sumASitu,0,0,0,0,0],
                ['Lab B',0,sumBLab,0,0,0,0],
                ['Situ B',0,sumBSitu,0,0,0,0],
                ['Lab C',0,0,sumCLab,0,0,0],
                ['Situ C',0,0,sumCSitu,0,0,0],
                ['Lab D',0,0,0,sumDLab,0,0],
                ['Situ D',0,0,0,sumDSitu,0,0],
                ['Lab E',0,0,0,0,sumELab,0],
                ['Situ E',0,0,0,0,sumESitu,0],
                ['Lab E1',0,0,0,0,0,sumE1Lab],
                ['Situ E1',0,0,0,0,0,sumE1Situ]
                // sumLabArray,
                // sumInSituArray
            ],
            type: 'bar',
            groups: [
                ['Lab A','Situ A'],
                ['Lab B','Situ B'],
                ['Lab C','Situ C'],
                ['Lab D','Situ D'],
                ['Lab E','Situ E'],
                ['Lab E1','Situ E1'],

                // ['Lab', 'In-Situ']
            ],
        },
        legend:{
            show:false
        },
        tooltip:{
            grouped:false
        },
        axis:{
            x:{
                type:'category',
                categories: xAxis
            }
        }
    });
    plotAEl.append(chart.element);
}

function plotB(data){
    // let plotBEl = document.getElementById('plot-b');
    // const typ = ['A','B','C','D','E','E1'];
    // const hmin = config.hmin;
    // const nBars = config.nBars;
    // let plotData = {};
    // let xAxisTicks = [];

    // const series = (name,type,stack,data) => {
    //     //name = 'A'
    //     //stack = 'Height'
    //     //data = h1A, h2A, h3A, h4A
    //     return {
    //         name:name,
    //         type:type,
    //         stack:stack,
    //         data:data
    //     }
    // }

    // for (let k = 1; k<(nBars+1); k++){
    //     //Create the xAxis ticks
    //     xAxisTicks.push((k-1)*0.25 + hmin);
    // }
    // for (let i = 0; i< typ.length; i++){
    //     plotData[i] = {};
    //     for (j = 0; j< data.length; j++){
    //         if(data[j]['Stone masonry typology']==i){
    //             if(k=nBars){
                    
    //             }
    //             if(data[j]['H [mm]']>1){
    //                 plotData[i]['h1']+=1;
    //             }
    //         }
    //     }
    // }
    //loop through the plotData JSON:

    // series = [series(),series(),series(),series(),series(),series()]
    let plotBEl = document.getElementById('plot-b');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotBEl.append(chart.element);
}
function plotC(data){
    let plotCEl = document.getElementById('plot-c');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotCEl.append(chart.element);
}
function plotD(data){
    let plotDEl = document.getElementById('plot-d');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: { 
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotDEl.append(chart.element);
}

function plotE(data){
    let plotEEl = document.getElementById('plot-e');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotEEl.append(chart.element);
}

function plotF(data){
    let plotFEl = document.getElementById('plot-f');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotFEl.append(chart.element);
}

function plotG(data){
    let plotGEl = document.getElementById('plot-g');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotGEl.append(chart.element);
}

function plotH(data){
    let plotHEl = document.getElementById('plot-h');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotHEl.append(chart.element);
}

function plotI(data){
    let plotIEl = document.getElementById('plot-i');
    // console.log(data);
    // let totA = 
    const yAxis = ['A','B','C','D','E','E1'];
    let  chart = c3.generate({
        size: {
            height:height,
            width: 300
        },
        data: {
            columns: [
                ['data1', -30, 200, 200, 400, -150, 250],
                ['data2', 130, 100, -100, 200, -150, 50],
                ['data3', -230, 200, 200, -300, 250, 250]
            ],
            type: 'bar',
            groups: [
                ['data1', 'data2']
            ]
        },
        title: {
            text:'placeholder'
        },
        grid: {
            y: {
                lines: [{value:yAxis}]
            }
        }

    });
    plotIEl.append(chart.element);
}

function sizeSlider(data){
    let sizeData = data.map(item => item['H [mm]']);
    let minSize = Math.min.apply(null, sizeData),
        maxSize = Math.max.apply(null, sizeData);
    let sizeStep = 1
    let sizeSlider = document.getElementById('overview-size-slider');
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
}