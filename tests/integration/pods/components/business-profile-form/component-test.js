import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('business-profile-form', 'Integration | Component | business profile form', {
  integration: true,
  setup() {
    startMirage(this.container);
  }
});

test('it renders', function(assert) {
  this.set('categories', [server.create('business-category')]);
  this.render(hbs`{{business-profile-form categories=categories}}`);

  assert.ok(this.$());
});
