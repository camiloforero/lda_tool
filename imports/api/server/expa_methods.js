import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

Meteor.methods({
  applications (office, type, stage, start_date, end_date) {
    console.log(`Se está llamando el método para ver las aplicaciones de la oficina ${office}, ${type}, en la etapa ${stage}`);

    error_callback = function(err) {
      console.log("Error buscando aplicaciones, capturado en el método");
      console.log(err)
      throw err
    }
    console.log("Before calling the promise")
    apps_promise = ExpaCalls.get_applications(office, type, stage, start_date, end_date).catch(error_callback);
    console.log("After calling the promise")
    console.log(apps_promise)
    return apps_promise;
  },
  people (office, stage, start_date, end_date) {
    console.log(`Se está llamando el método para ver los aplicaciones de la oficina ${office}, ${stage}`);

    error_callback = function(err) {
      console.log("Error buscando personass, capturado en el método");
      console.log(err)
      throw err
    }
    console.log("Before calling the promise")
    people_promise = ExpaCalls.get_people(office, stage, start_date, end_date).catch(error_callback);
    console.log("After calling the promise")
    console.log(people_promise)
    return people_promise;
  }
})
