import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'subtext-ui/tests/helpers/setup-mirage';

moduleForComponent('feed-card/talk-card', 'Integration | Component | feed card/talk card', {
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
  const model = server.create('content', {contentType: 'talk', contentId: 123});

  model.baseLocations = [];

  this.set('model', model);
  this.set('userLocation', {
    location: {},
    locationId: 0
  });

  this.render(hbs`{{feed-card/talk-card model=model userLocation=userLocation}}`);

  assert.ok(this.$());
});
