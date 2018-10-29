import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';


module('Unit | Component | social share', function(hooks) {
  setupTest(hooks);

  test('removes all non-alphanumeric characters when formatting hashtag', function(assert){
    const socialShare  = this.owner.factoryFor('component:social-share').create();
    socialShare.set('model', {
      organization: {
        name: "#1 Attorneys! ~ Dewey-Cheatham, and Howe"
      },
      contentType: 'news'
    });
    assert.equal(socialShare.get('orgHashtag'), '#1AttorneysDeweyCheathamandHowe');
  });

  test('returns empty string if not news or orgName is empty', function(assert){
    const socialShare  = this.owner.factoryFor('component:social-share').create();
    socialShare.set('model', {
      organization: {
        name: null
      },
      contentType: 'market'
    });
    assert.equal(socialShare.get('orgHashtag'), '');
  });
});
