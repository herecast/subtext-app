import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'subtext-ui/tests/helpers/setup-mirage';

moduleForComponent('feed-card/event-card', 'Integration | Component | feed card/event card', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  const model = server.create('feedContent', {normalizedContentType: 'event'});
  model.baseLocations = [];

  this.set('model', model);
  this.set('userLocation', {
    locationId: 0,
    location: {
      name: "",
      id: 0
    }
  });

  this.set('model', model);

  this.render(hbs`{{feed-card/event-card model=model userLocation=userLocation}}`);

  assert.ok(this.$());
});
