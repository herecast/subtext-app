import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'subtext-ui/tests/helpers/setup-mirage';

moduleForComponent('feed-card/market-card', 'Integration | Component | feed card/market card', {
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
  const model = server.create('feedContent', {normalizedContentType: 'market'});
  model.baseLocations = [];

  this.set('model', model);
  this.set('userLocation', {
    locationId: 0,
    location: {
      name: "",
      id: 0
    }
  });

  this.render(hbs`{{feed-card/market-card model=model userLocation=userLocation}}`);

  assert.ok(this.$());
});
