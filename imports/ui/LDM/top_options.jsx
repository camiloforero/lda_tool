import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import RadioImg from 'react-radioimg';
import DatePicker from 'react-datepicker';
import {Meteor} from 'meteor/meteor';
import Equalizer from 'react-equalizer';

var rb = require('react-bootstrap');

export default class TopOptions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      is_loading:false,
      selected_lc:1395,
      selected_country:1551,
      selected_type:'incoming',
      start_date:moment(),
      end_date:moment(),
      lcs:{
        '1551': [
          { value: 1395, label: 'Andes'},
          { value: 1877, label: 'TUNJA'},
          { value: 1858, label: 'EXTERNADO'},
          { value: 1479, label: 'UPB'},
          { value: 428, label: 'Rosario'},
        ],
        '1589': [
          { value: 1054, label: 'IPN'},
          { value: 1865, label: 'Tampico'},
          { value: 2134, label: 'Zacatecas'},
          { value: 2063, label: 'Irapuato'},
          { value: 2062, label: 'Celaya'},
          { value: 1891, label: 'Cuernavaca'},
          { value: 1866, label: 'Oaxaca'},
          { value: 1790, label: 'ITESM Toluca'},
        ]
      },
      countries:[
        { value: 1551, label: 'Colombia'},
        { value: 1589, label: 'México'},
      ],
    types:[
      {
        btnCls: 'btn btn-sm type',
        btnSelCls: 'btn btn-sm btn-success type type_sel',
        val: 'incoming',
        label:'Incoming'
      },
      {
        btnCls: 'btn btn-sm type',
        btnSelCls: 'btn btn-sm btn-info type type_sel',
        val: 'outgoing',
        label:'Outgoing'
      }
    ]
    };
  };

  handleChange(e) {
    var change= {};
    change[e.target.name] = e.target.value
    this.setState(change);
  };

  updateLC(val) {
    this.setState({
      selected_lc: val.value
    })
  }

  updateCountry(val) {
    this.setState({
      selected_country: val.value,
      selected_lc: null
    })
  }

  startDateChanged(date) {
    this.setState({
      start_date: date
    });
  };
  endDateChanged(date) {
    this.setState({
      end_date: date
    });
  };

  process_applications() {
    this.setState({
      is_loading:true
    })
    Meteor.call('ldm_stats.update',
      this.state.selected_lc,
      this.state.selected_type,
      'approved',
      this.state.start_date.format('YYYY-MM-DD'),
      this.state.end_date.format('YYYY-MM-DD'),
      (err, res) => {
        if (err) {
          console.log("Error, capturado en el callback del llamado al método")
          console.log(err);
        } else {
          console.log('success');
          console.log(res);
          Session.set('current_apps', res);
        }
        this.setState({
          is_loading:false
        })
    });

  }

  render () {
    return (
      <rb.Row>
        <Equalizer>
          <rb.Col xs={4} sm={3} className="search-field-top">
            <h4>MC</h4>
            <Select
              name="selected_country"
              value={this.state.selected_country}
              options={this.state.countries}
              onChange={this.updateCountry.bind(this)}
              clearable={false}
            />
          </rb.Col>
          <rb.Col xs={4} sm={3} className="search-field-top">
            <h4>LC</h4>
            <Select
              name="selected_lc"
              value={this.state.selected_lc}
              options={this.state.lcs[this.state.selected_country]}
              onChange={this.updateLC.bind(this)}
              clearable={false}
            />
          </rb.Col>
          <rb.Col sm={2} xs={4} className="flex-vertical-align top-padding">
            <RadioImg
              options={this.state.types}
              defaultValue={this.state.selected_type}
              marginSpace="10"
              onChange={(e) => {
                this.setState({
                  selected_type: e.target.value
                })}}
            />
          </rb.Col>
          <rb.Col sm={2} xs={6} className="top-padding">
            <DatePicker
              selected={this.state.start_date}
              onChange={this.startDateChanged.bind(this)}
              dateFormat="YYYY-MM-DD"
            />
            <DatePicker
              selected={this.state.end_date}
              onChange={this.endDateChanged.bind(this)}
              dateFormat="YYYY-MM-DD"
              className="top-margin"
            />
          </rb.Col>
          <rb.Col sm={2} xs={6} className="flex-vertical-align">
            <rb.Button
              onClick={!this.state.is_loading ? this.process_applications.bind(this) : null}
              className="custom-button"
              disabled={this.state.is_loading}
              bsSize="large">
              Search
            </rb.Button>
          </rb.Col>
        </Equalizer>

      </rb.Row>
    )
  }
}
