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

      server.post('/market_posts', function(db, request) {
        const marketPostData = JSON.parse(request.requestBody)['market_post'];

        assert.equal(marketPostData['ugc_job'], job,
          "Includes job in api attributes"
        );

        const newPost = server.create('marketPost', this.normalizedRequestAttrs());
        newPost.contentLocations.forEach((cl, index) => {
          cl.id = index+1;
        });
        server.create('feedContent', {id: newPost.id});

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

      server.post('/talk', function(db, request) {
        const talkPostData = JSON.parse(request.requestBody)['talk'];

        assert.equal(talkPostData['ugc_job'], job,
          "Includes job in api attributes"
        );

        const newPost = server.create('talk', this.normalizedRequestAttrs());
        newPost.contentLocations.forEach((cl, index) => {
          cl.id = index+1;
        });
        server.create('feedContent', {id: newPost.id});

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

      server.post('/events', function(db, request) {
        const eventPostData = JSON.parse(request.requestBody)['event'];

        assert.equal(eventPostData['ugc_job'], job,
          "Includes job in api attributes"
        );

        const feedContent = server.create('feedContent');
        const newPost = server.create('event', {contentId: feedContent.id});
        newPost.contentLocations.forEach((cl, index) => {
          cl.id = index+1;
        });

        newPost.attrs.firstInstanceId = newPost.attrs.firstInstanceId || server.create('eventInstance').id;
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
