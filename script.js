let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest()

let values = []

let xScale 
let yScale 

let width = 700
let height = 600
let padding = 70

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScale = () => {
    xScale = d3.scaleLinear()
                .domain([d3.min(values, (item) => {
                    return item['Year']
                }), d3.max(values, (item) => {
                    return item['Year']
                })])
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([d3.min(values, (item) => {
                    return new Date(item['Seconds'] * 1000)
                }), d3.max(values, (item) => {
                    return new Date(item['Seconds'] * 1000)
                })])
                .range([height - padding, padding])
}

let drawPoint = () => {
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '4')
        
        // create a property "data-xvalue"
        .attr('data-xvalue', (item) => {
            return item['Year']
        })

        // create a property "data-yvalue"
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds'] * 1000)
        })

        .attr('cx', (item) => {
            return xScale(item['Year'])
        })

        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds'] * 1000))
        })

        // doping data are in orange points
        .attr('fill', (item) => {
            if (item['Doping'] != '') {
                return 'red'
            } else {
                return 'black'
            }
        })

        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
            
            if (item['Doping'] !== ""){
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
            } else {
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
            }
            
        })

        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
                
}

let generateAxes = () => {

    // create a <g> element x-axis with a corresponding id = 'x-axis'
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')

    // create a <g> element y-axis with a correpsonding id = 'y-axis
    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)') // push the y-axis a little bit to the right 

    // add y-axis title 
    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('x', 70)
        .attr('y', 50) 
        .style('text-anchor', 'middle') 
        .text('Time in Minute');

    // add x-axis title 
    svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', width - padding + 55)
        .attr('y', height - padding / 2 - 15)
        .text('Year');
}


req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    drawCanvas()
    generateScale()
    drawPoint()    
    generateAxes()
}
req.send()
