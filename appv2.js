// Load data from JSON file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and perform operations
d3.json(url).then(function(data) {
    console.log(data); // Logging the data to the console

    var names = data.names;

    // Populate dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    names.forEach(function(name) {
        dropdownMenu.append("option").text(name).property("value", name);
    });

    // Define the optionChanged function so you can switch and graphs will update with selection
    function optionChanged(selectedID) {
        var samples = data.samples.filter(sample => sample.id === selectedID)[0];
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
        var otuIDs = samples.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
        var otuLabels = samples.otu_labels.slice(0, 10).reverse();

        // Horizontal bar chart
        var traceBar = {
            x: sampleValues,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        var layoutBar = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bar", [traceBar], layoutBar);

        // Bubble chart
        var traceBubble = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: 'markers',
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: 'Viridis',
                colorbar: {
                    title: 'OTU IDs'
                }
            },
            text: samples.otu_labels,
            hoverinfo: 'text'
        };

        var layoutBubble = {
            title: 'Bubble Chart of Sample OTUs',
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' }
        };

        Plotly.newPlot('bubble', [traceBubble], layoutBubble);

        // Display sample metadata
        var metadata = data.metadata.filter(item => item.id == selectedID)[0];
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html(""); // Clear existing metadata

        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    }

    // Initial plot
    var selectedID = names[0];
    optionChanged(selectedID);

    // Event listener for dropdown menu change
    d3.select("#selDataset").on("change", function() {
        var selectedID = d3.select(this).property("value");
        optionChanged(selectedID);
    });
}).catch(function(error) {
    console.error('Error loading data:', error);
});




