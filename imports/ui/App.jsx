import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'

import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Index from './index.jsx';
import LDM from './LDM/ldm_index.jsx';
import Scoreboard from './scoreboard/scoreboard_index.jsx';


import {LDM_Stats} from '/imports/api/ldm_stats';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route exact path="/ldm" component={LDM}/>
            <Route exact path="/scoreboard" component={Scoreboard}/>
          </Switch>

        </div>
      </Router>

    );
  }
}

export default createContainer(() => {
  const ldmHandle = Meteor.subscribe('ldm_stats', Session.get('current_apps'));
  const applications = Meteor.subscribe('applications');
  const processed_stats = LDM_Stats.find().fetch().map((app) => {
    raw_results = app['body']['results'][0]
    results={};
    for (var [key, value] of Object.entries(raw_results)) {
      if (value instanceof Object) {
        results[key] = {
          score: value['score'],
          subscores: value['sub_scores'].reduce((acc, subscore) => {
            score = 0
            for (var i = 0; i < subscore['measurements'].length; i++) {
              score += Number(subscore['measurements'][i]['score']);
            }
            acc[subscore['sub_quality']] = score
            return acc
          }, {})
        }
      }
    }
    return {
      'program':app['body']['programme_id'],
      data:results
    }
  })
  return {
    ldm_stats: processed_stats
  };
}, App);
