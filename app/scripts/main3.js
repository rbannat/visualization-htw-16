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

    var redraw = function(data) {

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
      
    var arc = d3.svg.arc()
      .outerRadius(function (d) {
        var scaleFactor = 5;
        var r = Math.sqrt((d.data.Weight / scaleFactor) / Math.PI);
        return r;
      })
      .innerRadius(0);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.Displacement / d.Cylinders; });

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

    var svg = d3.select("#visualisation").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text");

    var pies = svg.selectAll(".pie")
      .data(data)
      .enter().append("g")
      .attr('class', 'pie')
      .attr("transform", function(d) { return "translate(" + xScale(xValue(d)) + "," + yScale(yValue(d)) + ")"; })
      
    pies.selectAll(".arc")
      .data(function(d){
        let cylArr = [];
        for (var i = 0; i < parseInt(d.Cylinders); i++) {
          cylArr.push(d);
        }
        return pie(cylArr);
      })
      .enter()
      .append('path')
      .attr('d', arc)
      .style("fill", function(d, i) {
        return color(i);
      })
      .on("mouseover", function (d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(
            "Car: " + d.data.Car + "<br>" +
            "Manufacturer: " + d.data.Manufacturer + "<br>" +
            "MPG: " + d.data.MPG + "<br>" +
            "Cylinders: " + d.data.Cylinders+ "<br>" +
            "Displacement: " + d.data.Displacement+ "<br>" +
            "Horsepower: " + d.data.Horsepower + "<br>" +
            "Weight: " + d.data.Weight + "<br>" +
            "Acceleration: " + d.data.Acceleration + "<br>" +
            "Model Year: " + d.data["Model Year"] + "<br>" +
            "Origin: " + d.data.Origin + "<br>"
          )
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        });;

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
