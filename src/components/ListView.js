import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

// icons

import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';

import './ListView.css';


class ListView extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      activeNote: this.props.allLists[0],
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.allLists.length > 0) {
      this.setState({activeNote: nextProps.allLists[0]})
    }
  }

  componentDidUpdate() {
    console.log('list view has mounted')
  }

  setActiveList = (event) => {
    //console.log(event.target.dataset.listkey)
    //console.log(this.state.activeNote)
    let newActiveNote = this.props.allLists.find(list => list.listKey === event.target.dataset.listkey)
    this.setState({activeNote: newActiveNote});
  }

  render() {
    
    return (
      <div className="listViewContainer">
        <div className="listViewLeftSection">
          {this.props.allLists.map((list) => {
            return (
              <div className={(list.listKey === this.state.activeNote.listKey ? 'leftSectionAcitveItem' : 'leftSectionItem')} key={list.listKey} onClick={this.setActiveList} data-listkey={list.listKey}>{list.listTitle}</div>
            )
          })}
        </div>
        {this.state.activeNote && this.props.allLists.length > 0 && 
          <div className="activeNoteContainer">
          <div className="activeNote">
            <div className="activeNoteTitle">{this.state.activeNote.listTitle}</div>
              {this.state.activeNote.notes && this.state.activeNote.notes.map((item) => {
                return (
                  <div className="activeNoteItem" key={item.key}>
                    <div className="circleBackground">
                      <div className="circleClickZone" onClick={this.completedTodo} data-key={item.key}></div>
                      <FontAwesomeIcon className={(item.completed ? 'completeButtonComplete' : 'completeButtonDefault') + " button"} icon={faCheck} />
                    </div>
                    <div>{item.todoText}</div>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>
    )
  }
}

export default ListView;