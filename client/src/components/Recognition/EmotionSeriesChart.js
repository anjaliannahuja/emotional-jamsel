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
    this.timeline = this.ndx.dimension(d => d.timestamp);
    this.joy = this.ndx.dimension(d => d.joy);
    this.emotionByCategory = this.ndx.dimension((d) => {
      const { timestamp, ...notTimestamp } = d;
      const [mostPrevalentEmotion, value] = Object.entries(notTimestamp).reduce(EmotionSeriesChart.reduceToEmotion);
      console.log(mostPrevalentEmotion, value);
      return mostPrevalentEmotion;
    });
    this.emotionsGroup = this.emotionByCategory.group();
    this.joyGroup = this.joy.group();
    this.timeGroup = this.timeline.group(d => {
      console.log(d);
      return d
    });
    // this.timelineByJoy = this.timeline.group(d => d.joy);
    // this.timelineBySadness = this.timeline.group(d => d.sadness);
    // this.timelineByDisgust = this.timeline.group(d => d.disgust);
    // this.timelineByContempt = this.timeline.group(d => d.contempt);
    // this.timelineByAnger = this.timeline.group(d => d.anger);
    // this.timelineByFear = this.timeline.group(d => d.fear);
    // this.timelineBySurprise = this.timeline.group(d => d.surprise);
    // this.timelineByValence = this.timeline.group(d => d.valence);
    // this.timelineByEngagement = this.timeline.group(d => d.engagement);
    this.emotionSeriesChart = dc.lineChart('#emotionSeriesChart');
    this.emotionSeriesChart
      .renderArea(true)
      .width(1000)
      .height(300)
      .dimension(this.timeline)
      .group(this.timeGroup)
      .transitionDuration(1000)
      .x(d3.scaleLinear().domain([0, 100]))
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
      this.ndx.add(records);
      dc.redrawAll();
    }, 1000);
  }

  static reduceToEmotion = ([maxValueEmotion, value], [name, currentValue]) => {
    if (currentValue >= value) return [name, currentValue];
    return [maxValueEmotion, value];
  }

  batchRecords = [

  ];

  addRecords = (records) => {
    this.throttleAddRecords(records);
  }
}

export default EmotionSeriesChart;
