(function () {

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  /*
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */

  // setup x
  var xValue = function (d) {
      return d.Horsepower;
    }, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function (d) {
      return xScale(xValue(d));
    }, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
  var yValue = function (d) {
      return d.Acceleration;
    }, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // inverse y because svg is top left
    yMap = function (d) {
      return yScale(yValue(d));
    }, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
  var cValue = function (d) {
      return d.Manufacturer;
    },
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
  var svg = d3.select("#visualisation").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Horsepower");

  // y-axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("y", 6)
    .attr("x", 6)
    .attr("dy", ".71em")
    .text("Acceleration");

  var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(function (d) {
        var scaleFactor = 5;
        var r = Math.sqrt((d.Weight / scaleFactor) / Math.PI);
        return r;
      })
    .startAngle(0)
    .endAngle(2 * Math.PI);

    var redraw = function(data) {

        // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
      yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

      // draw dots
      svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("path")
        .filter(function (d) {
          return typeof d.Horsepower === 'number';
        }) // filter bad data
        .attr("transform", function(d) { return "translate(" + xScale(xValue(d)) + "," + yScale(yValue(d)) + ")"; })
        .attr("class", "arc")
        .attr("d", arc )
        .style("fill", function (d) {
          return color(cValue(d));
        })
        .on("mouseover", function (d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(
            "Car: " + d.Car + "<br>" +
            "Manufacturer: " + d.Manufacturer + "<br>" +
            "MPG: " + d.MPG + "<br>" +
            "Cylinders: " + d.Cylinders+ "<br>" +
            "Displacement: " + d.Displacement+ "<br>" +
            "Horsepower: " + d.Horsepower + "<br>" +
            "Weight: " + d.Weight + "<br>" +
            "Acceleration: " + d.Acceleration + "<br>" +
            "Model Year: " + d["Model Year"] + "<br>" +
            "Origin: " + d.Origin + "<br>"
          )
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        });
    };

  // load data
  d3.json("scripts/cars.json", function (error, json) {

    var data = json;

    $("#all").click(function(e){
      e.preventDefault();
      redraw(data);
    });

    $("#average").click(function(e){
      e.preventDefault();
      redraw(getManufacturerAverage(data));
    });

    var getManufacturerAverage = function(array) {

      const sumableKeys = ['Horsepower', 'MPG', 'Cylinders', 'Displacement', 'Weight', 'Acceleration'];
      let obj = array.reduce(function(prev, current, index, array){
         if(!(current.Manufacturer in prev.result)) {
            current.count = 1;
            prev.result[current.Manufacturer] = current;  
         } 
         else {
            if(prev.result[current.Manufacturer]) {
                if(checkValidKeys(current, sumableKeys)) {
                  let prevVal =  prev.result[current.Manufacturer];
                  for (var i = 0; i < sumableKeys.length; i++) {
                    prev.result[current.Manufacturer][sumableKeys[i]] = ((prevVal[sumableKeys[i]] * prevVal.count) + current[sumableKeys[i]]) / (prevVal.count + 1);
                    prev.result[current.Manufacturer].count++;
                  }
                }
            }
         }  
         return prev;
      },{result: {}}).result;
      let data = [];
      Object.keys(obj).forEach(function(key) {
        data.push(obj[key]);
      });  
      return data;    
    }

    var checkValidKeys = function(object, checkableKeys) {
      for (var i = 0; i < checkableKeys.length; i++) {
        if(isNaN(object[checkableKeys[i]])) {
          return false;
        }
      }
      return true;
    }
 
  });

})();
