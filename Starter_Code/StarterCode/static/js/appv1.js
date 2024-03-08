// Load data from JSON file
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    var samples = data.samples;

    // Create dropdown menu
    var dropdown = d3.select("#chart")
      .append("select")
      .attr("id", "dropdown");

    dropdown.selectAll("option")
      .data(samples)
      .enter().append("option")
      .attr("value", function(d) { return d.id; })
      .text(function(d) { return d.id; });

    // Initial call to update chart
    updateChart(samples[0].id);

    // Function to update chart based on selected sample ID
    function updateChart(sampleId) {
      var selectedSample = samples.find(function(sample) {
        return sample.id === sampleId;
      });

      var top10SampleValues = selectedSample.sample_values.slice(0, 10);
      var top10OtuIds = selectedSample.otu_ids.slice(0, 10);
      var top10OtuLabels = selectedSample.otu_labels.slice(0, 10);

      // Create horizontal bar chart
      var svg = d3.select("#chart")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

      var barHeight = 30;

      var xScale = d3.scaleLinear()
        .domain([0, d3.max(top10SampleValues)])
        .range([0, 600]);

      var yScale = d3.scaleBand()
        .domain(top10OtuIds.map(function(d) { return "OTU " + d; }))
        .range([0, 300])
        .padding(0.1);

      var bars = svg.selectAll("rect")
        .data(top10SampleValues)
        .enter()
        .append("rect")
        .attr("x", 100)
        .attr("y", function(d, i) { return yScale("OTU " + top10OtuIds[i]); })
        .attr("width", function(d) { return xScale(d); })
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");

      var labels = svg.selectAll("text")
        .data(top10SampleValues)
        .enter()
        .append("text")
        .attr("x", function(d) { return xScale(d) + 105; })
        .attr("y", function(d, i) { return yScale("OTU " + top10OtuIds[i]) + (yScale.bandwidth() / 2) + 5; })
        .text(function(d, i) { return top10OtuLabels[i]; })
        .attr("fill", "white");

      // Update chart when dropdown selection changes
      dropdown.on("change", function() {
        var selectedSampleId = d3.select(this).property("value");
        d3.select("svg").remove(); // Remove previous chart
        updateChart(selectedSampleId);
      });
    }
  });