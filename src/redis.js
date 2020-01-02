/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import redis from 'redis';
import bluebird from 'bluebird';
import errors from './errors';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
console.log('=======process.env.REDIS_URL=========', process.env.REDIS_URL);

const client = redis.createClient(process.env.REDIS_URL);

client.on('error', errors.report); // eslint-disable-line no-console

export default client;
