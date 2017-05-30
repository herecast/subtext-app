import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('event-detail', 'Integration | Component | event detail', {
  integration: true,
  setup() {
    startMirage(this.container);
    this.inject.service('api');

    // content comments was causing side affects, and needing special service injection.
    this.register('component:content-comments', Ember.Component.extend());
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('scrollToMock', () => {});
  this.set('event', Ember.Object.create({
    id: 1,
    eventInstances: []
  }));

  this.render(hbs`
   {{event-detail
      model=event
      scrollTo=(action scrollToMock)
   }}
  `);

  assert.ok(this.$().text().trim());
});

test('Tracking impressions', function(assert) {
  assert.expect(2);

  let impressions = [];

  this.api.reopen({
    recordContentImpression(id) {
      impressions.push(id);
      this._super(id);
    }
  });

  this.set('event', Ember.Object.create({
    id: 1,
    contentId: 2,
    eventInstances: []
  }));
  this.set('scrollToMock', () => {});

  this.render(hbs`
    {{event-detail
      model=event
      scrollTo=(action scrollToMock)
    }}
  `);

    assert.ok(
      impressions.indexOf(2) > -1,
      'After render, api receives trackContentImpression');

  this.set('event', Ember.Object.create({
    id: 4,
    contentId: 5,
    eventInstances: []
  }));

    assert.ok(
      impressions.indexOf(5) > -1,
      'it records a new impression when given a new model');
});
