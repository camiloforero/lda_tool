class _expa_calls {
  constructor() {
    auth_function = require('node-gis-wrapper');
    this.expaApi = auth_function('dev.colombia@ai.aiesec.org', 'aiesec2020');
  }


  get_applications(office, type, start_date, end_date) {
    query_args = {
      'filters[date_approved[from]]':start_date,
      'filters[date_approved[to]]':end_date,
      'filters[programmes]':[1, 2, 5],
      page:1,
      per_page:400,
    };
    if (type == 'outgoing') {
      query_args['filters[for]'] = 'people'
      query_args['filters[person_committee]'] = office
    }
    else if (type == 'incoming') {
      query_args['filters[opportunity_committee]'] = office
    }
    return this.expaApi.get('applications.json', query_args);
  }

  get_lda_results(op_id, callback) {

    error_callback = function(err) {
      console.log("Error capturado en el error callback de expa_client, get_lda_results");
      console.log(err)
    }

    lda_results = this.expaApi.get('ldm/report.json', {opportunity_id: op_id});
    checking = lda_results.then(callback).catch(error_callback);
  }

}

ExpaCalls = new _expa_calls()
