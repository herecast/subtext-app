import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app-header', 'Integration | Component | app header', {
  integration: true
});

test('it renders', function (assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.on('trackMenuOpen', function () {});
  this.on('signOut', function () {});

  this.render(hbs`{{app-header
    trackMenuOpen=(action 'trackMenuOpen')
    signOut=(action 'signOut')
    }}`
  );
  assert.ok(this.$());
});
