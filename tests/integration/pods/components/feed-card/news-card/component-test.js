import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('feed-card/news-card', 'Integration | Component | feed card/news card', {
  integration: true,
  beforeEach() {
    this.register('service:feature-flags', Ember.Service.extend({}));
    this.register('service:user-location', Ember.Service.extend({
      locationId: 0,
      location: {
        name: "",
        id: 0
      },
      on(){},
    }));
  }
});

const model = {
  id: 1,
  modelType: 'news',
  title: 'God rest ye merry gentlemen!',
  normalizedContentType: 'news',
  baseLocations: []
};

test('it renders', function(assert) {
  this.set('model', model);

  this.render(hbs`{{feed-card/news-card model=model}}`);

  assert.ok(this.$());
});
