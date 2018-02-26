import Ember from 'ember';
import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    images: {
      deserialize: 'records',
      serialize: false
    },
    comments: {
      deserialize: 'records',
      serialize: false
    },
    otherEventInstances: {
      deserialize: 'records',
      serialize: false
    },
    schedules: {
      embedded: 'always'
    },
    baseLocations: {
      deserialize: 'ids',
      serialize: false
    }
  },

  normalize(klass, data) {
    data['other_event_instances'] = data['event_instances'];
    delete data['event_instances'];

    return this._super(klass, data);
  },

  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // If a user creates a new venue, we need to nest it inside of a "venue"
    // namespace so the API knows to create it.
    if (!json.venue_id && json.venue_address) {
      json.venue = {};
      json.venue.address = json.venue_address;
      json.venue.city = json.venue_city;
      json.venue.name = json.venue_name;
      json.venue.state = json.venue_state;
      json.venue.status = json.venue_status;
      json.venue.venue_url = json.venue_url;
      json.venue.zip = json.venue_zip;
    }

    delete json.author_id;
    delete json.avatar_url;
    delete json.biz_feed_public;
    delete json.business_profile_id;
    delete json.campaign_end;
    delete json.campaign_start;
    delete json.click_count;
    delete json.comment_count;
    delete json.commenter_count;
    delete json.content_origin;
    delete json.created_at;
    delete json.embedded_ad;
    delete json.ends_at;
    delete json.event_instance_id;
    delete json.image_height;
    delete json.images;
    delete json.image_url;
    delete json.image_width;
    delete json.organization_name;
    delete json.organization_profile_image_url;
    delete json.organization_biz_feed_active;
    delete json.parent_content_id;
    delete json.parent_content_type;
    delete json.parent_event_instance_id;
    delete json.redirect_url;
    delete json.split_content;
    delete json.starts_at;
    delete json.updated_at;
    delete json.venue_address;
    delete json.venue_city;
    delete json.venue_name;
    delete json.venue_state;
    delete json.venue_url;
    delete json.venue_zip;
    delete json.view_count;


    // Remove embedded schedule attributes that should not be sent to the API
    json.schedules = json.schedules.map((schedule) => {
      return Ember.Object.create(schedule).getProperties(
        'days_of_week',
        'end_date',
        'ends_at',
        'id',
        'overrides',
        'presenter_name',
        '_remove',
        'repeats',
        'starts_at',
        'subtitle',
        'weeks_of_month'
      );
    });

    return json;
  }
});
