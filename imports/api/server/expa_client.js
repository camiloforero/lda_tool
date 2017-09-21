class _expa_calls {
  constructor() {
    auth_function = require('node-gis-wrapper');
    this.expaApi = auth_function('camilo.forero@aiesec.net', 'cr2rx6tS');
  }

  /**
  *This Error callback will print the nature of the error, and will return whichever value or function is passed to it.
  */
  error_callback(err) {
    console.log("The error callback caught the following error from the ExpaClient module:")
    console.log(err)
  }

  /**
  * @param {string} type - Whether applications are incoming or outgoing
  * @return A JSON object with all the applications of the given stage, in the given start and end date
  */
  get_applications(office, type, stage, start_date, end_date) {
    inter_dict = {
            'applied': 'created_at',
            'accepted': 'date_matched',
            'an_signed': 'date_an_signed',
            'approved': 'date_approved',
            'realized': 'date_realized',
            }
    query_args = {
      'filters[programmes]':[1, 2, 5],
      page:1,
      per_page:50,
    };
    query_args[`filters[${inter_dict[stage]}[from]]`] = start_date
    query_args[`filters[${inter_dict[stage]}[to]]`] = end_date
    if (type == 'outgoing') {
      query_args['filters[for]'] = 'people'
      query_args['filters[person_committee]'] = office
    }
    else if (type == 'incoming') {
      query_args['filters[opportunity_committee]'] = office
    }
    console.log(query_args)
    console.log('async test 1')
    return this.expaApi.get('applications.json', query_args)
      .then((res) => {console.log('success async'); return JSON.parse(res)},
        (err) => {console.log('error dentro del thenable'); console.log(err)});
    console.log('async test 2')
  }

  get_people(office, stage, start_date, end_date) {
    inter_dict = {
            'registered': 'registered',
            'contacted': 'contacted',
            }
    query_args = {
      page:1,
      per_page:50,
      'filters[home_committee]': office
    };
    query_args[`filters[${inter_dict[stage]}[from]]`] = start_date
    query_args[`filters[${inter_dict[stage]}[to]]`] = end_date
    console.log(query_args)
    console.log('async test 1')
    return this.expaApi.get('people.json', query_args)
      .then((res) => {console.log('success async'); return JSON.parse(res)},
        (err) => {console.log('error dentro del thenable'); console.log(err)});
    console.log('async test 2')
  }

  update_person(person, new_data) {
    return this.expaApi.patch(`people/${person}.json`, {'person': new_data})
      .then((res) => res, this.error_callback)
  }


  get_lda_results(op_id, callback) {

    error_callback = function(err) {
      console.log("Error capturado en el error callback de expa_client, get_lda_results");
      console.log(err)
      throw err
    }

    lda_results = this.expaApi.get('ldm/report.json', {opportunity_id: op_id});
    checking = lda_results.then(callback).catch(error_callback);
  }

}

ExpaCalls = new _expa_calls()
