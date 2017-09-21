import {Mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const OGV_Managers = new Mongo.Collection('ogv_managers')
OGV_Managers.schema = new SimpleSchema({
  _id: {type: Number},
  name: {type: String},
  email: {type: String},
  podio_email: {type: String},
  podio_id: {type: Number},
})

export const Global_Settings = new Mongo.Collection('global_settings')
Global_Settings.schema = new SimpleSchema({
  _id: {type: String},
  value: {type: String}
})

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('ogv_managers', function tasksPublication(apps_array) {
    return LDM_Stats.find({
      "_id": { "$in": apps_array}
    });
  });
}
