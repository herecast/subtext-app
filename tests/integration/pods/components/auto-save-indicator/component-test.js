import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('auto-save-indicator', 'Integration | Component | auto save indicator', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  const subject = Ember.Object.create({
    status: 'draft'
  });

  this.set('subject', subject);

  this.render(hbs`
    {{#auto-save-indicator model=subject as |saveStatus|}}
      {{saveStatus}}
    {{/auto-save-indicator}}
  `);

  assert.equal(this.$().text().trim(), 'saved');

  this.set('subject.status', 'published');

  assert.equal(this.$().text().trim(), '');
});
