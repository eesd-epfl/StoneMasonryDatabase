function parseData(createGraph){
    Papa.parse('curve001.csv', {
        download: true,
        skipEmptyLines:true,
        header: false,
        complete: function(results){
            console.log(results.data);
            createGraph(results.data);
        }
    });
}

function createGraph(data){
    var force = [];
    var displacement = [];
    
    for (var i = 0; i < data.length; i++){
        if(data[i][0]!='NaN'){
            displacement.push(data[i][0]); //x axis
            force.push(data[i][1]);
        }
    }
    var chart = c3.generate({
        bindto: '#chart',
        data:{
            columns:[displacement]
        },
        axis:{
            x:{
                type:'force',
                categories: force
                
            }
        }
    })
}


parseData(createGraph);