
async function handleData(property) {

  d3.select("svg")
    .selectAll("*")
    .remove();

  let data = await d3.csv('climber_df.csv')
  data = getAverages(data, property)
  console.log(data)
  const margin = { top: 10, right: 10, bottom: 20, left: 40 }
  const width = 1000 - (margin.left + margin.right)
  const height = 500 - (margin.top + margin.bottom)

  // x scale 
  const xscale = d3.scaleBand()
    .domain(data.map(d => d.property))
    .range([margin.left, width + margin.left])
    .padding(0.05) // space between bars

  // y scale 
  const dataExtent = d3.extent(data, d => d.average)
  const yscale = d3.scaleLinear()
    .domain(dataExtent)
    .range([height, margin.bottom])

  const colorscale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.average))
    .range([90, 10])

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
    .attr('fill', d => `hsl(140, 100%, ${colorscale(d.average)}%)`)
    .attr('x', (d, i) => xscale(d.property))
    .attr('y', d => yscale(d.average))
    .attr('width', xscale.bandwidth())
    .attr('height', d => height - yscale(d.average))

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

const getTotalClimbers = (data) => data.length
// climbers from which country are best?
// grade level per years of climbing
// grade level per height -> men/women

const gradeByAgeGroups = (climbers) => {

  // const passengers = data.filter((passenger) => property in passenger.fields)
	// const array = passengers.reduce((prev, passenger) => {
	// 	if (prev[Math.floor(passenger.fields[property] / step)] === undefined) {
	// 		prev[Math.floor(passenger.fields[property] / step)] = 1
	// 		// console.log(prev[Math.floor(passenger.fields[property] / step)])
	// 	} else {
	// 		prev[Math.floor(passenger.fields[property] / step)] += 1
	// 	}
	// 	return prev
	// }, [])
	// for (let i = 0; i < array.length; i ++ ) {
	// 	if (array[i] === undefined) {
	// 		array[i] = 0
	// 	}
	// }
	// return array

  console.log(climbers)
  let hist = {} 
  hist = climbers.reduce((prev, climber) => {
		if (Math.floor(climber.age) in prev ) {
      prev[Math.floor(climber.age)].push(climber.grades_max)
			// console.log(prev[Math.floor(passenger.fields[property] / step)])
		} else {
			prev[Math.floor(climber.age)] = [climber.grades_max]
		}
		return prev
	}, hist)

  console.log(hist)
	return hist
}

const gradeByProperty = (data, property) => {
	const climbers = data.filter((climber) => property in climber);

  if (property === 'age') {
    return gradeByAgeGroups(climbers);
  }
	
	let hist = {}

	if (data.length - climbers.length > 0) {
		hist.undefined = data.length - climbers.length
	}

	hist = climbers.reduce((prev, climber) => {
		if (climber[property] in prev) {
			prev[climber[property]].push(climber.grades_max)
		} else {
			prev[climber[property]] = [climber.grades_max]
		}
		return prev
	}, hist)

	return hist 
}

const getAverages = (rawData, property) => {
  const data = gradeByProperty(rawData, property)
  const keys = Object.keys(data)
   return keys.map((key) => {
    const sum = data[key].reduce((prev, curr) => prev+parseInt(curr), 0)
    console.log(sum)
    const average = sum / (data[key].length)
    return {
      property: key,
      average: average,
    }
  })
}


const label = document.getElementById('label')
const ageButton = document.getElementById('age').addEventListener('click', () => {
  handleData('age');
  label.innerHTML = `🧗 Max Climbing Grade by Age`
});
const yearsButton = document.getElementById('years').addEventListener('click', () => {
  handleData('years_cl')
  label.innerHTML = `🧗 Max Climbing Grade by Years Climbing`
});
const countryButton = document.getElementById('country').addEventListener('click', () => {
  handleData('country')
  label.innerHTML = `🧗 Max Climbing Grade by Country`
});


handleData('years_cl');
