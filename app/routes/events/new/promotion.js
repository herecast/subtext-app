import Ember from 'ember';
import Listservs from '../../../mixins/routes/listservs';
import Track from '../../../mixins/routes/track-pageview';

export default Ember.Route.extend(Listservs, Track, {
});
