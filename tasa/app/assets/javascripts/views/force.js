(function() {
  'use strict';
  window.ForceView = SpinnerView.extend({
    template: 'templates/force',

    decorator: function() {
      return {
        topics: _.pluck(_.groupBy(this.model.get('nodes'), 'group'), 'length')
      };
    },

    render: function(options) {
      var self = this;
      SpinnerView.prototype.render.call(this, options);
      if (options.loading) { return; }

      var data = this.model.pick('nodes', 'links');
      var $svg = this.$('svg');
      var width = $svg.width(),
          height = $svg.height();

      var edge_weight = d3.scale.sqrt()
        .domain([0,100])
        .range([0,3]);

      var force = d3.layout.force()
        .charge(-25)
        .linkDistance(50)
        .size([width, height]);

      var d3svg = d3.select($svg[0]);

      force
        .nodes(data.nodes)
        .links(data.links)
      ;

      var link = d3svg.selectAll('.link')
        .data(data.links).enter()
        .append('line')
          .attr('class', 'link');

      var color = d3svg.selectAll('.color')
        .data(data.nodes).enter()
        .append('circle')
        .attr('class', function(d) { return 'color t' + d.group; })
        .attr('r', 3)
      ;
      var node = d3svg.selectAll('.node')
        .data(data.nodes).enter()
        .append('circle')
        .attr('class', function(d) { return 'node'; })
        .attr('fill', 'transparent')
        .attr('r', 6)
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d) { return d.name; })
        .attr('data-topic', function(d) { return d.group })
      ;


      force.start();
      _.times(300, force.tick);
      force.stop();

      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; })
      ;

      node
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
      ;
      color
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
      ;

      this.$('circle.node')
        .tooltip({container: 'body', placement: 'top'})
        .on('shown.bs.tooltip', function() { $('.tooltip').addClass('force-tooltip'); })
      ;
    }
  });
})();