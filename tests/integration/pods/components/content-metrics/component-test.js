import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('content-metrics', 'Integration | Component | content metrics', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.setProperties({
    clicks: [
      Ember.Object.create({
        report_date: new Date(),
        click_count: 8
      })
    ],
    views: [
      Ember.Object.create({
        report_date: new Date(),
        view_count: 8
      })
    ]
  });

  this.render(hbs`{{content-metrics clicks=clicks views=views}}`);

  assert.ok(this.$().text());
});
