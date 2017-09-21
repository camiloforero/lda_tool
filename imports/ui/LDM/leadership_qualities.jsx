import React, { Component } from 'react';
import Equalizer from 'react-equalizer';

var rb = require('react-bootstrap');

const quality_info = {
  'Empowering Others':{
    description:"“I am able to communicate ideas clearly, engage in meaningful conversations with others, and co-create spaces of collaboration that empower people to take action.”",
    color:"#F15B43",
    qualities: [
      'Communicates effectively in diverse environments',
      'Develops & empowers other people',
      'Engages with others to achieve a bigger purpose'
    ]
  },
  'Solution Oriented':{
    description:"“I come up with solutions to challenges. I am flexible and I am always ready to take the necessary risks .Every time I fall I always stand back up.”",
    color:"#955BA5",
    qualities: [
      'Adapts and shows resilience in the face of challenges',
      'Transmits positivity to move forward throughout uncertainty',
      'Takes risks when its needed'
    ]
  },
  'World Citizen':{
    description:"“I am aware of what is going on in the world and enjoy taking an active role in contributing towards making it a better place for everyone.”",
    color:"#27B999",
    qualities: [
      'Believes in their ability to make a difference in the world',
      'Interested in world issues',
      'Enjoys taking responsibility for improving the world'
    ]
  },
  'Self Aware':{
    description:"“I know what I am good at, what’s important to me, and what I am passionate about. I am constantly exploring what I want to achieve in my life.” ",
    color:"#FFC845",
    qualities: [
      'Understands and lives personal values',
      'Focusing on strengths over weaknesses',
      'Explore one’s passions',
    ]
  }
};

export default class Qualities extends Component {


  render_subqualities() {
    quality_data = this.props.reduced_stats[this.props.selected_quality];
    if(quality_data){
      return Object.keys(quality_data['subscores']).map((key) => {
        return (
          <Equalizer>
            <rb.Col xs={7}>
              <div className="text-center defining-element-div" style={{backgroundColor:quality_info[this.props.selected_quality]['color']}}>
                {key}
              </div>
            </rb.Col>
            <rb.Col xs={5}>
              <div className="text-center defining-element-percentage" style={{backgroundColor:quality_info[this.props.selected_quality]['color']}}>
                {Math.round(quality_data['subscores'][key]/16*100)}%
              </div>
            </rb.Col>
          </Equalizer>
        )

      })
    }
    else {
      return <div className="text-center defining-element-div">Acá aparecerán los resultados cuando carguen</div>
    }


  }

  render() {
    console.log(this.props.selected_quality);
    return (
        <rb.Row style={{backgroundColor:quality_info[this.props.selected_quality]['color']}}>
          <rb.Col xs={12}>
            <div className="text-center quality-div">
              {quality_info[this.props.selected_quality]['description']}
            </div>
          </rb.Col>
          {this.render_subqualities()}
        </rb.Row>
    )
  }
}
