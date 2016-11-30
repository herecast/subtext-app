import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const store = Ember.Service.extend({
  findAll() {
    return [];
  }
});

moduleForComponent('modals/market-categories', 'Integration | Component | modals/market categories', {
  integration: true,

  beforeEach() {
    this.register('service:store', store);
    this.inject.service('store', { as: 'store' });
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{modals/market-categories}}`);

  assert.equal(this.$('[data-test-name]').text().trim(), 'Categories');
});
