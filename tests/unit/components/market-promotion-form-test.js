import { moduleForComponent, test } from 'ember-qunit';
import resolver from '../../helpers/resolver';

moduleForComponent('market-promotion-form', 'Unit | Component | market promotion form', {
  needs: ['component:content-form-listservs'],

  setup: function() {
    this.container.registry.register('template:partials/promotion-disclaimer',
         resolver.resolve('template:partials/promotion-disclaimer'));
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
