import {
  moduleForComponent,
  test
} from 'ember-qunit';
import resolver from '../../helpers/resolver';

moduleForComponent('event-form', {
  // Specify the other units that are required for this test
  needs: ['component:event-form-dates', 'component:summer-note',
    'component:event-form-cost', 'component:event-form-venue',
    'component:fa-icon', 'component:form-group', 'component:content-form-image',
    'component:event-form-registration', 'helper:form-error', 'helper:and'
  ],

  setup: function() {
    this.container.registry.register('template:partials/content-form-buttons',
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
