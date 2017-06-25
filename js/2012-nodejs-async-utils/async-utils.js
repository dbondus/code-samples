module.exports = {
    /**
     *
     * @param {Object[]} values
     * @param {Function} job
     * @param {Function} done
     * @param {int} [maxJobThreads]
     * @param {int} [checkNewJobInterval]
     * @param {int} [maxRetries]
     * @param {int} [retryDelay]
     */
    parallel: function parallel(values, job, done, maxJobThreads, checkNewJobInterval, maxRetries, retryDelay) {
        maxJobThreads || (maxJobThreads = 50);
        checkNewJobInterval || (checkNewJobInterval = 200);

        maxRetries || (maxRetries = 5);
        retryDelay || (retryDelay = 5*500);

        if(!job || !values || !values.length) {
            done && done('invalid params');
            return;
        }

        var cursor = 0,
            valueCnt = values.length,
            jobThreadCnt = 0,
            jobWatcher = null,
            status = {};

        var onJobFinish = function (cursor, err, data) {
            if(err) {
                //retry
                if(status[cursor] < maxRetries) {
                    status[cursor]++;
                    setTimeout(function() {
                        job(values[cursor], onJobFinish.bind(null, cursor));
                    }, retryDelay);
                    return;
                }

                console.log('JOB IS DEAD', values[cursor], JSON.stringify(err));

                delete status[cursor];
            }

            jobThreadCnt--;
        };

        var nextJob = function () {
            if(cursor == valueCnt && !jobThreadCnt) {
                clearInterval(jobWatcher);
                done && done();
                return;
            }

            for(var i = jobThreadCnt; cursor < valueCnt && i < maxJobThreads; i++) {
                jobThreadCnt++;

                status[cursor] = 0;

                job(values[cursor], onJobFinish.bind(null, cursor));
                cursor++;
            }
        };

        nextJob();
        jobWatcher = setInterval(nextJob, checkNewJobInterval);
    },

    /**
     *
     * @param {Function[]} jobs
     * @param {Function} each
     * @param {Function} done
     * @param {Object} [context]
     */
    sequence: function sequence(jobs, each, done, context) {
        if(!jobs || !jobs.length) {
            done && done.call(context, 'jobs list is empty');
            return;
        }

        var cursor = 0,
            jobsCnt = jobs.length;

        var onJobFinish = function(err, data) {
            if(err) {
                done && done.call(context, cursor + '::' + err);
                return;
            }

            each && each.call(context, cursor, data);

            cursor++;
            if(cursor == jobsCnt) {
                done && done.call(context);
                return;
            }

            jobs[cursor].call(context, onJobFinish);
        };

        jobs[cursor].call(context, onJobFinish);
    }
};