import React, { Component } from 'react';
import Select from 'react-select';
import RadioImg from 'react-radioimg';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import LDM from './ldm_graph'
import Qualities from './leadership_qualities'
import Equalizer from 'react-equalizer';
// cuando implementes el api que consume los servicios de la ONG como mencionaste en clase, asegurate de dejar eso en un modulo aparte y no dentro del componente que lo neceista.
var rb = require('react-bootstrap');

//var RadioImg = require('react-radioimg')

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_quality:"SO",
      selected_lc:1395,
      selected_country:1551,
      selected_program:"GV",
      start_date:moment(),
      end_date:moment(),
      lcs:{
        '1551': [
          { value: 1395, label: 'Andes'}, // sería bueno ser consistente con los nombres, o con minúscula o con mayúscila
          { value: 1877, label: 'TUNJA'},
          { value: 1858, label: 'EXTERNADO'},
          { value: 1479, label: 'UPB'},
          { value: 428, label: 'Rosario'},
        ],
        '1589': [
          { value: 1054, label: 'IPN'}, // Hay algún motivo técnico  o de negocio de porqué los valores tienen esos números?
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
      programs:[
      {
        btnCls: 'program btn',
        btnSelCls: 'btn program program_sel',
        val: 'GV',
        img:'/img/GV.png'
      },
      {
        btnCls: 'program btn',
        btnSelCls: 'btn program program_sel',
        val: 'GT',
        img:'/img/GT.png'
      },
      {
        btnCls: 'program btn',
        btnSelCls: 'btn program program_sel',
        val: 'GE',
        img:'/img/GE.png'
      }
    ],
    types:[
    {
      btnCls: 'btn btn-lg type',
      btnSelCls: 'btn btn-lg type type_sel',
      val: 'incoming',
      label:'Incoming'
    },
    {
      btnCls: 'btn btn-lg type',
      btnSelCls: 'btn btn-lg type type_sel',
      val: 'outgoing',
      label:'Outgoing'
    }
  ]
    };
  };



  updateLC(val) {
    this.setState({
      selected_lc: val.value
    })
     console.log("Selected local office: " + val["value"]);
  }

  updateCountry(val) {
    this.setState({
      selected_country: val.value,
      selected_lc: null
    })
     console.log("Selected country: " + val["value"]);
  }

  handleChange(e) {
    var change= {};
    change[e.target.name] = e.target.value
    this.setState(change);
  };

  startDateChanged(date) {
    console.log(date)
    this.setState({
      start_date: date
    });
  };
  endDateChanged(date) {
    this.setState({
      end_date: date
    });
  };

  // en este render aplicaste estilos inline. Mejor déjalos para un archivo .css. Además, todos eran iguales width:"20%", una razón más para dejarlo en otro archivo.
  render() {
    return (
      <div>
        <rb.Navbar>
          <rb.Navbar.Header>
            <rb.Navbar.Brand>
              LDM Assessment tool
            </rb.Navbar.Brand>
          </rb.Navbar.Header>
          <rb.Nav style={{width:"20%"}}>
            <Select
              name="selected_country"
              value={this.state.selected_country}
              options={this.state.countries}
              onChange={this.updateCountry.bind(this)}
            />
          </rb.Nav>
          <rb.Nav style={{width:"20%"}}>
            <Select
              name="selected_lc"
              value={this.state.selected_lc}
              options={this.state.lcs[this.state.selected_country]}
              onChange={this.updateLC.bind(this)}
            />
          </rb.Nav>
          <rb.Nav style={{width:"20%"}}>
            <rb.FormControl
              type="text"
              value={this.state.auth_token}
              name="auth_token"
              onChange={this.handleChange.bind(this)}
              placeholder="Authentication Token"
            />
          </rb.Nav>
        </rb.Navbar>
        <div className="container">

        </div>
        <rb.Grid>
          <rb.Row>
            <Equalizer>
              <rb.Col sm={6} xs={12} className="ldm-div">
                <LDM setLeadershipQuality={(quality) => {this.setState({selected_quality: quality})}} />
              </rb.Col>
              <rb.Col sm={6} xs={12} className="flex-vertical-align">
                <Qualities selected_quality={this.state.selected_quality}/>
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
                  })}}
              />
            </rb.Col>
            <rb.Col sm={3} xs={6}>
              <div className="col-centered">
                <RadioImg
                  className="type_selector vcenter"
                  options={this.state.types}
                  defaultValue={this.state.selected_type}
                  marginSpace="10"
                  onChange={(e) => {
                    this.setState({
                      selected_type: e.target.value
                    })}}
                />
              </div>
            </rb.Col>
            <rb.Col sm={3} xs={6}>
              <DatePicker
                selected={this.state.start_date}
                onChange={this.startDateChanged.bind(this)}
                dateFormat="YYYY-MM-DD"
              />
            </rb.Col>
            <rb.Col sm={3} xs={6}>
              <DatePicker
                selected={this.state.end_date}
                onChange={this.endDateChanged.bind(this)}
                dateFormat="YYYY-MM-DD"
              />
            </rb.Col>
            <rb.Col xs={12}>
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <td>Token</td>
                    <td>Pais</td>
                    <td>Comité</td>
                    <td>Programa</td>
                    <td>Tipo</td>
                    <td>Fecha inicio</td>
                    <td>Fecha fin</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{this.state.auth_token}</td>
                    <td>{this.state.selected_country}</td>
                    <td>{this.state.selected_lc}</td>
                    <td>{this.state.selected_program}</td>
                    <td>{this.state.selected_type}</td>
                    <td>{this.state.start_date.format('YYYY-MM-DD')}</td>
                    <td>{this.state.end_date.format('YYYY-MM-DD')}</td>
                  </tr>
                </tbody>
              </table>
            </rb.Col>
          </rb.Row>
        </rb.Grid>
      </div>
    );
  }
}
