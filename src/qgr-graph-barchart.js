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
    t.container = t.options.container;
    t.raw_data = t.options.raw_data;

    // Transform raw data to format needed by D3.
    t.data = t.map_raw_data(t.raw_data, t.config.label)
    t.init_labels = _.pluck(t.data, 'label')

    var width = $(t.container).width(),
      height = $(t.container).height();

    t.x = d3.scale.linear()
        .domain([0, d3.max(t.data, function(d) { return d.val; })])
        .range(["0px", 0.8 * width + 'px']),

    t.chart = d3.select(t.container).append("div")
      .attr("class", "qgr-graph-barchart")
      .style("padding-top", height/3 + 'px');

    t.setElement($('.qgr-graph-barchart')[0]);

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
    t.data = t.order_by_init_labels(t.data, t.init_labels);

    var bar = t.chart.selectAll("div")
      .data(t.data)

    bar
      .style("visibility", function(d) {
        if (d.val !== 0) {
          return 'visible';
        } else if (d3.select(this).style('visibility') == 'hidden') {
          return 'hidden';
        }
      })
      .text(function(d) {
        if (d.val !== 0) {
          return d.label + ': ' + d.val;
        } else {
          return '';
        }
      })
      .transition()
      .style("width", function(d) {
        return t.x(d.val); })
      .transition()
      // Hide bars that have zero val
      .style("visibility", function(d) {
        if (d.val === 0) {
          return 'hidden'
        }
      })

  },

  map_raw_data: function(raw_data, label_col) {
    return _.map(raw_data, function(row) {
      return {
        val: row.val,
        label: row[label_col]
      };
    });
  },

  order_by_init_labels: function(data, init_labels) {
    return _.map(init_labels, function(label) {
      var val;

      var rows = _.where(data, {label: label});

      if (_.isEmpty(rows)) {
        // If there are no matching rows, then val is zero.
        val = 0;
      } else {
        // Otherwise, there should only be one row, so we take its val.
        val = rows[0].val;
      }

      return {
        label: label,
        val: val
      }
    });
  }

});

return BarChart;

});

