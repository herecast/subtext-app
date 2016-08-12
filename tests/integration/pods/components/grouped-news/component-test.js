import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { set } = Ember;

const promotionStub = Ember.Service.extend({
  find() {
    return { then() {} };
  }
});

moduleForComponent('grouped-news', 'Integration | Component | grouped news', {
  integration: true,

  beforeEach() {
    this.register('service:promotion', promotionStub);
    this.inject.service('promotion');
  }
});

test('it renders', function(assert) {
  assert.expect(1);
  const mockedNews = [{ publishedAt: 1 }, { publishedAt: 2 }];

  set(this, 'news', mockedNews);

  this.render(hbs`{{grouped-news news=news}}`);

  assert.equal(this.$().text().trim(), 'Top Stories');
});
