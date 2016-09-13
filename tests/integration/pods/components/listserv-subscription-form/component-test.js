import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import mirageInitializer from 'subtext-ui/initializers/ember-cli-mirage';

function startMirage(container) {
  mirageInitializer.initialize(container);
}

moduleForComponent('listserv-subscription-form', 'Integration | Component | listserv subscription form', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('when subscriber is not a dUV user and no active session', function(assert) {

  const model = {
    email: 'string',
    unsubscribed_at: null,
    user_id: null,
    listserv: {
      name: 'string',
      id: 1
    }
  };

  this.set('model', model);
  server.createList('location', 8);

  this.render(hbs`{{listserv-subscription-form model=model}}`);

  assert.equal($('select#location').length, 1, 'location selection should show');
  assert.equal($('input#name').length, 1, 'name input should show');
  assert.equal($('input#password').length, 1, 'password input should show');
  assert.equal($('.subscribe-button').length, 1, 'subscribe  button should show');

});
