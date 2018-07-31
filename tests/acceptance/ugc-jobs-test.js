import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import ugcMarket from 'subtext-ui/tests/pages/ugc-market';
import ugcTalk from 'subtext-ui/tests/pages/ugc-talk';
import ugcEvent from 'subtext-ui/tests/pages/ugc-event';
import mockCookies from 'subtext-ui/tests/helpers/mock-cookies';

moduleForAcceptance('Acceptance | ugc jobs', {
  beforeEach() {
    authenticateUser(this.application);

    // To remove the tooltip and allow jobs menu to be visible
    const location = server.create('location');
    mockCookies(this.application, {
      locationId: location.id,
      locationConfirmed: true
    });
  }
});

const Page = {
  visitRoot() {
    return visit('/');
  },

  clickOrangeButton() {
    return click(
      testSelector('button', 'open-job-tray')
    );
  },

  selectJob(jobName) {
    return click(
      testSelector('ugc-job-link') +
      testSelector('link', jobName)
    );
  }
};

function fillOutMarketForm() {
  ugcMarket.fillInTitle('test');
  ugcMarket.fillInDescription('test');
  ugcMarket.fillInEmail('test@test.com');
  ugcMarket.next();
  ugcMarket.next();
  ugcMarket.saveAndPublish();
}

function fillOutTalkForm() {
  ugcTalk.fillInTitle('test');
  ugcTalk.fillInDescription('test');
  ugcTalk.next();
  ugcTalk.next();
  ugcTalk.saveAndPublish();
}

function fillOutEventForm(opts) {
  ugcEvent.fillInTitle('test');
  ugcEvent.fillInDescription('test');
  ugcEvent.selectVenue(opts['venue']);
  ugcEvent.addSingleDate();
  ugcEvent.next();
  ugcEvent.next();
  ugcEvent.saveAndPublish();
}

/***
 * Market Jobs
 */
['Sell or give something away',
  'Buy, borrow or rent from your neighbors'].forEach((job) => {
  test(job, function(assert) {
    Page.visitRoot();
    Page.clickOrangeButton();
    Page.selectJob(job);

    andThen(function() {
      assert.equal(currentPath(), 'market.new.details');

      server.post('/contents', function({contents}) {
        const marketPostData = this.normalizedRequestAttrs();

        assert.equal(marketPostData['ugcJob'], job,
          "Includes job in api attributes"
        );

        const newPost = contents.create(marketPostData);

        return newPost;
      });

      fillOutMarketForm();
    });

    andThen(function() {
      assert.equal(currentPath(), 'feed.show');
    });
  });
});

/***
 * Talk Jobs
 */
['Ask your neighbors for a recommendation',
  'Make an announcement',
  'Ask your neighbors a question'].forEach((job) => {

  test(job, function(assert) {
    Page.visitRoot();
    Page.clickOrangeButton();
    Page.selectJob(job);

    andThen(function() {
      assert.equal(currentPath(), 'talk.new.details');

      server.post('/contents', function({contents}) {
        const talkPostData = this.normalizedRequestAttrs();

        assert.equal(talkPostData['ugcJob'], job,
          "Includes job in api attributes"
        );

        const newPost = contents.create(talkPostData);

        return newPost;
      });

      fillOutTalkForm();
    });

    andThen(function() {
      assert.equal(currentPath(), 'feed.show');
    });
  });
});

/***
 * Event Jobs
 */
['Post an event like a concert',
  'Post a recurring event like a yoga class'].forEach((job) => {

  // TODO: This functionality still works - but the test is broken. Something is happening on the event data entry page.
  test(job, function(assert) {
    const venue = server.create('venue');

    Page.visitRoot();
    Page.clickOrangeButton();
    Page.selectJob(job);

    andThen(function() {
      assert.equal(currentPath(), 'events.new.details');

      server.post('/contents', function({contents}) {
        const eventPostData = this.normalizedRequestAttrs();

        assert.equal(eventPostData['ugcJob'], job,
          "Includes job in api attributes"
        );

        const newPost = contents.create(eventPostData);

        newPost.attrs.eventInstanceId = newPost.attrs.eventInstanceId || server.create('eventInstance').id;
        newPost.save();

        return newPost;
      });

      fillOutEventForm({
        venue
      });
    });

    andThen(function() {
      assert.equal(currentPath(), 'feed.show-instance');
    });
  });
});
