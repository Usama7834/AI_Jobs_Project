const boxSvg = d3.select("#boxPlot");
const boxMargin = {top: 20, right: 20, bottom: 40, left: 60};
const boxWidth = 900 - boxMargin.left - boxMargin.right;
const boxHeight = 350 - boxMargin.top - boxMargin.bottom;
const boxG = boxSvg.append("g")
  .attr("transform", `translate(${boxMargin.left},${boxMargin.top})`);

function updateBoxPlot(data) {
  boxG.selectAll("*").remove();
  const grouped = d3.group(data, d => d.experience_level);

  const stats = Array.from(grouped, ([key, values]) => {
    const salaries = values.map(d => d.salary_usd).sort(d3.ascending);
    return {
      level: key,
      q1: d3.quantile(salaries, 0.25),
      median: d3.quantile(salaries, 0.5),
      q3: d3.quantile(salaries, 0.75),
      min: d3.min(salaries),
      max: d3.max(salaries)
    };
  });

  const x = d3.scaleBand()
    .domain(stats.map(d => d.level))
    .range([0, boxWidth])
    .padding(0.4);

  const y = d3.scaleLinear()
    .domain([0, d3.max(stats, d => d.max)])
    .nice()
    .range([boxHeight, 0]);

  boxG.append("g").call(d3.axisLeft(y));
  boxG.append("g")
    .attr("transform", `translate(0,${boxHeight})`)
    .call(d3.axisBottom(x));

  boxG.selectAll("line.whisker")
    .data(stats)
    .join("line")
    .attr("x1", d => x(d.level)+x.bandwidth()/2)
    .attr("x2", d => x(d.level)+x.bandwidth()/2)
    .attr("y1", d => y(d.min))
    .attr("y2", d => y(d.max))
    .attr("stroke", "black");

  boxG.selectAll("rect.box")
    .data(stats)
    .join("rect")
    .attr("x", d => x(d.level))
    .attr("y", d => y(d.q3))
    .attr("height", d => y(d.q1)-y(d.q3))
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    .attr("stroke", "black");

  boxG.selectAll("line.median")
    .data(stats)
    .join("line")
    .attr("x1", d => x(d.level))
    .attr("x2", d => x(d.level)+x.bandwidth())
    .attr("y1", d => y(d.median))
    .attr("y2", d => y(d.median))
    .attr("stroke", "black");
}
