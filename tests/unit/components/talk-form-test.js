import { moduleForComponent, test } from 'ember-qunit';
import resolver from '../../helpers/resolver';

moduleForComponent('talk-form', 'Unit | Component | talk form', {
  // Specify the other units that are required for this test
  needs: ['component:form-group', 'component:summer-note',
    'component:content-form-image', 'helper:fa-icon'
  ],
  unit: true,

  setup: function() {
    this.container.register('template:partials/content-form-buttons',
           resolver.resolve('template:partials/content-form-buttons'));
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
