function draw_confident() {
    var histoData = [{"Online Search": 5, "ExampleNet": 5}, {"Online Search": 6, "ExampleNet": 6}, {"Online Search": 4, "ExampleNet": 6}, {"Online Search": 4, "ExampleNet": 6}, {"Online Search": 6, "ExampleNet": 6}, {"Online Search": 4, "ExampleNet": 6}, {"Online Search": 3, "ExampleNet": 6}, {"Online Search":3, "ExampleNet": 6}, {"Online Search": 7, "ExampleNet": 4}, {"Online Search": 5, "ExampleNet": 5}, {"Online Search": 5, "ExampleNet": 6}, {"Online Search": 3, "ExampleNet": 7}, {"Online Search": 3, "ExampleNet": 5}, {"Online Search": 5, "ExampleNet": 7}, {"Online Search": 1, "ExampleNet": 6}, {"Online Search": 5, "ExampleNet": 6}];

    var data = [];
    for (var i=1; i<8; i++) {
        data.push({"categorie": i, "values": [{"value":0, "rate": "Online Search"}, {"value":0, "rate": "ExampleNet"}]});
        for (var j=0; j<histoData.length; j++) {
            if (histoData[j]['Online Search']==i) {
                data[i-1]['values'][0]['value'] += 1;
            }
            if (histoData[j]['ExampleNet']==i) {
                data[i-1]['values'][1]['value'] += 1;
            }
        }
    }

    var mean = [d3.mean(histoData, d => d['Online Search']), d3.mean(histoData, d => d['ExampleNet'])],
        median = [d3.median(histoData, d => d['Online Search']),d3.median(histoData, d => d['ExampleNet'])];

    var margin = {top: 50, right: 10, bottom: 100, left: 80},
        width = 550 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var colorLi = ["#98abc5","#6b486b"];

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var x2 = d3.scale.linear()
        .range([0, width])
        .domain([0.45,7.55]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .tickSize(1)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .ticks(3)
        .orient("left");

    var color = d3.scale.ordinal()
        .range(colorLi);

    var svg = d3.select('#confident').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append('g')
        .attr('class', 'median')
        .attr("transform", 'translate(0,'+(height)+')')
        .selectAll('.medianLine')
        .data(median)
        .enter()
        .append('line')
            .attr('class', 'medianLine')
            .attr('x1', d => x2(d))
            .attr('x2', d => x2(d))
            .attr('y1', 0)
            .attr('y2', 70)
            .attr('stroke', function(d, i){
                return colorLi[i];
            })
            .attr('stroke-width', '2')
            .style("stroke-dasharray", ("3, 3"));

    var categoriesNames = data.map(function(d) { return d.categorie; });
    var rateNames = data[0].values.map(function(d) { return d.rate; });

    x0.domain(categoriesNames);
    x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

    svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    svg.select(".x-axis")
        .selectAll("text")
            .style('font-family','Arial')
            .style('font-size','16')

    svg.append("g")
            .attr("class", "y-axis")
            .style('opacity','1')
            .call(yAxis)
    .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -80)
            //.attr("dy", "3em")
            .style("text-anchor", "middle")
            .style('font-weight','bold')
            .style('font-family','Arial')
            .style('font-size','16')
            .text("Participant Count");

    svg.select(".y-axis")
        .selectAll("text")
            .style('font-family','Arial')
            .style('font-size','16');

    svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".grid")
            .data([{"gridY": 2}, {"gridY": 4}, {"gridY": 6}, {"gridY": 8}, {"gridY": 10}])
            .enter()
            .append('line')
                .attr("class", "grid")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d['gridY']))
                .attr("y2", d => y(d['gridY']))
                .attr("stroke", 'gray')
                .attr("stroke-width", '2px')
                .style("stroke-dasharray", ("3, 3"));

    svg.append('g')
        .attr('class', 'mainG')
        .attr("transform", "translate(-80,"+(height+30)+")")
        .selectAll(".x-marker")
        .data(['Not Confident', 'Neutral', 'Strongly Confident'])
        .enter()
        .append('text')
            .attr('class', 'x-marke')
            .attr('x', function(d, i) {
                return (width/3)*(i+1);
            })
            .attr("y", 0)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(d => d)
                .style('font-family','Arial')
                .style('font-size','16')
                .attr('font-weight', 'bold');

    var slice = svg.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

    slice.selectAll("rect")
            .data(function(d) { return d.values; })
    .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.rate); })
            .style("fill", function(d) { return color(d.rate) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height - y(0); });

    slice.selectAll("rect")
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

    //Legend
    var legend = svg.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.rate; }).reverse())
    .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(" + i * 100 + ",10)"; })
            .style("opacity","1");

    legend.append("rect")
            .attr("x", 20)
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", function(d) { return color(d); });

    legend.append("text")
            .attr("x", 40)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) {return d; })
                .style('font-family','Arial')
                .style('font-size','12');

    svg.append('g')
        .attr('class', 'median')
        .attr("transform", 'translate(0,'+(height)+')')
        .selectAll('.medianDot')
        .data(median)
        .enter()
        .append('circle')
            .attr('class', 'medianDot')
            .attr('cx', d => x2(d))
            .attr('cy', 0)
            .attr('r', '5')
            .attr('stroke', 'white')
            .attr('stroke-width', '2')
            .attr('fill', function(d, i){
                return colorLi[i];
            });

    svg.append('g')
        .attr('class', 'median')
        .attr("transform", 'translate(0,'+(height)+')')
        .selectAll('.medianRect')
        .data(median)
        .enter()
        .append('rect')
            .attr('class', 'medianRect')
            .attr('x', d => x2(d)-45)
            .attr('y', 50)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', 90)
            .attr('height', 30)
            .attr('fill', function(d, i){
                return colorLi[i];
            });

    svg.append('g')
        .attr('class', 'median')
        .attr("transform", 'translate(0,'+(height)+')')
        .selectAll('.medianText')
        .data(median)
        .enter()
        .append('text')
            .attr('class', 'medianText')
            .attr('text-anchor', 'middle')
            .attr('x', d => x2(d))
            .attr('y', 70)
            .text(d => "median: "+d)
                .attr('font-family', 'Arial')
                .attr('font-size', 15)
                .attr('font-weight', 'bold')
                .attr('fill', 'white');
    
    svg.append('g')
        .attr('class', 'title')
        .attr("transform", 'translate(0,0)')
        .append('text')
            .attr('class', 'medianText')
            .attr('text-anchor', 'middle')
            .attr('x', 200)
            .attr('y', -20)
            .text("Participants felt more confident when using ExampleNet")
            .attr('font-family', 'Arial')
            .attr('font-size', 18)
            .attr('font-weight', 'bold');
};

function draw_useful() {
    var margin = {top: 50, right: 20, bottom: 150, left: 100},
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05),
    x1 = d3.scale.linear().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(1);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(0)
        .ticks(3);

    var svg = d3.select("#useful").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    var barData = [6,6,7,7,5,6,7,7,5,5,7,6,7,7,6,7]

    var data = [];
    for (var i=1; i<8; i++) {
    var stat = {"rate": i, "value": 0};
    for (var j=0; j<barData.length; j++) {
        if (barData[j] == i) {
        stat["value"] += 1;
        }
    }
    data.push(stat);
    }
        
    x.domain(data.map(function(d) {return d.rate;}));
    x1.domain([0.45,7.55]);
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var mean =  d3.mean(barData),
    median = d3.median(barData);

    var statData = [{"name": "median", "value": median}]

    svg.append('g')
    .attr('class', 'median')
    .attr("transform", 'translate(0,'+(height)+')')
    .selectAll('.medianLine')
    .data(statData)
    .enter()
    .append('line')
        .attr('class', 'medianLine')
        .attr('x1', d => x1(d.value))
        .attr('x2', d => x1(d.value))
        .attr('y1', 0)
        .attr('y2', 70)
        .attr('stroke', 'skyblue')
        .attr('stroke-width', '2')
        .style("stroke-dasharray", ("3, 3"));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.select(".x-axis")
    .selectAll("text")
        .style('font-family','Arial')
        .style('font-size','16')

    svg.append("g")
        .attr("class", "y-axis")
        .style('opacity','1')
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -height/2)
        //.attr("dy", "3em")
        .style("text-anchor", "middle")
        .style('font-weight','bold')
        .style('font-family','Arial')
        .style('font-size','16')
        .text("Participant Count");

    svg.select(".y-axis")
    .selectAll("text")
        .style('font-family','Arial')
        .style('font-size','16');

    svg.append("g")
    .attr("transform", "translate(0,0)")
    .selectAll(".grid")
        .data([{"gridY": 2}, {"gridY": 4}, {"gridY": 6}, {"gridY": 8}])
        .enter()
        .append('line')
        .attr("class", "grid")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d['gridY']))
        .attr("y2", d => y(d['gridY']))
        .attr("stroke", 'gray')
        .attr("stroke-width", '2px')
        .style("stroke-dasharray", ("3, 3"));

    svg.selectAll("bar")
        .data(data)
    .enter().append("rect")
        .style("fill", "skyblue")
        .attr("x", function(d) { return x(d.rate); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });

    svg.append('g')
    .attr('class', 'mainG')
    .attr("transform", "translate("+(-margin.left+30)+","+(height+30)+")")
    .selectAll(".x-marker")
    .data(['Online Search', 'Neutral', 'ExampleNet'])
    .enter()
    .append('text')
        .attr('class', 'x-marke')
        .attr('x', function(d, i) {
        return (width/3)*(i+1);
        })
        .attr("y", 0)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(d => d)
        .style('font-family','Arial')
        .style('font-size','16')
        .attr('font-weight', 'bold');

    svg.append('g')
    .attr('class', 'median')
    .attr("transform", 'translate(0,'+(height)+')')
    .selectAll('.medianDot')
    .data(statData)
    .enter()
    .append('circle')
        .attr('class', 'medianDot')
        .attr('cx', d => x1(d.value))
        .attr('cy', 0)
        .attr('r', '5')
        .attr('stroke', 'white')
        .attr('stroke-width', '2')
        .attr('fill', "skyblue");

    svg.append('g')
    .attr('class', 'median')
    .attr("transform", 'translate(0,'+(height)+')')
    .selectAll('.medianRect')
    .data(statData)
    .enter()
    .append('rect')
        .attr('class', 'medianRect')
        .attr('x', d => (x1(d["value"])-70))
        .attr('y', 50)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('width', 140)
        .attr('height', 30)
        .attr('fill', "skyblue");

    svg.append('g')
    .attr('class', 'median')
    .attr("transform", 'translate(0,'+(height)+')')
    .selectAll('.medianText')
    .data(statData)
    .enter()
    .append('text')
        .attr('class', 'medianText')
        .attr('text-anchor', 'middle')
        .attr('x', d => x1(d["value"]))
        .attr('y', 72)
        .text(d => d.name + ": " + d.value)
        .attr('font-family', 'Arial')
        .attr('font-size', 18)
        .attr('font-weight', 'bold')
        .attr('fill', 'white');

    svg.append('g')
        .attr('class', 'title')
        .attr("transform", 'translate(0,0)')
        .append('text')
            .attr('class', 'medianText')
            .attr('text-anchor', 'middle')
            .attr('x', 180)
            .attr('y', -20)
            .text("Participants rated ExampleNet as more helpful")
            .attr('font-family', 'Arial')
            .attr('font-size', 18)
            .attr('font-weight', 'bold');
}

draw_confident();
draw_useful();