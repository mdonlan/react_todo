import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

// icons
import faTrash from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faSave from '@fortawesome/fontawesome-free-solid/faSave';
import faDrag from '@fortawesome/fontawesome-free-solid/faArrowsAlt';

import NewNote from './NewNote';

import './Lists.css';
import Draggable from 'react-draggable';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';


class Lists extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      tempNote: '',
      filter: true,
      testArray: [
        'test1',
        'test2',
        'test3',
      ],
      activeElement: '',
      overElement: '',
      position: null,
      isOverlapping: false,
      activeBounds: '',
      overBounds: '',
      list: ['Box 1', 'Box 2', 'Box 3', 'Box 4'],
      allLists: this.props.allLists,
      isLoadingLists: this.props.isLoadingLists,
    };
  }

  componentWillReceiveProps(nextProps, props) {
    if(nextProps.allLists != props.allLists) {
      console.log('updating list state from db')
      this.setState({allLists: nextProps.allLists});
    }

    // on props update if
    nextProps.allLists.forEach(function(value, i) {
      //console.log(value);
    });
  }

  deleteTodo = (event) => {
    let data = {
      noteKey: event.target.dataset.key,
      listKey: event.target.dataset.dblistkey,
    }
    this.props.deleteNote(data);
  }

  completedTodo = (event) => {
    this.props.completedNote(event.target.dataset.key);
  }
  
  setEditMode = (event) => {
    // turn on edit mode
    
    this.props.setEditMode(event.target.dataset.key);
    this.setState({tempNote: event.target.dataset.text});
  }

  saveEdit = (event) => {
    // send new edit to parent to be added to state
    let tempEditData = [
      this.state.tempNote, 
      event.target.dataset.key,
    ]
   this.props.saveEdit(tempEditData);

   //after updating note text clear tempNote
   this.setState({tempNote: ''});
  }

  editedNote = (event) => {
    this.setState({tempNote: event.target.value});
  }

  createNewNote = (data) => {
    this.props.createNewNote(data);
  }

  filterLists = (item) => {
    
    if(this.props.filteringCompleted === true && this.props.searchQuery.length > 0) {
      // if filtering out complete and searching 
      if(item.completed === false) {
        if(item.todoText.indexOf(this.props.searchQuery) >= 0) {
          return item
        }
      }
    } else if(this.props.searchQuery.length > 0){
        // if searching filter out notes that don't match query
        return item.todoText.indexOf(this.props.searchQuery) >= 0;
    } else if(this.props.filteringCompleted === true) {

      // if todo is marked completed filter out of array
      return item.completed === false;
    } else {
      // if no filter return all
      return item
    }
  }

  filterNotes = (note) => {
    if(note !== 'empty') {
      return note
    }
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    // when a list has been moved and dropped in a new location upate its position in the state and db arrays
    let newLists = arrayMove(this.state.allLists, oldIndex, newIndex);
    this.setState({
      allLists: newLists
    });
    this.props.updateListOrder(newLists);
  }

  render() {
    
    const SortableItem = SortableElement(({value}) => {
      let isEditable = value.editable;
      return (
        <div className="list">
          <div className="top">
            <div className="title">{value.listTitle}</div>
            <FontAwesomeIcon className="dragButton" icon={faDrag} />
          </div>
          <NewNote 
            allLists={this.state.allLists}
            createNewNote={this.createNewNote}
            dbListKey={value.dbListKey}
          />

          {value.notes.filter(this.filterNotes).map((note, index) => {
        
        return (
          <div className="todoItem" key={note.key}>
            <div className="leftSideTodo">
              <div className="circleBackground">
                <div className="circleClickZone" onClick={this.completedTodo} data-key={note.key}></div>
                <FontAwesomeIcon className={(note.completed ? 'completeButtonComplete' : 'completeButtonDefault') + " button"} icon={faCheck} />
              </div>
              <textarea disabled={note.editable ? false : true} className={(note.completed ? 'todoTextFaded' : 'todoText') + ' ' + (note.editable ? 'editingTodo' : null)} defaultValue={note.editable ? this.state.tempNote : note.todoText} onChange={this.editedNote} ></textarea>
            </div>
            <div className="rightSideTodo">
              {isEditable ? 
                <FontAwesomeIcon visibility={note.editable ? 'visible' : 'hidden'} className="saveEditButton button" icon={faSave} onClick={this.saveEdit} data-key={note.key} /> 
                : 
                <FontAwesomeIcon visibility={note.editable ? 'hidden' : 'visible'} className="editButton button" icon={faPencil} onClick={this.setEditMode} data-key={note.key} data-text={note.todoText} />
                }
              <FontAwesomeIcon className="deleteButton button" icon={faTrash} onClick={this.deleteTodo} data-key={note.key} data-dblistkey={note.dbListKey} />
            </div>
          </div>
        )
        
      })}
        </div>
      ); 
    })
                                     
    const SortableList = SortableContainer(({items}) => {
        return (
          <div className="listsContainer">
            {items.map((item, index) => {
              return <SortableItem key={`item-${index}`} index={index} value={item} />;
            })}
          </div>
        );
    });

    return (
      <div className="listsWrapper">
        {this.props.isLoadingLists ?
        <SortableList items={this.state.allLists.filter(this.filterLists)} onSortEnd={this.onSortEnd} axis='xy' />
        :
        <div className="loadingContainer"></div>
      }
      </div>
      
    )
  }
}

export default Lists;