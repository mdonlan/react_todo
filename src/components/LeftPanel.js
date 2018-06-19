import React, { Component } from 'react';

import './LeftPanel.css';

class LeftPanel extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div className="leftPanelContainer">
        {this.props.allLists.map(function(list) {
          return (
            <div>{list.listTitle}</div>
          )
        })}
      </div>
    )
  }
};

export default LeftPanel;