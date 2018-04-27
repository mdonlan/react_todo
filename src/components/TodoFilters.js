import React, { Component } from 'react';

import './todoFilters.css';

class TodoFilters extends Component {
  
  constructor(props) {
    super(props);

    this.state = {

    };
    

    this.clickedFilterCompleted = this.clickedFilterCompleted.bind(this);
  }

  clickedFilterCompleted(event) {
    this.props.toggleFilteringComplete();
  }


  render() {
    return (
      <div className="todoFiltersContainer">
        <div>Filter Completed</div>
        <input className="filterCompletedCheckbox" id="checkBox" type="checkbox" checked={this.props.filteringCompleted} onChange={this.clickedFilterCompleted}/>
      </div>
    )
  }
};

export default TodoFilters;