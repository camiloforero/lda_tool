import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Equalizer from 'react-equalizer';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

var rb = require('react-bootstrap');


//var RadioImg = require('react-radioimg')

// App component - represents the whole app
export default class Scoreboard extends Component {
  constructor(props) {
    super(props);
    apps = require('/other_data/applications.json')
    this.state = {
      selected_entity:2010,
      selected_type:'outgoing',
      start_date:moment().subtract(30, 'days'),
      end_date:moment(),
      ep_managers: [
        1327711,
        1149831,
        1215826,
        1319835,
        1314039,
      ],
      applications: apps.data

    };
  };

  handleChange(e) {
    var change= {};
    change[e.target.name] = e.target.value
    this.setState(change);
  };

  componentWillMount() {
    //this.get_applications('applied');
    //this.get_people('registered');

  }

  get_applications(stage) {
    this.setState({
      is_loading:true
    })
    console.log('llamando a get_applications')
    apps = Meteor.call('applications',
      this.state.selected_entity,
      this.state.selected_type,
      stage,
      this.state.start_date.format('YYYY-MM-DD'),
      this.state.end_date.format('YYYY-MM-DD'),
      (err, res) => {
        if (err) {
          console.log("Error, capturado en el callback del llamado al método")
          console.log(err);
        } else {
          console.log('success');
          console.log(res);
        }
        new_state = {is_loading: false}
        new_state[stage] = res['data']
        this.setState(new_state)
    });
  }

  get_people(stage) {
    this.setState({
      is_loading:true
    })
    console.log('llamando a get_people')
    apps = Meteor.call('people',
      this.state.selected_entity,
      stage,
      this.state.start_date.format('YYYY-MM-DD'),
      this.state.end_date.format('YYYY-MM-DD'),
      (err, res) => {
        if (err) {
          console.log("Error, capturado en el callback del llamado al método")
          console.log(err);
        } else {
          console.log('success');
          console.log(res);
        }
        new_state = {is_loading: false}
        new_state[stage] = res.data
        this.setState(new_state)
    });
  }

  referral_aggregate(stage) {
    people = {}
    return this.state[stage].reduce(
      (acc, value, i) => {
        if(people[value.person.id]) { //Makes sure this person hasn't already been added to the count

        } else{
          referral = value.person.referral_type
          if(acc[referral]) {
            acc[referral].push(value.person)
          }
          else {
            acc[referral] = [value]
          }
        }
        return acc;

      }, {})
  }

  referral_count(stage) {
    people = new Set()
    console.log('referral count')
    return this.state[stage].reduce(
      (acc, value) => {
        if(people.has(value.person.id)) { //Makes sure this person hasn't already been added to the count
          ;
        } else{
          people.add(value.person.id)
          referral = value.person.referral_type
          if(acc[referral]) {
            acc[referral]['count'] ++
          }
          else {
            acc[referral] = {count: 1}
          }
        }
        return acc;

      }, {})
  }

  ep_manager_count(stage) {
    console.log('EP manager count')
    return this.state[stage].reduce(
      (acc, value) => {

        ep_manager = value.managers.find((manager) => {return this.state.ep_managers.includes(manager.id)})
        if(ep_manager == undefined) {
          ep_manager = {full_name: "None", id: NaN}
        }
        if(acc[ep_manager.full_name] == undefined) {
          acc[ep_manager.full_name] = {total_eps: 0, contacted_eps: 0, uncontacted_eps: 0, id: ep_manager.id};
        }
        current_manager = acc[ep_manager.full_name]
        current_manager['total_eps'] ++
        if (value.contacted_by) {
          current_manager['contacted_eps'] ++
        }
        else {
          current_manager['uncontacted_eps'] ++
        }

        return acc;

      }, {})
  }
  /**
  * This converts a dictionary looking like this:
  * {key1: {...values}, key2: {...values}, keyn: {...values}}
  * into an array of dicts looking like this:
  * [{name: key1, ...values}, {name: key2, ...values}, {name: keyn, ...values}]
  * where those dicts are created from th
  */
  dict_to_array(dict) {
    //console.log(dict)
    keys = Object.keys(dict);
    console.log(keys);
    new_array = keys.map((key) => {
      dict[key]['name'] = key
      return dict[key]
    })
    console.log(new_array)
    return new_array
  }

  count_by_country(dict) {
    return dict.reduce((acc, value) => {
      country = value.opportunity.office.country
      if(acc[country] == undefined) {
        acc[country] = {total_apps: 1, unique_apps: 1, unique_applicants: new Set([value.person.id])};
      }
      else {
        if (acc[country].unique_applicants.has(value.person.id)) acc[country].total_apps ++
        else {
          acc[country].unique_applicants.add(value.person.id)
          acc[country].total_apps ++
          acc[country].unique_apps ++
        }
      }
      return acc;
    }, {})
  }


  render() {
    return (
      <div>
        <h1>Hallo</h1>
        <div>
          {this.state.applied ?
          <BarChart width={600} height={300} data={this.dict_to_array(this.referral_count('applied'))}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
            : "HERE BE BAR CHART"}
        </div>
        <div>
          {true ?
          <BarChart width={600} height={300} data={this.dict_to_array(this.count_by_country(this.state.applications))}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Bar dataKey="total_apps" stackId ="b" fill="#8884d8" />
            <Bar dataKey="unique_apps" stackId ="a" fill="#30C39E" />
          </BarChart>
            : "HERE BE BAR CHART"}
        </div>

      </div>
    );
  }
}
