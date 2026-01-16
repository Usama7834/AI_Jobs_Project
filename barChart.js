const barSvg = d3.select("#barChart");
const barMargin = {top: 20, right: 20, bottom: 50, left: 150};
const barWidth = 900 - barMargin.left - barMargin.right;
const barHeight = 350 - barMargin.top - barMargin.bottom;
const barG = barSvg.append("g")
  .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

function updateBarChart(data) {
  barG.selectAll("*").remove();
  const industryData = d3.rollups(
    data,
    v => d3.mean(v, d => d.salary_usd),
    d => d.industry
  ).sort((a,b) => b[1]-a[1]).slice(0,10);

  const x = d3.scaleLinear()
    .domain([0, d3.max(industryData, d => d[1])])
    .range([0, barWidth]);

  const y = d3.scaleBand()
    .domain(industryData.map(d => d[0]))
    .range([0, barHeight])
    .padding(0.2);

  barG.append("g").call(d3.axisLeft(y));
  barG.append("g")
    .attr("transform", `translate(0,${barHeight})`)
    .call(d3.axisBottom(x));

  barG.selectAll(".bar")
    .data(industryData)
    .join("rect")
    .attr("class", "bar")
    .attr("y", d => y(d[0]))
    .attr("height", y.bandwidth())
    .attr("width", d => x(d[1]));
}
