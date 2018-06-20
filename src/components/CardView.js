import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

// icons
import faTrash from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faSave from '@fortawesome/fontawesome-free-solid/faSave';
import faDrag from '@fortawesome/fontawesome-free-solid/faArrowsAlt';

import NewNote from './NewNote';
import Note from './Note';

import './CardView.css';

import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';


class CardView extends Component {
  
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
      viewType: false,
      activeNoteValue: null,
    };
  }

  componentDidMount() {
    //console.log(this.props)
  }

  componentWillReceiveProps(nextProps, props) {
    if(nextProps.allLists !== props.allLists) {
      //console.log('updating list state from db')
      this.setState({allLists: nextProps.allLists});
    }

    // on props update if
    nextProps.allLists.forEach(function(value, i) {
      //console.log(value);
    });
  }

  deleteTodo = (data) => {
    this.props.deleteNote(data);
  }

  completedTodo = (data) => {
    this.props.completedNote(data);
  }
  
  setEditMode = (data) => {
    this.props.setEditMode(data);
  }

  saveEdit = (event) => {

  let key = event.key;
  // this converts the nodelist returned by querySelectorAll into an array
  let todoTextElem = [...document.querySelectorAll(".todoText")];
  console.log(todoTextElem)

  let todoEditedValue;
  // find element that was changed
  todoTextElem.forEach((todo) => {
    if(todo.dataset.notekey === key) {
      // found correct note
      todoEditedValue = todo.innerHTML; 
    }
  });

  // send new edit to parent to be added to state
  let newData = {
    key: event.target.dataset.key,
    value: todoEditedValue,
  }

  this.props.saveEdit(newData);

   //after updating note text clear tempNote
   //this.setState({tempNote: ''});
  }

  editedNote = (data) => {
    //this.setState({tempNote: value})
    //console.log(data)
  }

  createNewNote = (data) => {
    this.props.createNewNote(data);
  }

  filterLists = (item) => {
    // only use to filter entire lists
    // ex - searching list names
    return item
  }

  handleSave = (data) => {
    //this.saveEdit(data)
    this.props.saveEdit(data);
  }

  filterNotes = (note) => {
    // user to filter individual notes on a list
    // ex - to check if a note matches the seach query

    if(this.props.searchQuery.length > 0) {
      // if query is longer than zero check to see if each note matches
        return note.todoText.indexOf(this.props.searchQuery) >= 0
    } else {
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
      if(!value.notes) {
        // this prevents lists w/out any notes from causing error w/ filtering undefined
        value.notes = [];
      }
      return ( 
        <div className="listCV" key={value.listKey}>
          <div className="top">
            <div className="title listTitle">{value.listTitle}</div>
            <FontAwesomeIcon className="dragButton" icon={faDrag} />
          </div>
          <NewNote 
            allLists={this.state.allLists}
            createNewNote={this.createNewNote}
            listKey={value.listKey}
          />
        
          {value.notes.filter(this.filterNotes).map((note, index) => {
            let isEditable = note.editable;
        
            return (
              <div key={note.key}>
                {this.props.filteringCompleted && note.completed === false && 
                  <Note
                    note={note}    
                    tempNote={this.state.tempNote} 
                    editedNote={this.editedNote}    
                    handleSave={this.handleSave}        
                    setEditMode={this.setEditMode} 
                    deleteTodo={this.deleteTodo}
                    completedNote={this.completedTodo}
                  />
                }
                {!this.props.filteringCompleted && 
                  <Note
                    note={note}    
                    tempNote={this.state.tempNote} 
                    editedNote={this.editedNote}    
                    handleSave={this.handleSave}        
                    setEditMode={this.setEditMode} 
                    deleteTodo={this.deleteTodo}
                    completedNote={this.completedTodo}
                  />
                }
              </div>
            )
          })}
        </div>
      ); 
    })
                                     
    const SortableList = SortableContainer(({items}) => {
        let listItems = items.map((item, index) => {
              return <SortableItem key={`item-${index}`} index={index} value={item} />;
            })
        return (
          <div className="listsContainerCV">
            {listItems}
          </div>
        );
    });

    return (
      <div className="listsWrapperCardView">
        <SortableList 
          items={this.state.allLists.filter(this.filterLists)} 
          onSortEnd={this.onSortEnd} 
          axis='xy' 
          distance={10}
        />
      </div>
    )
  }
}

export default CardView;