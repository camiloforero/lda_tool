import moment from 'moment-timezone';
import Podio from 'podio-js';
import OGV_Managers from '/imports/api/collections';

export default class BatchJobs {

  ep_managers = [
    { name: 'Nusrat Kabir Prova', id: 1327711 },
    { name: 'Md Ragib Rakesh', id: 1149831 },
    { name: 'Syed Abeer Muhammad Kazi', id: 1215826 },
      { name: 'suranjana mehjabin', id: 1319835 },
      { name: 'Tanveer Ahmed', id: 1314039 },
  ]

  ep_managers_v2 = {
    1314039: { name: 'Tanveer Ahmed', podio_id: 192211246 },
    1327711: { name: 'Nusrat Kabir Prova', podio_id: 192211235 },
    1149831: { name: 'Md Ragib Rakesh', podio_id: 192211245 },
    1215826: { name: 'Syed Abeer Muhammad Kazi', podio_id: 192211234 },
    1319835: { name: 'suranjana mehjabin', podio_id: 192211244 },
    26395: { name: 'Louise T Kim', podio_id: 31630062 },
  }

  number = 0

  error_callback(err, origin) {
    console.log(err);
    date = moment();
    return `Error on date ${date}, while calling ${origin}`;
  }
  /**
  * This script takes all the new EXPA opens from the previous day, assigns them EP managers, and uploads them into PODIO
  */
  load_new_opens() {
    podio = new Podio.api({
      authType: 'app',
      clientId: 'aiesecinbangladesh',
      clientSecret: 'fOAQckyygj89qFGw3gTsO7vyrIExwS8KhccXAOeeC9mBpWc0KvZv2w4AFcykTX2p',
    });
    appId = 19156174;
    appToken = 'd4052a58d2354a9b9ca4e6d0b62c9308';
    podio.authenticateWithApp(appId, appToken, (err) => {
      if (err) throw new Error(err);
      podio.isAuthenticated().then(() => {
        // Ready to make API calls in here...
        result = ExpaCalls.get_people(2010, "registered", moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD'))
        .then( people => {
            //console.log(res)
            console.log(`Loading ${people.data.length} people`);
            return Promise.all(people.data.map((person) => {
              //console.log(person.managers)
              console.log(`Número de EP managers: ${person.managers.length}`);
              manager = "None";
              if (person.managers.length > 0) {
                manager = person.managers[0];
                manager = {name: manager.full_name, id: manager.id};
                return null;
              }
              else {
                console.log(this.ep_managers[this.number].id);
                console.log("Updating EP manager of " + person.full_name);
                this.number = (this.number + 1) % this.ep_managers.length;
                return ExpaCalls.update_person(person.id, {manager_ids: [this.ep_managers[this.number].id]});
              }
            }));
          })
          .then( people => {
            return Promise.all(people.map( res => {
              if (res != null) {
                console.log(`Success assigning EP manager (${res.managers[0].full_name}) to ${res.full_name}. Uploading to PODIO...`);
                podio_fields = {
                  151791638: {value: res.first_name},
                  151795763: {value: res.last_name},
                  151795764: {value: String(res.id)},
                  151795765: {value: this.ep_managers_v2[res.managers[0].id].podio_id},
                  151950042: {start: moment.tz(res.created_at, 'UTC').format("YYYY-MM-DD HH:mm:ss")},
                  151795766: {type: 'work', value: res.email},
                  151795768: {type: 'mobile', value: `${res.contact_info.country_code}${res.contact_info.phone}`}, // TODO: See how to get this info
                  151795772: {value: res.home_lc.name},
                  151795769: {value: '0 - Uncontacted'},
                  151818116: {value: res.referral_type }
                };
                console.log(podio_fields);
                return podio.request('POST', `item/app/${appId}`, {
                  fields: podio_fields
                });
              }
              else return null;
            }))
            .then( items => items.map(podio_item => {
              if (podio_item != null) console.log(`Success creating the new item with ID ${podio_item.item_id}`);
            }), err => {console.log(err);})

          })
          .catch( err => this.error_callback(err))
          .then( res => console.log(res));
      }).catch(err => console.log(err));
    });

  }
  /**
  * This script will take all opens who have registered since a date selected from within, and load them in PODIO. It will either create a new one or update their status
  */
  update_old_opens() {
    podio = new Podio.api({
      authType: 'app',
      clientId: 'aiesecinbangladesh',
      clientSecret: 'fOAQckyygj89qFGw3gTsO7vyrIExwS8KhccXAOeeC9mBpWc0KvZv2w4AFcykTX2p',
    });
    appId = 19156174;
    appToken = 'd4052a58d2354a9b9ca4e6d0b62c9308';
    podio.authenticateWithApp(appId, appToken, (err) => {
      if (err) throw new Error(err);
      podio.isAuthenticated().then(() => {
        result = ExpaCalls.get_people(
          2010,
          "registered",
          moment("2017-05-28").format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'))
          .then ( (people) => {
            console.log(`loading ${people.data.length} people`);
            people.data.map((person) => {
              // Here we are iterating through all the people returned by expaApi
              // We should prep all required values for the future PODIO item we will either create or update
              try { //If there is an error during any part of the map, it should be caught while allowing the rest to continue
                console.log("Printing person's information");
                console.log(`Names: ${person.first_name} - ${person.last_name}`);
                console.log(`Expa ID: ${person.id}`);
                console.log(`EP managers:`);
                person.managers.map(manager => console.log(manager.full_name));
                //FOr that one remember that if the EP manager in EXPA is undefined, there will be an error when trying to get their expa_id.
                //In this case, Camilo Forero should be assigned instead to take care of the matter
                console.log("Status: " + person.status);
                console.log("Registered date: " + person.created_at);
                console.log(moment.tz(person.created_at, 'UTC').format("YYYY-MM-DD HH:mm:ss"));

                console.log("---------------");
                console.log("");
                //
                podio.request('GET', `/search/app/${appId}/v2`, {
                  query: person.id,
                  ref_type: 'item',
                })
                .then( (podio_answer) => {
                  // Here, based on what podio returns, we know if it found one item, several items, or nothing, and act accordingly.
                  console.log(`Answer for ${person.id}:`)
                  console.log(podio_answer.results.length)
                  console.log("Showing what is inside the closure")
                  console.log(person.id)
                  ep_manager = person.managers.find( manager => this.ep_managers_v2[manager.id])
                  if (ep_manager == undefined) {
                    ep_manager = {podio_id: 83404463}
                  }
                  else {
                    ep_manager = this.ep_managers_v2[ep_manager.id]
                  }
                  ep_manager_podio = ep_manager['podio_id']
                  podio_fields = {
                    151791638: {value: person.first_name},
                    151795763: {value: person.last_name},
                    151795764: {value: String(person.id)},
                    151795765: {value: ep_manager_podio},
                    151950042: {start: moment.tz(person.created_at, 'UTC').format("YYYY-MM-DD HH:mm:ss")},
                    151795766: {type: 'work', value: person.email},
                    151795768: {type: 'mobile', value: String(person.country_code) + String(person.phone)}, // TODO: See how to get this info
                    151795772: {value: person.home_lc.name},
                  }
                  if(person.status == 'open') {
                    podio_fields[151795769] = {value: 'Uncontacted'}
                  }
                  else if (person.status == 'in progress') {
                    podio_fields[151795769] = {value: 'Applied at least once'}
                  }
                  else if (person.status == 'applied') {
                    podio_fields[151795769] = {value: 'Applied at least once'}
                  }
                  else if (person.status == 'accepted') {
                    podio_fields[151795769] = {value: 'Accepted at least once'}
                  }
                  else if (person.status == 'approved' || person.status == 'realized' || person.status == 'completed') {
                    podio_fields[151795769] = {value: 'Approved'}
                  }
                  else {
                    console.log("Unknown status: " + person.status)
                  }
                  console.log(podio_fields)
                  podio_answer.results.map((result) => console.log(result.id))
                  //If zero items were found, it will create a new one.
                  if(podio_answer.results.length == 0) {
                    podio.request('POST', `item/app/${appId}`, {
                      fields: podio_fields
                    })
                    .then(res => console.log(`Success creating the new item ${person.full_name}, with ID ${res.item_id}`), err => {console.log(`Error creando nuevo item ${person.full_name}`); console.log(err);})
                  }
                  //If exactly one item was found, it will be updated.
                  else if (podio_answer.results.length == 1) {
                    b = podio.request('PUT', `item/${podio_answer.results[0].id}`, {
                      fields: podio_fields
                    })
                    .then(res => console.log(`Success updating the item ${person.full_name}, with ID ${podio_answer.results[0].id}`), err => {console.log(`Error actualizando el nuevo item ${person.full_name}`); console.log(err);})
                  }

                  //If more than one item was found, it will throw an error
                  else {
                    console.log(`Throwing error: More than one item with EXPA_ID ${person.id} was found. Look up the matter`)
                    throw new Error(`More than one item with EXPA_ID ${person.id} was found. Look up the matter`)
                  }
                  console.log("---------------")
                  console.log("")

              }, (err) => {console.log('eror'), console.log(err)} )

            } catch(map_error) {
              console.log("Sync error inside the map, aborting...")
              console.log(map_error)
              throw map_error
              }
            })
          }, (err) => {
            this.error_callback(err, "load_old_opens")
          }
        )
      }).catch(err => console.log(err));

    });

  }

}
