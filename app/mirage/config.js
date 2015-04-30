import Ember from 'ember';
import moment from 'moment';

// This is just a dumb method to make it look like we're doing filtering
function filterByCategory(events, category) {
  if (category === 'everything') {
    return events;
  } else {
    const size = 20 + category.length;
    const shuffled = events.slice(0);
    let i = events.length;
    let temp, index;

    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }

    return shuffled.slice(0, size);
  }
}

function filterByDate(events, startDate, endDate) {
  if (!!startDate && !!endDate) {
    const queryStart = moment(startDate);
    const queryEnd = moment(endDate).endOf('day');

    return events.filter((event) => {
      const eventStart = moment(event.starts_at);
      const eventEnd = moment(event.ends_at);

      return (eventStart >= queryStart && eventStart <= queryEnd) ||
        (eventEnd >= queryStart && eventEnd <= queryEnd);
    });
  } else {
    return events;
  }
}

export default function() {
  this.get('/events', function(db, request) {
    const params = request.queryParams;

    // The event index endpoint returns a subset of all available properties
    let events = db.events.map((event) => {
      return Ember.getProperties(
        event, 'id', 'content_id', 'content', 'image', 'cost', 'cost_type',
        'venue_name', 'venue_address', 'venue_city', 'venue_state',
        'venue_zipcode', 'venue_id', 'venue_latitude', 'venue_longitude',
        'venue_phone', 'venue_url', 'event_url', 'contact_phone', 'contact_email',
        'contact_url', 'title', 'subtitle', 'ends_at', 'starts_at'
      );
    });

    events = filterByCategory(events, params.category);
    events = filterByDate(events, params.startDate, params.stopDate);

    return {
      events: events,
      meta: {
        total: db.events.length
      }
    };
  });

  this.get('/events/:id');

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Default config
  */
  this.namespace = 'v1';    // make this `api`, for example, if your API is namespaced
  this.timing = 200;      // delay for each request, automatically set to 0 during testing

  /*
    Route shorthand cheatsheet
  */
  /*
    GET shorthands

    // Collections
    this.get('/contacts');
    this.get('/contacts', 'users');
    this.get('/contacts', ['contacts', 'addresses']);

    // Single objects
    this.get('/contacts/:id');
    this.get('/contacts/:id', 'user');
    this.get('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    POST shorthands

    this.post('/contacts');
    this.post('/contacts', 'user'); // specify the type of resource to be created
  */

  /*
    PUT shorthands

    this.put('/contacts/:id');
    this.put('/contacts/:id', 'user'); // specify the type of resource to be updated
  */

  /*
    DELETE shorthands

    this.del('/contacts/:id');
    this.del('/contacts/:id', 'user'); // specify the type of resource to be deleted

    // Single object + related resources. Make sure parent resource is first.
    this.del('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    Function fallback. Manipulate data in the db via

      - db.{collection} // returns all the data defined in /app/mirage/fixtures/{collection}.js
      - db.{collection}.find(id)
      - db.{collection}.where(query)
      - db.{collection}.update(target, attrs)
      - db.{collection}.remove(target)

    // Example: return a single object with related models
    this.get('/contacts/:id', function(db, request) {
      var contactId = +request.params.id;
      var contact = db.contacts.find(contactId);
      var addresses = db.addresses
        .filterBy('contact_id', contactId);

      return {
        contact: contact,
        addresses: addresses
      };
    });

  */
}
