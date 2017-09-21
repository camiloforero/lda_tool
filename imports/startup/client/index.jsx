import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Session } from 'meteor/session'

import App from '/imports/ui/App.jsx';
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';


Meteor.startup(() => {
  Session.set('current_apps', []); //Set the current selected applications.
  render(<App />, document.getElementById('render-target'));
});
