import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import Select from 'react-select';
import RadioImg from 'react-radioimg';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Equalizer from 'react-equalizer';

import {LDM_Stats} from '/imports/api/ldm_stats';

import LDM from './ldm_graph'
import Qualities from './leadership_qualities'
import TopBar from './top_options'

var rb = require('react-bootstrap');


//var RadioImg = require('react-radioimg')

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_quality:"Solution Oriented",
      filtered_stats:[],
      selected_program:'1',
      programs:[
        {
          btnCls: 'program btn',
          btnSelCls: 'btn program program_sel',
          val: '1',
          img:'/img/GV.png'
        },
        {
          btnCls: 'program btn',
          btnSelCls: 'btn program program_sel',
          val: '2',
          img:'/img/GT.png'
        },
        {
          btnCls: 'program btn',
          btnSelCls: 'btn program program_sel',
          val: '6',
          img:'/img/GE.png'
        }
      ]
    };
  };

  handleChange(e) {
    var change= {};
    change[e.target.name] = e.target.value
    this.setState(change);
  };

  reduced_stats() {
    filtered_stats = this.filtered_stats()
    answer = filtered_stats.reduce((acc, val) => {
      data = val['data']
      for (var [quality, value] of Object.entries(data)) {
        if (!(quality in acc)) {acc[quality] = {"score": value["score"]/filtered_stats.length, "subscores":{}}}
        else {acc[quality]["score"] += value["score"]/filtered_stats.length;}
        for (var [element, subscore] of Object.entries(value["subscores"])) {
          if (!(element in acc[quality]["subscores"])) {acc[quality]["subscores"][element] = subscore/filtered_stats.length}
          else {acc[quality]["subscores"][element] += subscore/filtered_stats.length;}
        }
      }
      return acc;
    }, {})

    return answer
  }

  filtered_stats () {
    console.log("wazowsky");
    return this.props.ldm_stats.filter(stat => stat.program == this.state.selected_program);
  }



  render() {
    return (
      <div>
        <rb.Grid fluid={true}>
          <rb.Row>
            <rb.Col xs={12}>
              <TopBar getApplications={(applications) => {this.setState({current_applications: applications})}}/>
            </rb.Col>
            <Equalizer>
              <rb.Col sm={6} xs={12} className="ldm-div">
                <LDM setLeadershipQuality={(quality) => {this.setState({selected_quality: quality})}} />
              </rb.Col>
              <rb.Col sm={6} xs={12} className="flex-vertical-align">
                <Qualities selected_quality={this.state.selected_quality} reduced_stats={this.reduced_stats()}/>
              </rb.Col>
            </Equalizer>
          </rb.Row>
        </rb.Grid>
        <rb.Grid>
          <rb.Row>
            <rb.Col sm={6} xs={12}>
              <RadioImg
                className="selected_program col-centered"
                options={this.state.programs}
                defaultValue={this.state.selected_program}
                marginSpace="10"
                onChange={(e) => {
                  this.setState({
                    selected_program: e.target.value
                  });
                }}
              />
            </rb.Col>            
          </rb.Row>
        </rb.Grid>
      </div>
    );
  }
}

export default createContainer(() => {
  const ldmHandle = Meteor.subscribe('ldm_stats', Session.get('current_apps'));
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
