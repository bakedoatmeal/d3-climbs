
async function handleData() {
  const data = await d3.csv('cities.csv')
  console.log(data)
  const margin = { top: 10, right: 10, bottom: 20, left: 40 }
  const width = 600 - (margin.left + margin.right)
  const height = 300 - (margin.top + margin.bottom)

  // x scale 
  const xscale = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.left, width + margin.left])
    .padding(0.05) // space between bars

  // y scale 
  const popExtent = d3.extent(data, d => d.population)
  const yscale = d3.scaleLinear()
    .domain(popExtent)
    .range([margin.bottom, height])

  // Select the SVG (root node)
  const svg = d3.select('#svg')

  const barGroup = svg.append('g')
  // Make the bars
  barGroup 
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => xscale(d.name))
    .attr('y', d => yscale(d.population))
    .attr('width', xscale.bandwidth())
    .attr('height', d => height - yscale(d.population))

  const bottomAxis = d3.axisBottom(xscale)
  svg
    .append('g')
    .attr('transform', `translate(${0}, ${height})`)
    .call(bottomAxis)

  const leftAxis = d3.axisLeft(yscale)
      .tickFormat(d3.format('.2s')) // Format the axis
  
  svg
  .append('g')
  .attr('transform', `translate(${margin.left}, 0)`)
  .call(leftAxis)
}
  
  
  handleData()