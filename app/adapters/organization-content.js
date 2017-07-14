import ApplicationAdapter from './application';
import config from 'subtext-ui/config/environment';

export default ApplicationAdapter.extend({
  urlForQuery(query) {
    return `${config.API_BASE_URL}/${config.API_NAMESPACE}/organizations/${query.organization_id}/contents`;
  }
});
