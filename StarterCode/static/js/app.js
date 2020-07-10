  
// Import data
d3.json("samples.json").then(data =>{

    // Create Dropdown
    var dropdown = d3.select("#selDataset")
    data.names.forEach(entry =>{
        dropdown.append('option').attr('value', entry).text(entry).property('value')
    })
        
    

    
    function updatePage(meta, samp) {
        var sampleData = d3.select("#sample-metadata")
        sampleData.html("")
        Object.entries(meta).forEach(function([key, value]) {
            sampleData.append('p').text(`${key}:${value}`)
            
        })

        // x values
        var xBar = samp.sample_values.slice(0,10).reverse()
        
        // y values
        var yBar = samp.otu_ids.slice(0,10).reverse().map(d => "OTU " + d)
        
        // text values
        var textBar = samp.otu_labels.slice(0,10).reverse()

        // Bar Chart
        var barData = {
           x: xBar,
           y: yBar,
           text: textBar,
           marker: {
               color: 'darkGreen'},
               type:  'bar',
               orientation: 'h'          
        }
        
        var barLayout = {
            yaxis:{
                autorange: true,
                type: 'category',
            },
            margin: {
                l: 100,
                r: 100,
                t: 0,
                b: 50
              }
        }

        
        Plotly.newPlot("bar", [barData], barLayout, responsive = true)

        // Bubble chart
        var bubbleData = [{
            x: samp.otu_ids,
            y: samp.sample_values,
            mode: "markers",
            marker: {
                size: samp.sample_values,
                colorscale: 'Earth',
                color: samp.otu_ids},
            text: samp.otu_labels
        }]
        
        var bubbleLayout = {
            xaxis: {title:"OTU ID"},
            
        }
        
        Plotly.newPlot("bubble", bubbleData, bubbleLayout, responsive = true)

        // Create Gauge Chart Data
        var gaugeData = [
            {value: parseFloat(meta.wfreq),
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            rotation: 90,
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                    bar: { color: "red" },
                    steps:[
                        { range: [0,1], color: "#f2faef" },
                        { range: [1,2], color: "#f1faee" },
                        { range: [2,3], color: "#e9f7e5" },
                        { range: [3,4], color: "#e1f3dc" },
                        { range: [4,5], color: "#bee5b7" },
                        { range: [5,6], color: "#6ec175" },
                        { range: [6,7], color: "#2b944c" },
                        { range: [7,8], color: "#015824" },
                        { range: [8,9], color: "#00451c" }
                    ]
                }
                }
        ]

        
        var gaugeLayout = { width: 500, height: 400}

        
        Plotly.newPlot('gauge', gaugeData, gaugeLayout, responsive = true)

    }

    function init(){

        var firstMetadata = data.metadata[0]

        var firstSample = data.samples[0]
        
        updatePage(firstMetadata, firstSample)

        d3.selectAll("#selDataset").on("change", function(){

            var meta = data.metadata.find(d => d.id == this.value)

            var samp = data.samples.find(d => d.id == this.value)

            updatePage(meta, samp)
        })
    }

    init()
})



