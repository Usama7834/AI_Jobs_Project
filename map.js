const mapSvg = d3.select("#map");
const projection = d3.geoNaturalEarth1().scale(160).translate([450, 225]);
const path = d3.geoPath().projection(projection);
const color = d3.scaleSequential(d3.interpolateBlues);
const tooltip = d3.select("#tooltip");

let countryPaths;

function drawMap(data) {
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
    const countries = topojson.feature(world, world.objects.countries);
    countryPaths = mapSvg.selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("stroke", "#999")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1).html(d.properties.name);
      })
      .on("mousemove", event => {
        tooltip.style("left", event.pageX + 10 + "px")
               .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));
    updateMap(data);
  });
}

function updateMap(data) {
  const salaryByCountry = d3.rollup(
    data,
    v => d3.mean(v, d => d.salary_usd),
    d => d.company_location
  );
  color.domain(d3.extent(salaryByCountry.values()));
  countryPaths.attr("fill", d =>
    salaryByCountry.get(d.properties.name)
      ? color(salaryByCountry.get(d.properties.name))
      : "#eee"
  );
}
