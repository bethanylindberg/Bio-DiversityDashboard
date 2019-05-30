function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  d3.json('../data/samples.json').then((incomingData) => {
    let metadata = []
    metadata = incomingData.metadata;
    // Use d3 to select the panel with id of `#sample-metadata`
    let metaPanel = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    metaPanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    data = metadata.filter(subject => subject.id === parseInt(sample))[0];
    Object.entries(data).forEach(([key,value])=>{
      metaPanel.append('h5').text(`${key}: ${value}`);
    });
  });
} 

function buildCharts(sample) {
  //Use `d3.json` to fetch the sample data for the plots
  
  d3.json('../data/samples.json').then((incomingData) => {
    sampleIndex = incomingData.names.indexOf(sample);
    let otuIds = incomingData.samples[sampleIndex].otu_ids.slice(0,10).reverse();
    otuIds = otuIds.map(function(e) {return 'OTU ' + e});
    let sampleValues = incomingData.samples[sampleIndex].sample_values.slice(0,10).reverse();
    let otuLabels = incomingData.samples[sampleIndex].otu_labels.slice(0,10).reverse();
    //Build a Bar Chart slice() to grab the top 10 sample_values, otu_ids and labels (10 each).
    var trace1 = {
      x: sampleValues,
      y: otuIds,
      type: 'bar',
      text: otuLabels,
      orientation:'h',
      marker: {
        color: 'rgb(78,179,211)'
      }
    };
    
    var data = [trace1];
    
    var layout = {
      showlegend: false,
      xaxis: {
        title:"OTU Value",
        tickangle: 0
      },
      yaxis: {
        title:"OTU Label",
        zeroline: false,
        gridwidth: 12
      },
      bargap :0.25,
      height:350,
      margin:{
        l: 100,
        r: 50,
        t: 20,
        b: 50
      }
    };
    
    Plotly.newPlot('bar', data,layout,{responsive: true});

  });

  //Build a Bubble Chart using the sample data
  d3.json('../data/samples.json').then((incomingData) => {
    sampleIndex = incomingData.names.indexOf(sample);
    let otuIds = incomingData.samples[sampleIndex].otu_ids;
    let sampleValues = incomingData.samples[sampleIndex].sample_values;
    let otuLabels = incomingData.samples[sampleIndex].otu_labels;

    var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale='Viridis',
        //setting 'sizeref' to lower than 1 decreases the rendered size
        sizeref: .1,
        sizemode: 'area'
    }
  };

  var data = [trace1];

  var layout = {
    showlegend: false,
    xaxis: {
      title:"OTU Label",
      tickangle: 0
    },
    yaxis: {
      title:"OTU Value",
      zeroline: true,
    },
    height: 350,
    width: 800,
    margin:{
      l: 100,
      r: 50,
      t: 20,
      b: 100
    }
  };

  Plotly.newPlot('bubble', data, layout);

  window.onresize = function() {
    Plotly.relayout('bubble', {
      width: 0.3 * window.innerWidth,
      height: 0.3 * window.innerHeight
    })
  }

  });

  // buildGauge(data.WFREQ);
  d3.json('../data/samples.json').then((incomingData) => {
    let metadata = []
    metadata = incomingData.metadata;
    // frequency
    let frequency = metadata.filter(subject => subject.id === parseInt(sample))[0].wfreq;
    // Set the level
    let level = frequency;

    // Trig to calc meter point
    var degrees = 9 - level,
        radius = .6;
    var radians = degrees * Math.PI / 9;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'frequency',
        text: level,
        hoverinfo: 'name+text'},
      { values: [81/9,81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
      rotation: 90,
      text: ['8-9','7-8','6-7','5-6','4-5','3-4', '2-3','1-2','0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgb(8,64,129)','rgb(8,104,172)','rgb(43,140,190)', 'rgb(78,179,211)','rgb(123,204,196)', 
       'rgb(168,221,181)','rgb(204,235,197)','rgb(224,243,219)','rgb(247,252,240)',"white"]},
      labels: ['8-9','7-8','6-7','5-6','4-5','3-4', '2-3','1-2','0-1'],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      height: 380,
      width: 550,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      margin:{
        l: 0,
        r: 0,
        t: 0,
        b: 0
      }
    };

    Plotly.newPlot('guage', data, layout, {responsive: true});
    });


}

function init() {
  // Grab a reference to the dropdown select element
  let dropdown = document.getElementById('selDataset');
  dropdown.length = 0;
  // Get names from data
  d3.json('../data/samples.json').then(function(data) {  
          let names = []
          let option;
          names = data.names;
        // Use the list of sample names to populate the select options
        for (let i = 0; i < names.length; i++) {
            option = document.createElement('option');
            option.text = names[i];
            option.value = names[i];
            dropdown.add(option);
          }   
        // Use the first sample from the list to build the initial plots
          const firstSample = names[0];
          buildCharts(firstSample);
          buildMetadata(firstSample);
        });  
  console.log("Application initiated")
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();