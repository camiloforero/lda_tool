import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';
import Equalizer from 'react-equalizer';


var rb = require('react-bootstrap');


//var RadioImg = require('react-radioimg')

// App component - represents the whole app
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  handleChange(e) {
    var change= {};
    change[e.target.name] = e.target.value
    this.setState(change);
  };


  render() {
    return (
      <div>
        <Link to="/scoreboard">Scoreboard</Link>
        <Link to="/ldm">LDM</Link>
      </div>
    );
  }
}
