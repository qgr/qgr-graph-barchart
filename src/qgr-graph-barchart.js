define( [
    'jquery',
    'underscore',
    'backbone',
    'd3',
    ],
function ($, _, Backbone, d3) {

  var pluck_from_groups = function(arr) {
    return _.map(arr, function(m) { return m.get('val'); });
  };

  var sum = function(arr) {
    return _.reduce(arr, function(memo, num) { return memo + num; }, 0);
  };

  var BarChart = Backbone.View.extend({

  initialize: function(options) {

    var t = this;
    t.global_q = t.options.global_q;
    t.collection = new Backbone.Collection([
      {species: 'Waterfall Swift', color: 'qrimson', val: 1},
      {species: 'Waterfall Swift', color: 'xhrtreuse', val: 2},
      {species: 'Cave Swiftlet', color: 'qoral', val: 4},
      {species: 'Cave Swiftlet', color: 'xhrtreuse', val: 2}
    ]);

    t.base_groups = t.collection.groupBy('species');
    t.data = _.map(t.base_groups, function(v, k) {
      return {label: k, val: sum(pluck_from_groups(v)) };
    })

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


  update: function() {
    var t = this;
    var filtered = t.collection.filter(function(m) {
      console.log(m);
      return _.contains(t.global_q.get('w').other, m.get('color'));
    });

    var grouped = _.groupBy(filtered, function(m) { return m.get('species'); });

    t.data = _.map(grouped, function(v, k) {
      var val = grouped[k] || 0;
      return {label: k, val: sum(pluck_from_groups(val)) };
    })
    console.log(t.data);

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

});

return BarChart;

});

