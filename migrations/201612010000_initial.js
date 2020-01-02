/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Create database schema for storing user accounts, logins and authentication claims/tokens
// Source https://github.com/membership/membership.db
// prettier-ignore
module.exports.up = async db => {
  // User accounts
  await db.schema.createTable('users', table => {
    // UUID v1mc reduces the negative side effect of using random primary keys
    // with respect to keyspace fragmentation on disk for the tables because it's time based
    // https://www.postgresql.org/docs/current/static/uuid-ossp.html
    table.increments('id').notNullable().primary();
    table.string('display_name', 100);
    table.string('image_url', 200);
    table.string('password_hash', 128);
    table.timestamps(false, true);
  });

  // Users' email addresses
  await db.schema.createTable('emails', table => {
    table.increments('id').notNullable().primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('email', 100).notNullable();
    table.boolean('verified').notNullable().defaultTo(false);
    table.boolean('primary').notNullable().defaultTo(false);
    table.timestamps(false, true);
    table.unique(['user_id', 'email', 'verified']);
  });

  // External logins with security tokens (e.g. Google, Facebook, Twitter)
  await db.schema.createTable('logins', table => {
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('provider', 16).notNullable();
    table.string('id', 36).notNullable();
    table.string('username', 100);
    table.json('tokens').notNullable();
    table.json('profile').notNullable();
    table.timestamps(false, true);
    table.primary(['provider', 'id']);
  });

  await db.schema.createTable('stories', table => {
    table.increments('id').notNullable().primary();
    table.integer('author_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('title', 80).notNullable();
    table.string('url', 200);
    table.text('text');
    table.timestamps(false, true);
  });

  await db.schema.createTable('story_points', table => {
    table.integer('story_id').unsigned().references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.primary(['story_id', 'user_id']);
  });

  await db.schema.createTable('comments', table => {
    table.increments('id').notNullable().primary();
    table.integer('story_id').unsigned().references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('parent_id').unsigned().references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('author_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.text('text');
    table.timestamps(false, true);
  });

  await db.schema.createTable('comment_points', table => {
    table.integer('comment_id').unsigned().references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.primary(['comment_id', 'user_id']);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('comment_points');
  await db.schema.dropTableIfExists('comments');
  await db.schema.dropTableIfExists('story_points');
  await db.schema.dropTableIfExists('stories');
  await db.schema.dropTableIfExists('logins');
  await db.schema.dropTableIfExists('emails');
  await db.schema.dropTableIfExists('users');
};

module.exports.configuration = { transaction: true };
