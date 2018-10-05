import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import resolver from '../../helpers/resolver';

moduleForComponent('market-form', 'Unit | Component | market form', {
  // Specify the other units that are required for this test
  needs: ['component:summer-note', 'component:form-group', 'component:user-location/ugc-button',
    'component:image-upload-list', 'helper:form-error', 'helper:and',
    'service:user-location', 'service:cookies', 'service:session', 'service:api',
    'service:geolocation', 'service:tracking', 'service:notification-messages', 'service:window-location',
    'service:fastboot', 'service:user', 'service:intercom'
  ],
  unit: true,

  setup() {
    this.container.registry.register('template:partials/content-form-buttons',
           resolver.resolve('template:partials/content-form-buttons'));
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  const locationPromise = new Ember.RSVP.Promise(resolve => resolve(Ember.Object.create({id: 1})));
  // Creates the component instance
  var component = this.subject({
    model: Ember.Object.create({
      images: [Ember.Object.create()],
      location: locationPromise
    })
  });

  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
