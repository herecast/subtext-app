import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | listserv-user-testing');

test('Site title when feature flag "listserv-user-testing"', function(assert) {
  server.create('feature', {
    name: 'listserv-user-testing',
    active: true
  });

  visit('/');
  andThen(()=> {
    const $brand = find(testSelector('brand'));
    assert.ok($brand.text().indexOf('Test') > 0,
      'Has word "Test" in brand title'
    );
  });
});

test('Listserv pages site title when feature flag "listserv-user-testing"', function(assert) {
  server.create('feature', {
    name: 'listserv-user-testing',
    active: true
  });

  const listserv = server.create('listserv');

  visit(`/lists/${listserv.id}/subscribe`);
  andThen(()=> {
    const $brand = find(testSelector('brand'));
    assert.ok($brand.text().indexOf('Test') > 0,
      'Has word "Test" in title on list subscribe page'
    );
  });

  const post = server.create('listservContent');

  visit(`/lists/posts/${post.id}`);
  andThen(()=> {
    const $brand = find(testSelector('brand'));
    assert.ok($brand.text().indexOf('Test') > 0,
      'Has word "Test" in title on post confirmaton page'
    );
  });
});
