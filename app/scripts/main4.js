(function () {
  var width = 960,
    height = 500;

  var zoom = d3.behavior.zoom()
    .scaleExtent([0, 10])
    .on("zoom", zoom);

  var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);


  var radius = d3.scale.sqrt()
    .domain([0, 20])
    .range([0, 20]);

  var force = d3.layout.force()
    .charge(-240)
    .linkDistance(40)
    .size([width, height]);

  var svg = d3.select("#visualisation").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

  var container = svg.append('g');


  function zoom() {
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();

    d3.select(this).classed("dragging", true);
    force.start();
  }

  function dragged(d) {

    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

  }

  function dragended(d) {

    d3.select(this).classed("dragging", false);
  }

  d3.xml("scripts/Old_New_Testament_Social_Network.xml", "application/xml", function (error, xml) {
    if (error) throw error;

    var nodes = [].map.call(xml.querySelectorAll("node"), function (node) {
        return {
          id: parseInt(node.getAttribute("id")),
          text: node.querySelector('data').textContent
        };
      }),
      links = [].map.call(xml.querySelectorAll("edge"), function (edge) {
        var source = parseInt(edge.getAttribute("source"));
        var target = parseInt(edge.getAttribute("target"));
        return {
          source: typeof(nodes[source]) !== 'undefined' ? source : 1,
          target: typeof(nodes[target]) !== 'undefined' ? target : 1,
          weight: edge.querySelector('data').textContent
        }
      }),
      root = nodes[0];

    root.x = width / 2;
    root.y = height / 2;
    root.fixed = true;

    force
      .nodes(nodes)
      .links(links)
      .start();

    var link = container.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link");

    var node = container.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("id", function (d) {
        return d.id;
      })
      .attr("r", function (d) {
        return radius(2 + d.weight * 4);
      })
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.text })
      .call(drag);

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
        })
        .attr("stroke-width", function (d) {
          return (d.weight);
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
