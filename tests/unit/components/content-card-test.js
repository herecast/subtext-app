import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('content-card', 'Unit | Component | content card', {
  // Specify the other units that are required for this test
  needs: ['component:talk-card', 'component:event-card', 'component:market-card',
    'component:news-card', 'component:avatar-image'],
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
