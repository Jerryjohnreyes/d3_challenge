// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top : 20,
    right : 40,
    bottom : 80,
    left : 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG-Wrapper and set their width and height
var svg = d3.select(".scatter").append("svg")
    .attr("width", svgWidth).attr("height", svgHeight);

// Append to the last SVG-Wrapper a Group for the chart
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// Set Initial X axis for the chart
var chosenXaxis = 'poverty';

function xScale (data, chosenXaxis){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXaxis]) * 0.8,
            d3.max(data, d => d[chosenXaxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

function renderAxes(newXscale, xAxis){
    var bottomAxis = d3.axisBottom(newXscale);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;
}

function renderCircles(circlesGroup, newXscale, chosenXaxis){
    circlesGroup.transition().duration(1000).attr("cx", d=> newXscale(d[chosenXaxis]));
    return circlesGroup;
}

function updateToolTip(chosenXaxis, circlesGroup){
    var label;
    switch (chosenXaxis){
        case ('poverty'):{
            label = "Poverty";
            break;
        }
        case ('age'):{
            label = "Age";
            break;
        }
        case ('income'):{
            label = "Income";
            break;
        }
    }
    
    var toolTip = d3.tip()
        .attr("class", "tooltip").offset([80,-60])
        .html(function(d){
            return(`<br>${label} ${d[chosenXAxis]}`)
        });

    circlesGroup.call(tooltip);
    circlesGroup.on("mouseover", function(dato){
        toolTip.show(dato);
        })
        .on("mouseout", function(dato){
        toolTip.hide(dato);
        })

    return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(data, err){
    if (err) throw err;
    data.forEach(element => {
        element.poverty = +element.poverty;
        element.healthcare = +element.healthcare;
    });

    var xLinearScale = xScale(data, chosenXaxis);
    var yLinearScale = d3.scaleLinear()
        .domain([0,d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g").call(leftAxis);
    
    chartGroup.selectAll("circle")
        .data(data).enter().append("circle")
        .attr("cx", d => xLinearScale(d[chosenXaxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20).attr("fill", "blue").attr("opacity", ".5");
        
        
    chartGroup.selectAll("text")
        .data(data).enter().append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXaxis]))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("font-family", "Sans-Serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2},${height + 20})`);

    labelsGroup.append("text")
        .attr("x",0)
        .attr("y", 20)
        .attr("value","poverty")
        .text("Poverty");
    
    chartGroup.append("text").attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Healthcare");

}).catch(function(error){console.log(error)});