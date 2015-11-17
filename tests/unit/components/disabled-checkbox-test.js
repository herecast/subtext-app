import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('disabled-checkbox', {
  needs: ['component:fa-icon', 'component:gradient-truncation']
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
