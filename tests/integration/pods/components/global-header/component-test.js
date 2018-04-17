import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('global-header', 'Integration | Component | global header', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.on('signOut', function () {});

  this.render(hbs`{{global-header
    signOut=(action 'signOut')
  }}`);
  assert.ok(this.$());
});
