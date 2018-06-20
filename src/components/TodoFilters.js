import React, { Component } from 'react';

import './TodoFilters.css';

class TodoFilters extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
    };
  }

  clickedFilterCompleted = (event) => {
    this.props.toggleFilteringComplete();
  }

  updateSearch = (event) => {
    // keep track of input in state
    this.setState({searchQuery: event.target.value}, () => {
      this.props.updateSearchQuery(this.state.searchQuery);
    });
    
  }

  changeViewLayout = (event) => {
    this.props.changeViewLayout(event.target.innerHTML);
  }


  render() {
    return (
      <div className="todoFiltersContainer">
        <div>Filter Completed</div>
        <input className="filterCompletedCheckbox" id="checkBox" type="checkbox" checked={this.props.filteringCompleted} onChange={this.clickedFilterCompleted}/>
        <input className="searchTodosInput" type="text" name="searchQuery" onChange={this.updateSearch} value={this.state.searchQuery} placeholder="search todos..." />
    {/* 
      <div>View</div>
        <div onClick={this.changeViewLayout}>Card</div>
        <div onClick={this.changeViewLayout}>List</div>
    */}
      </div>
    )
  }
};

export default TodoFilters;