const cf = require('crossfilter2');
const dc = require('dc');
const d3 = require('d3');
const _ = require('lodash');

// Use lodash throttle to batch additions to the crossfilter
class EmotionSeriesChart {
  constructor(initialRecords) {
    console.log('Constructing chart!', initialRecords);
    this.ndx = cf(initialRecords);
    this.all = this.ndx.groupAll();
    this.timeline = this.ndx.dimension(d => [d.timestamp, d.name]);
    this.emotionByCategory = this.ndx.dimension(d => d.name);
    this.emotionsGroup = this.emotionByCategory.group().reduceSum(d => d.value);
    this.timeGroup = this.timeline.group().reduceSum(d => d.value);
    this.emotionSeriesChart = dc.seriesChart('#emotionSeriesChart');
    this.emotionSeriesChart
      .width(768)
      .height(480)
      .elasticY(true)
      .chart(c => dc.lineChart(c).curve(d3.curveCardinal))
      .dimension(this.timeline)
      .group(this.timeGroup)
      .transitionDuration(1000)
      .seriesAccessor(d => `Emt: ${d.key[1]}`)
      .keyAccessor(d => d.key[0])
      .valueAccessor(d => d.value)
      .x(d3.scaleLinear().domain([0, 30]))
      .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70))
      .renderHorizontalGridLines(true);
    this.emotionsDonut = dc.pieChart('#emotionsDonut');
    this.emotionsDonut
      .width(180)
      .height(180)
      .radius(80)
      .dimension(this.emotionByCategory)
      .group(this.emotionsGroup)
      .innerRadius(40);
    this.dataCount = dc.dataCount('#counts');
    this.dataCount
      .dimension(this.ndx)
      .group(this.all)
      .html({
        some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a>',
        all: '<strong>%total-count</strong> records total',
      });
    dc.renderAll();

    this.throttleAddRecords = _.throttle((records) => {
      console.log(records)
      this.ndx.add(records);
      dc.redrawAll();
    }, 1000);
  }

  static reduceToEmotion = ([maxValueEmotion, value], [name, currentValue]) => {
    if (currentValue >= value) return [name, currentValue];
    return [maxValueEmotion, value];
  }

  addRecords = (records) => {
    this.throttleAddRecords(records);
  }
}

export default EmotionSeriesChart;
