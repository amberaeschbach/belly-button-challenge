// setting url to constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//fetching the json data
d3.json(url).then(function(data) {
    console.log(data);
});

// initialize the dashboard 
function init() {

    // use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // setting sample names
        let names = data.names;

        // adding sample names to the menu
        names.forEach((id) => {

            // logging the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // setting the first sample from the list
        let sample_one = names[0];

        // log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

// the function that populates metadata info
function buildMetadata(sample) {

    // use D3 to retrieve the data
    d3.json(url).then((data) => {

        // retrieve all metadata
        let metadata = data.metadata;

        // filter
        let value = metadata.filter(result => result.id == sample);

        // log the array of metadata objects after the have been filtered
        console.log(value)

        // get the first index from the array
        let valueData = value[0];

        // clear metadata
        d3.select("#sample-metadata").html("");

        // using Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // log the individual key/value pairs 
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// the function that builds bar chart
function buildBarChart(sample) {

    // use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // retrieve sample data
        let sampleInfo = data.samples;

        // filter
        let value = sampleInfo.filter(result => result.id == sample);

        // get the first index from the array
        let valueData = value[0];

        // getting the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // set top ten to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// the function that builds the bubble chart
function buildBubbleChart(sample) {

    // use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // retrieve sample data
        let sampleInfo = data.samples;

        // filter
        let value = sampleInfo.filter(result => result.id == sample);

        // get the first index from the array
        let valueData = value[0];

        // get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // setting up layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // call plotly
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// the function that updates dashboard when sample is changed
function optionChanged(value) { 

    // log the new value
    console.log(value); 

    // call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// call the initialize function
init();