import React, { Component } from 'react';
import Select from 'react-select';
import RadioImg from 'react-radioimg';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import LDM from './ldm_graph'
import Qualities from './leadership_qualities'
import Equalizer from 'react-equalizer';

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
    //El estado esta muy grande, puede resultar confuso para alguien que quiera contribuír al código.
    //Tal vez se pueda hacer metodos con nombres dicientes que retornen objetos del estado. Por ejemplo,
    // en types depronto poner types: this.getTypes() y en getTypes retornar el arreglo . Eso haría que el código
    //sea mucho más fácil de leer y mantener.
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

  //chevere que utilice react bootstrap en vez de bootstrap normal. Hace que sea más fácil de leer.
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
            />{/*La X de la opcion país y universidad tiene dos problemas. Por un lado, al intentar navegar con chromebox en la barra de navegacion, la lee como
            "multiplication". Por otro lado, no hace nada al hacerle click*/}
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
            /> {/*No entiendo el authentication token, es como un login? si es asi, por qué no hacerlo como login normal de usuario/contraseña?*/}
          </rb.Nav>
        </rb.Navbar>
        <div className="container">

        </div>
        <rb.Grid>
          <rb.Row>
            <Equalizer>
              <rb.Col sm={6} xs={12} className="ldm-div">
                <LDM setLeadershipQuality={(quality) => {this.setState({selected_quality: quality})}} />
              {/*Los svg de LDM estan muy cheveres, el estilo está genial. Falta dos cosas: al pasar el mouse por encima
              sería util que cambiara como lo hace en links o botones para darle a entender al usuario que lo puede precionar,
              y agregarle que se pueda hacer foco pues navegando con chromebox no pude llegar ahí. Para esto ultimo tambien puede
              ser util agregarle funcionalidades de botones, es decir, que se presione al dalre espacio o enter al tenerlo en foco.*/}
              </rb.Col>
              <rb.Col sm={6} xs={12} className="flex-vertical-align">
                <Qualities selected_quality={this.state.selected_quality}/>
              {/*Sobre los qualities, a mi me visualizaba bien el blanco sobre el amarillo, pero como el profesor dijo eso puede 
              depender del monitor (o en el caso de la clase el videobeam) o los ojos del usuario. Si encuentra otro color que 
              vaya bien podría ser bueno cambiarlo, pero en lo personal me parece que se ve bien y no tuve problema. También
              podría ponerle un aria-live para que al cambiar, alguien que no pueda ver bien se entere que ese cuadro cambió */}
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
            {/*Tuve problemas con los datepickers al utilizar chromevox, pues el foco se enloquecía y saltaba de fecha inicio a 
            fecha fin y vice versa interminablemente, obligando al usuario que dependa enteramente de chromevox para navegar deba
            salirse de la pagina*/}
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

/*
Puntos que se me hacen importantes:
- Diseño de la página es muy llamativo, muy bonito. Depronto la barra de navegacion podria tener un color que combine con lo del centro.
- Falta el uso de mongo con los Meteor.methods
- Falta accesibilidad.
- Entiendo que es una página destinada a una organizacion, pero no se si el publico objetivo es cualquier persona o si 
es solo para uso interno. En cualquier caso creo que sería util poner una página de inicio que explique un poco de qué
se trata la página (urgente si cualquier persona puede entrar).
*/