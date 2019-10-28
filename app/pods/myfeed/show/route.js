import DetailRoute from 'subtext-app/mixins/routes/detail-route';
import ModalRoute from 'subtext-app/mixins/routes/modal-route';
import Route from '@ember/routing/route';

export default Route.extend(DetailRoute, ModalRoute, {

  _defaultParentModelPath: 'myfeed.index',
  _modalPathOverride: 'feed.show'
});
