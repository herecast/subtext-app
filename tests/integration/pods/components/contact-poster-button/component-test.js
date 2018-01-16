import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { run } = Ember;
const contactPoster = 'contact-poster-button';

moduleForComponent('contact-poster-button', 'Integration | Component | contact poster button', {
  integration: true
});

test('it renders if model has contactEmail', function(assert) {
  assert.expect(2);
  this.set('model', {
    contactEmail: 'asdf@asdf.com'
  });
  this.set('testAction', () => {
    assert.ok(true, 'clickReplyButton action was invoked!');
  });


  this.render(hbs`{{contact-poster-button
      model=model
      clickReplyButton=(action testAction)
  }}`);

  assert.equal(this.$(`[data-test-link=${contactPoster}] span`).text().trim(), 'Contact');

  run(() => {
    this.$(`[data-test-link=${contactPoster}] span`).click();
  });
});

test('it renders if model has contactPhone', function(assert) {
  assert.expect(2);
  this.set('model', {
    contactPhone: '9999999999'
  });
  this.set('testAction', () => {
    assert.ok(true, 'clickReplyButton action was invoked!');
  });


  this.render(hbs`{{contact-poster-button
      model=model
      clickReplyButton=(action testAction)
  }}`);

  assert.equal(this.$(`[data-test-link=${contactPoster}] span`).text().trim(), 'Contact');

  run(() => {
    this.$(`[data-test-link=${contactPoster}] span`).click();
  });
});

test('it does not render a button if model had no contactEmail or contactPhone', function(assert) {
  assert.expect(1);
  this.set('model', {});

  this.render(hbs`{{contact-poster-button
      model=model
  }}`);

  assert.equal(this.$(`[data-test-link=${contactPoster}] span`).length, 0);
});
