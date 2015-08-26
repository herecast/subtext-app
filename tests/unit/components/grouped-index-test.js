import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('grouped-index', 'Unit | Component | grouped index', {
  // Specify the other units that are required for this test
  needs: ['component:content-card', 'component:news-card-wide'],
  unit: true
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
