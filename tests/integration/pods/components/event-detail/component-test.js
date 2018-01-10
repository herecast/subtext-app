import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

const contentCommentsStub = Ember.Service.extend({
  getComments() { }
});

moduleForComponent('event-detail', 'Integration | Component | event detail', {
  integration: true,
  setup() {
    startMirage(this.container);
    this.inject.service('tracking');
    this.register('service:content-comments', contentCommentsStub);
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('scrollToMock', () => {});
  this.set('feedContentMock', ()=>{});
  this.set('event', {contentId: 1});

  this.render(hbs`
   {{event-detail
      feedContent=feedContentMock
      model=event
      scrollTo=(action scrollToMock)
   }}
  `);

  assert.ok(this.$().text().trim());
});

test('Tracking impressions', function(assert) {
  assert.expect(2);

  let impressions = [];

  this.tracking.reopen({
    contentImpression(id) {
      impressions.push(id);
    }
  });

  this.set('event', Ember.Object.create({
    id: 1,
    contentId: 2,
    futureInstances: []
  }));
  this.set('scrollToMock', () => {});
  this.set('feedContentMock', ()=>{});

  this.render(hbs`
    {{event-detail
      feedContent=feedContentMock
      model=event
      scrollTo=(action scrollToMock)
    }}
  `);

    assert.ok(
      impressions.indexOf(2) > -1,
      'After render, records impression through tracking service');

  this.set('event', Ember.Object.create({
    id: 4,
    contentId: 5,
    futureInstances: []
  }));

    assert.ok(
      impressions.indexOf(5) > -1,
      'it records a new impression when given a new model');
});
