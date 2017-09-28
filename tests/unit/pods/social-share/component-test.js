import { moduleForComponent, test } from 'ember-qunit';


moduleForComponent('social-share', 'Unit | Component | social share', {
  unit: true
});

test('removes all non-alphanumeric characters when formatting hashtag', function(assert){
  const socialShare  = this.subject();
  socialShare.set('model', {
    organization: {
      name: "#1 Attorneys! ~ Dewey-Cheatham, and Howe"
    },
    contentType: 'news'
  });
  assert.equal(socialShare.get('orgHashtag'), '#1AttorneysDeweyCheathamandHowe');
});

test('returns empty string if not news or orgName is empty', function(assert){
  const socialShare  = this.subject();
  socialShare.set('model', {
    organization: {
      name: null
    },
    contentType: 'market'
  });
  assert.equal(socialShare.get('orgHashtag'), '');
});
