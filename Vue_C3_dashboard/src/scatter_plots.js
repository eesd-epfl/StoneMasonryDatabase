
fs.readFile('curve001.csv','utf8',function(err,data){
  if(err){
    throw err;
  }
  let btn_upload = document.getElementById('btn-csv').addEventListener('click',()=>{
      console.log('Button clicked')
      Papa.parse(data, {
          header: false,
          complete: function(results){
              console.log(results)
            }
        });
    })
})


onReady('#chart2', function() {
    var chart = c3.generate({
        data: {
            url: 'curve001.csv',
            type: 'scatter'
        },
        axis: {
            y: {
            padding: {
                bottom: 0
            },  
            min: 0
            },
            x: {
            padding: {
                left: 0
            },
            min: 0,
            show: false
            }
      }
    });
  });

  // Set a timeout so that we can ensure that the `chart` element is created.
  function onReady(selector, callback) {
      var intervalID = window.setInterval(function() {
          if (document.querySelector(selector) !== undefined) {
              window.clearInterval(intervalID);
              callback.call(this);
            }
        }, 500);
    }
