const p = 45;
const w = 1000 - 2 * p;
const h = 475 - 2 * p;
const color = d3.scaleOrdinal(d3.schemeCategory10);

d3.select("#chart")
  .append("h1")
  .text("Doping in Proffesional Cycling")
  .attr("id", "title");

d3.select("#chart")
  .append("h2")
  .text("35 Fastest times up Alpe d'Huez")
  .attr("id", "subtitle");

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", w + 2 * p)
  .attr("height", h + 2 * p)
  .attr("id", "graph")
  .append("g")
  .attr("transform", "translate(" + p + "," + p + ")");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then((data) => {
  data.forEach((d) => {
    const minsAndSecs = d.Time.split(":");
    d.Time = new Date(2020, 0, 1, 0, minsAndSecs[0], minsAndSecs[1]);
  });
  
  const tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .attr("opacity", 0);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([0, w]);

  const yScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
    .range([0, h]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const timeFormat = d3.timeFormat("%M:%S");

  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)

  svg
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis)

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 6)
    .attr("stroke", "black")
    .attr("fill", (d) => color(d.Doping === ""))
    .on("mouseover", (event, d) => {
      tooltip.transition()		
        .duration(200)
        .style("opacity", 0.9)
      tooltip
        .html(
          d.Name +
          " (" +
          d.Nationality +
          ")<br/>Year: " +
          d.Year +
          ", Time: " +
          timeFormat(d.Time) +
          (d.Doping ? "<br/><br/>" + d.Doping : "")
        )
        .attr("data-year", d.Year)
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px");
    })
    .on("mouseout", (event, d) => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })

    var legend = svg
      .append("g")
      .attr("id", "legend")
      .selectAll("#legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend-label")
      .attr("transform", (d, i) => 
        ("translate(0," + (i * 20) + ")")
      );

    legend
      .append("rect")
      .attr("x", w)
      .attr("width", 15)
      .attr("height", 15)
      .attr("stroke", "black")
      .style("fill", color);

    legend
      .append("text")
      .attr("x", w - 5)
      .attr("y", 12)
      .style("text-anchor", "end")
      .text((d) => 
        d ? "Riders without doping allegations" : "Riders with doping allegations"
      );
})
.catch((err) => console.log(err))
