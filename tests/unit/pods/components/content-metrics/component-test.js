import Ember from 'ember';
import moment from 'moment';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('content-metrics', 'Unit | Component | content metrics', {
  // Specify the other units that are required for this test
  needs: [],
  unit: true
});

test('cumulative views are incremental', function(assert) {

  // Creates the component instance
  var component = this.subject({
      views: Ember.A([
        Ember.Object.create({report_date: moment('12/21/2015').toDate(), view_count: 5}),
        Ember.Object.create({report_date: moment('12/22/2015').toDate(), view_count: 3}),
        Ember.Object.create({report_date: moment('12/23/2015').toDate(), view_count: 6})
      ])
  });

  const cumulativeViewData = component.get('cumulativeViewData');

  assert.deepEqual(cumulativeViewData, [5,8,14]);
});

test('cumulative clicks are incremental', function(assert) {

  // Creates the component instance
  var component = this.subject({
    startDate: '12/21/2015', //normally calculated from view count data
    endDate: '12/23/2015', //normally calculated from view count data
    clicks: Ember.A([
      Ember.Object.create({report_date: moment('12/21/2015').toDate(), click_count: 5}),
      Ember.Object.create({report_date: moment('12/22/2015').toDate(), click_count: 3}),
      Ember.Object.create({report_date: moment('12/23/2015').toDate(), click_count: 6})
    ])
  });

  const cumulativeClickData = component.get('cumulativeClickData');

  assert.deepEqual(cumulativeClickData, [5,8,14]);
});
