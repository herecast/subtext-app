import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const promotionStub = Ember.Service.extend({
  find() {
    return { then() {} };
  }
});

moduleForComponent('news-detail', 'Integration | Component | news detail', {
  integration: true,

  beforeEach() {
    this.register('service:promotion', promotionStub);
    this.inject.service('promotion');
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  const news = {};

  this.set('news', news);

  this.render(hbs`
    {{news-detail
      news=news
    }}
  `);

  assert.ok(this.$().text().trim());
});
