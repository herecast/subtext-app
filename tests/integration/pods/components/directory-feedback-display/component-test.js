import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('directory-feedback-display', 'Integration | Component | directory feedback display', {
  integration: true,
  setup() {
    startMirage(this.container);
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  const model = server.create('business-profile');

  this.set('model', model);

  this.set('actions', {
    editBusiness() {},
    claimBusiness() {},
  });

  this.render(hbs`{{directory-feedback-display
        model=model
        editBusiness=(action 'editBusiness')
        claimBusiness=(action 'claimBusiness')
  }}`);

  assert.ok(this.$('.DirectoryFeedback-top-bar').length > 0, 'no pass');
});
