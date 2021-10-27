  
  onReady('#chart', function() {
    var chart2 = c3.generate({
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
              ]
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
