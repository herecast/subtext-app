import Service from '@ember/service';
import EmberObject, { get } from '@ember/object';
import { run } from '@ember/runloop';

export default Service.extend({
  //Service for maintaining singular Ember runLoops
  jobQueue: EmberObject.create(),

  destroyJob: function(jobName) {
    let jobQueue = get(this, 'jobQueue');
    let job = jobQueue.get(jobName);

    run.cancel(job);
  },

  queueJob: function(jobName, job) {
    let jobQueue = get(this, 'jobQueue');

    if (jobQueue.get(jobName)) {
      this.destroyJob(jobName);
    }

    jobQueue.set(jobName, job);
  }
});
