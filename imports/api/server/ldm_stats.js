import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {LDM_Stats} from '/imports/api/ldm_stats';

const Applications = new Mongo.Collection('applications')

Meteor.methods({
  'ldm_stats.update'(office, type, start_date, end_date) {
    console.log("Hello world" + office);

    error_callback = function(err) {
      console.log("Error capturado en el error callback de ldm_stats");
      console.log(err)
    }


    applications_callback = function(response) {

      ldm_callback = function(app_id) {
        //Esta función retorna otra función, que si recibe el parámetro de respuesta. El app_id es para asegurar que este está en el scope de la función
        return (response) => {
          console.log("ldm response: " + app_id);
          if (response instanceof Array) {
            for (i = 0; i<response.length; i++) {
              ldm_res = response[i];
              if(ldm_res["application_id"])
              {
                upsert_result = LDM_Stats.upsert(
                  { "_id": ldm_res["application_id"]},
                  { "_id": ldm_res["application_id"], "body": ldm_res});
                console.log("Success insertando");
                console.log(upsert_result);
              }
            }

          }
          else {
            console.log(response);
            console.log("No se cargó la oportunidad con ID " + app_id);
          }

        }
        console.log("Fin del callback de carga de LDM")

      }
      // console.log("Success callback en ldm_stats.js");
      // console.log(response);
      // console.log(response["paging"]);
      // console.log(response["data"][0]);
      // console.log(response["data"][0]["person"]);
      // console.log(response["data"][0]["opportunity"]);
      missing_opps = new Set();
      all_ops = []
      console.log("reponse:")
      console.log(response);
      for (i = 0; i<response["data"].length; i++) {
        appl = response["data"][i];
        all_ops.push(appl["id"]);
        saved_app = LDM_Stats.findOne(
          {"_id": appl["id"]}
        )
        if (saved_app === undefined) {
          console.log(`No se encontró una aplicación con id ${appl["id"]}, se cargará la oportunidad con id ${appl["opportunity"]["id"]}`)
          missing_opps.add(appl["opportunity"]["id"])
        }
        else {
          console.log(`Si se encontró la aplicación con id ${appl["id"]}, de la oportunidad ${appl["opportunity"]["id"]}, no hay que hacer nada más`)
        }

      }
      console.log(`Se tienen ${missing_opps.size} oportunidades únicas, cargando...`)
      for (let id of missing_opps) {
        ExpaCalls.get_lda_results(id, ldm_callback(id))
      }
      console.log("Fin del callback de cargar todo");
      return all_ops
    }


    apps_promise = ExpaCalls.get_applications(office, type, start_date, end_date).then(applications_callback).catch(error_callback);
    console.log(apps_promise)
    return apps_promise;



  }
})
