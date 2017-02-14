import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';


moduleForAcceptance('Acceptance | send as-is listserv post workflows', {
});

test('unverified post', function(assert) {
  const done = assert.async();
  const post = server.create('listservContent', {
    verifiedAt: null
  });

  server.patch('/listserv_contents/:id', (s, request) => {
    assert.equal(request.params.id, post.id,
      "It sends patch request to listserv content api endpoint, making the post verified"
    );
    done();
    return {};
  });

  visit(`/lists/confirm_post/${post.id}`);
});

test('Verified post', function(assert) {
  const post = server.create('listservContent', {
    verifiedAt: new Date()
  });

  visit(`/lists/confirm_post/${post.id}`);

  andThen(()=> {
    assert.equal(
      find(testSelector('error-message')).text().trim(),
      "You have already verified your post. Thank you.",
      "It displays message about already verifying post"
    );
  });
});
