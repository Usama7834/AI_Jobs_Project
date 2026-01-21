let globalData;
let selectedExperience = "All";
let selectedRemote = 100;
let selectedCountry = null;

d3.csv("data/ai_job_dataset.csv", d3.autoType).then(data => {
  globalData = data;
  drawMap(globalData);
  updateBarChart(globalData);
  updateBoxPlot(globalData);
});

d3.select("#experienceFilter").on("change", function () {
  selectedExperience = this.value;
  updateAll();
});

d3.select("#remoteSlider").on("input", function () {
  selectedRemote = +this.value;
  d3.select("#remoteValue").text(selectedRemote === 100 ? "All" : selectedRemote + "%");
  updateAll();
});

function getFilteredData() {
  return globalData.filter(d =>
    (selectedExperience === "All" || d.experience_level === selectedExperience) &&
    (selectedRemote === 100 || d.remote_ratio === selectedRemote)
  );
}

function updateAll() {
  const filtered = getFilteredData();
  updateMap(filtered);
  updateBarChart(filtered);
  updateBoxPlot(filtered);
}
