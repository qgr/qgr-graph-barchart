define( [
    'jquery',
    'underscore',
    'backbone',
    'd3',
    ],
function ($, _, Backbone, d3) {


  var BarChart = Backbone.View.extend({

  initialize: function(options) {

    var t = this;
    t.config = t.options.graph_config;
    t.raw_data = t.options.raw_data;

    // Transform raw data to format needed by D3.
    t.data = t.map_raw_data(t.raw_data, t.config.label)

    var width = t.$el.width(),
      height = t.$el.height();

    t.x = d3.scale.linear()
        .domain([0, d3.max(t.data, function(d) { return d.val; })])
        .range(["0px", 0.8 * width + 'px']),

    t.chart = d3.select(t.el).append("div")
      .attr("class", "qgr-graph-barchart")
      .style("padding-top", height/3 + 'px');

    t.chart.selectAll("div")
      .data(t.data)
      .enter().append("div")
      .style("width", function(d) { return t.x(d.val); })
      .text(function(d) { return d.label + ': ' + d.val; });

  },

  update: function(raw_data){

    var t = this;

    t.raw_data = raw_data;

    t.data = t.map_raw_data(t.raw_data, t.config.label)

    var bar = t.chart.selectAll("div")
      .data(t.data)

    bar
      .enter()
      .append("div")
      .style("width", 0)
      .transition()
      .duration(500)
      .style("width", function(d) { return t.x(d.val); })
      .text(function(d) { return d.label + ': ' + d.val; });

    bar
      .transition()
      .style("width", function(d) { return t.x(d.val); })
      .text(function(d) { return d.label + ': ' + d.val; });

    bar
      .exit()
      .transition()
      .duration(500)
      .style("width", "0px")
      .remove()

  },

  map_raw_data: function(raw_data, label_col) {
    return _.map(raw_data, function(row) {
      return {
        val: row.val,
        label: row[label_col]
      };
    });
  }

});

return BarChart;

});

