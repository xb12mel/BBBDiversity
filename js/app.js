function showPlots(id){
    d3.json('./samples.json').then((data)=> {
        var samples = data.samples.filter(sample => sample.id.toString()===id)[0];
        // console.log(samples)
        var sample_values = samples.sample_values.slice(0, 10)
            .reverse();
        var wash = data.metadata.map(wash => wash.wfreq)
        // console.log(wash)
                  
        var Top10otu = (samples.otu_ids.slice(0, 10)).reverse();
        // console.log(Top10otu)
        var otu_labels = samples.otu_labels.slice(0,10);
        // console.log(otu_labels)
        var otu_ids = newFunction(Top10otu)
       
        // set up the Plotly horizontal bar chart for the Top 10 OTUs.
        var trace1 = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            marker: {
                color: "rgb(55,122,183)"},
                type: "bar",
                orientation: "h",
            
        };

        var data = [trace1];

        // set up the Plotly to set layout
        var layout ={
            title: "Ten most Operational Taxonomic Units (OTU)",
            yaxis:{tickmode: "linear"},
            margin:{ l:100, r:100, t:100, b:50 }
        };

        // show bar plot
        Plotly.newPlot("bar", data, layout);

        // create a bubble chart to display each example
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode:'markers',
            marker:{
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text:samples.otu_labels
        };
        var data2 = [trace2];

        var layout2 = {
            xaxis:{
                title:"Samples"},
            height: 480,
            width: 640
        };
        
        Plotly.newPlot('bubble', data2, layout2);

        //display each key-value pair from the metadata JSON object on the page.
        var data3 = [
            {
                domain: {x:[0,1], y: [0,1]},
                title:{ text: "Belly Button Washing Frequency"},
                value: parseFloat(wash),
                type: "indicator",            
                mode: "guage+number+delta",
                delta: {reference: 9},  
                    gauge: {
                        axis: {range: [null, 9]},
                        bgcolor: "white",
                        bordercolor: "gray",
                    steps: [
                        {range:[0,1], color: "red"},
                        {range:[2,3], color:"orange"},
                        {range:[3,5], color: "yellow"},
                        {range:[5,7], color: "lime green"},
                        {range:[7,9], color: "green"},
                    ],
                    threshold: {
                        line:{color: "red", width: 4},
                        thickness: 0.75,
                        value: 9
                    }
                }
            }
          
        ];

        // var trace3 =[data3]
        var layout3 = {
            width: 700, 
            height: 600,
            margin: { l:75, r:250,t:50, b:50}
          };
        Plotly.newPlot('gauge', data3, layout3);
      });

    function newFunction(Top10otu){
        return Top10otu.map(d => "OTU " + d);
    }
  }
// Display individual demographic info card.
function infoCard(id){
    d3.json("./samples.json").then((data) =>{

        //grab infr from samples
        var metadata = data.metadata;

        //use selected id to filter data info card
        var filtered = metadata.filter(info => info.id.toString() === id)[0];

        var demographicInfo = d3.select('#sample-metadata');

        //reset the card for new info 
        demographicInfo.html("");

        //append new info based on selected id and write it to the page.
        Object.entries(filtered).forEach((key) =>{
            demographicInfo.append('h5').text(key[0].toString() + ":" +key[1] + "\n");
        });
    
    });
}

// set up listner to handle events on the page
function optionChanged(id){
    showPlots(id);
    infoCard(id);
}
// render data function
function init(){
    var dropdown = d3.select('#selDataset');
    d3.json('./samples.json').then((data) => {
        // console.log(data)
        data.names.forEach(function(name){
            dropdown.append("option").text(name).property("value");
        });

        showPlots(data.names[0]);
        infoCard(data.names [0]);
    });
}
init();