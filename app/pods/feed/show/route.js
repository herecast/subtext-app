import DetailRoute from 'subtext-app/mixins/routes/detail-route';
import RedirectCasters from 'subtext-app/mixins/routes/redirect-casters';
import Route from '@ember/routing/route';

export default Route.extend(RedirectCasters, DetailRoute);
