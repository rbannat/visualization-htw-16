(function () {
  var width = 960,
    height = 500;

  var radius = d3.scale.sqrt()
    .domain([0, 20000])
    .range([0, 20]);

  var force = d3.layout.force()
    .charge(-240)
    .linkDistance(40)
    .size([width, height]);

  var svg = d3.select("#visualisation").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.xml("scripts/Old_New_Testament_Social_Network_short.xml", "application/xml", function (error, xml) {
    if (error) throw error;

    var nodes = [].map.call(xml.querySelectorAll("node"), function (node) {
        return {
          id: node.getAttribute("id") - 1
        };
      }),
      links = [].map.call(xml.querySelectorAll("edge"), function (edge) {
        return {
          source: edge.getAttribute("source") -1,
          target: edge.getAttribute("target") -1
        };
      }),
      root = nodes[0];

    root.x = width / 2;
    root.y = height / 2;
    root.fixed = true;

    force
      .nodes(nodes)
      .links(links)
      .start();

    var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link");

    var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", function (d) {
        return radius(d.textContent) || 5;
      })
      .call(force.drag);

    force.on("tick", function () {
      link.attr("x1", function (d) {
        return d.source.x;
      })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node.attr("cx", function (d) {
        return d.x;
      })
        .attr("cy", function (d) {
          return d.y;
        });
    });
  });
})();
