// Wrap your code in a function to ensure scope for data
function createChartsAndMetadata(data) {
    // Process the data and populate the dropdown
    var dropdown = d3.select("#selDataset");
    var subjectIds = data.names;
    subjectIds.forEach(function(subjectId) {
        dropdown.append("option").attr("value", subjectId).text(subjectId);
    });

    // Function to update the chart
    function updateChart(selectedSubjectId) {
        // Retrieve the data for the selected subjectId
        var selectedData = data.samples.find(entry => entry.id === selectedSubjectId);
        var sampleValues = selectedData.sample_values.slice(0, 10);
        var otuIds = selectedData.otu_ids.slice(0, 10);
        var otuLabels = selectedData.otu_labels.slice(0, 10);

        // Create the horizontal bar chart
        var trace = {
            type: "bar",
            orientation: "h",
            x: sampleValues,
            y: otuIds.map(otuId => `OTU ${otuId}`),
            text: otuLabels
        };
        var layout = {
            title: `Top 10 OTUs for Subject ${selectedSubjectId}`,
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };
        Plotly.newPlot("bar", [trace], layout);
    }

    // Initialize the chart with the first subjectId
    updateChart(subjectIds[0]);

    // Listen for dropdown changes and update the chart and metadata accordingly
    dropdown.on("change", function() {
        var selectedSubjectId = dropdown.property("value");
        updateChart(selectedSubjectId);
        displayMetadata(selectedSubjectId, data); // Pass data to the function
    });

    // Function to display sample metadata
    function displayMetadata(selectedSubjectId, data) {
        // Retrieve the metadata for the selected subjectId
        var selectedMetadata = data.metadata.find(metadata => metadata.id === +selectedSubjectId);

        // Clear the previous metadata content
        var metadataContainer = d3.select("#sample-metadata");
        metadataContainer.html("");

        // Append each key-value 
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataContainer.append("p").text(`${key}: ${value}`);
        });
    }

    // Function to create a bubble chart
    function createBubbleChart(selectedSubjectId) {
        // Retrieve the data for the selected subjectId
        var selectedData = data.samples.find(entry => entry.id === selectedSubjectId);

        var otuIds = selectedData.otu_ids;
        var sampleValues = selectedData.sample_values;
        var otuLabels = selectedData.otu_labels;

        var trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Viridis',
                showscale: true
            }
        };

        var layout = {
            title: `Bubble Chart for Subject ${selectedSubjectId}`,
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' }
        };

        Plotly.newPlot('bubble', [trace], layout);
    }

    // Call the createBubbleChart function to create the initial chart
    createBubbleChart(subjectIds[0]);
}

// Fetch data from the provided JSON URL and call createChartsAndMetadata when data is available
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    createChartsAndMetadata(data);
});
