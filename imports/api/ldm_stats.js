import {Mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const LDM_Stats = new Mongo.Collection('ldm_stats')


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('ldm_stats', function tasksPublication(apps_array) {
    return LDM_Stats.find({
      "_id": { "$in": apps_array}
    });
  });
}
