import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'subtext-ui/tests/helpers/setup-mirage';

moduleForComponent('news-editor', 'Integration | Component | news editor', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    server.shutdown();
  }
});

test('it renders', function(assert) {
  const organizations = server.createList('organization', 3, { can_publish_news: true });
  this.set('organizations', organizations);

  this.render(hbs`{{news-editor organizations=organizations}}`);
  assert.ok(this.$());
});
