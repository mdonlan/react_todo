import React, { Component } from 'react';
import shortid from 'shortid';
import moment from 'moment';

import NewList from './NewList';
import CardView from './CardView';
import ListView from './ListView';
import TodoFilters from './TodoFilters';
import TopNav from './TopNav';
import Loading from './Loading';

import './Home.css';

import firebase from '../firebase.js';

class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      filteringCompleted: false,
      searchQuery: '',
      lists: [],
      isLoadingLists: false,
      cardView: true,
      userSignedIn: false,
      userId: null,
    };
  }

  componentDidMount() {

    // setup firebase auth watcher
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        //console.log('user is signed in');
        this.setState({
          userSignedIn: true,
          userId: user.uid,
        }, () => {
          //console.log(this.state.userId)
          this.getListsFromDB();
        });
      } else {
        // No user is signed in.
        //console.log('user is NOT signed in');

        // if user is not signed in show demo data
        let data = this.generateDemoData();
        this.setState({ lists: data })
        this.setState({isLoadingLists: false});
      }
    });
  };

  generateDemoData() {
    // random lists and notes for demo purposes
    let data = [
      {
        created: "Tuesday, June 19th 2018, 4:02:30 pm",
        editable: false,
        listKey: "__BJJvxcvbyDWm",
        listTitle: "Food Shopping",
        visible: true,
        notes: [
          {
            completed: false,
            created: "Tuesday, June 19th 2018, 10:59:28 pm",
            editable: false,
            key: "_S1tGQSvW7",
            onListKey: "__BJJvxcvbyDWm",
            todoText: "Pasta",
            visible: true,
          },
          {
            completed: false,
            created: "Tuesday, June 19th 2018, 10:59:28 pm",
            editable: false,
            key: "S_1tGQSvW7",
            onListKey: "__BJJvxcvbyDWm",
            todoText: "Milk",
            visible: true,
          },
          {
            completed: false,
            created: "Tuesday, June 19th 2018, 10:59:28 pm",
            editable: false,
            key: "S1_tGQSvW7",
            onListKey: "__BJJvxcvbyDWm",
            todoText: "Chicken",
            visible: true,
          },
        ],
      },
      {
        created: "Tuesday, June 19th 2018, 4:02:30 pm",
        editable: false,
        listKey: "BJJvbyDWm",
        listTitle: "Work Todo",
        visible: true,
        notes: [
          {
            completed: false,
            created: "Tuesday, June 19th 2018, 10:59:28 pm",
            editable: false,
            key: "S1t_GQSvW7",
            onListKey: "BJJvbyDWm",
            todoText: "Email Mark the quotes",
            visible: true,
          },
          {
            completed: false,
            created: "Tuesday, June 19th 2018, 10:59:28 pm",
            editable: false,
            key: "S1tG_QSvW7",
            onListKey: "BJJvbyDWm",
            todoText: "Meeting on Tuesday @ 5",
            visible: true,
          }
        ],
      },
    ]
    return data
  }

  getListsFromDB() {
    // run this after making sure user is signed in
    // get reference to firebase db
    //console.log(this.state.userId)
    this.setState({isLoadingLists: true});
    const todosDB = firebase.database().ref('todos/' + this.state.userId);
    //console.log(todosDB)
    // setup firebase event watcher
    // fires anytime a change is detected in todosDB
    todosDB.on('value', (snapshot) => {
      let lists = snapshot.val();
      let allLists = [];
      if(lists) {
        //console.log(lists)
        Object.keys(lists).forEach(function(obj) {
          // push each todo from the db to array
          allLists.push(lists[obj])
        });
        this.setState({ lists: allLists })
        this.setState({isLoadingLists: false});
      }
    });
  }

  createNewList = (data) => {
    let createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    let newList = {
      editable: false,
      listTitle: data,
      listKey: shortid.generate(),
      visible: true,
      created: createdAt,
      notes: [],
    }

    // this is a prop callback for adding new notes to the state
    let tempLists = this.state.lists;
    tempLists.push(newList);
    this.setState({lists: tempLists});

    // get reference to firebase db
    const db = firebase.database().ref('todos/' + this.state.userId);
    
    if(this.state.userSignedIn) {
      db.set(tempLists)
    } 
    
      //.then(res => {
      //  let key = res.getKey();
      //  firebase.database().ref().child('/todos/' + key)
      //    .update({ dbListKey: key});
      //})
  }

  createNewNote = (data) => {
    let createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    let newNote = {
      completed: false,
      editable: false,
      todoText: data.note,
      key: shortid.generate(),
      visible: true,
      created: createdAt,
      onListKey: data.thisListKey,
    }
    
    let allLists = this.state.lists;
    allLists.forEach((list) => {
      //console.log(list)
      //console.log(newNote)
      if(list.listKey === newNote.onListKey) {
        list.notes.push(newNote)
        const db = firebase.database().ref('/todos/' + this.state.userId);
        
        if(this.state.userSignedIn) {
          db.set(allLists)
        } 
      }
    })
  }

  deleteNote = (data) => {
    console.log('deteting note')
    // remove a note from the db
    // do this by finding the correct list and getting its notes
    // then splicing out the selected note
    // and update the db notes

    // finds correct list based on dbListKey
    let list = this.state.lists.find(function (item) { 
      return item.listKey === data.listKey;
    });

    // find which note to remove
    list.notes.forEach(function(item, index) {
      if(item.key === data.noteKey) {
        list.notes.splice(index, 1)
      }
    })

    let allLists = this.state.lists;
    
    const db = firebase.database().ref('todos/' + this.state.userId);

    if(this.state.userSignedIn) {
      db.set(allLists)
    }  else {
      
    }
    /*

    // update
    const db = firebase.database().ref(`/todos/` + data.listKey);
    db.update({ notes: list.notes});

    */
  }

  completedNote = (key) => {
    // callback for completing a todo

    // find which todo was selected
    // and get its indexes
    let selectedNote;
    let listIndex;
    let noteIndex;
    this.state.lists.forEach((list, index) => {
      list.notes.forEach((note, note_index) => {
        if(note.key === key) {
          selectedNote = note;
          listIndex = index;
          noteIndex = note_index;
        }
      })
    })

    // toggle completed
    let isCompleted;
    if(selectedNote.completed === true) {
      isCompleted = false;
    } else {
      isCompleted = true;
    }

    // if user is signed in then update in db
    // if NOT signed in update locally
    if(this.state.userSignedIn) {
      firebase.database().ref().child('/todos/' + this.state.userId + '/' + listIndex + '/notes/' + noteIndex)
      .update({ completed: isCompleted});
    } else {
      let lists = this.state.lists;
      let itemToUpdate = lists[listIndex].notes[noteIndex];
      if(itemToUpdate.completed) {
        itemToUpdate.completed = false;
      } else {
        itemToUpdate.completed = true;
      }

      this.setState({lists: lists})
      
    }
    
  }

  setEditMode = (data) => {
    console.log(data)
    // toggle each note to be editable or not

    let list = this.state.lists.find(function(item, index) {
      // loop through each list
      // if the data.listKey is the same as the current 
      // list key then weve found the correct list
      item.index = index;
      return item.listKey === data.listKey;
    })
    console.log(list)

    let note = list.notes.find(function(item, index) {
      item.index = index;
      return item.key === data.noteKey;
    })


    let allLists = this.state.lists;
    let onNote = allLists[list.index].notes[note.index];
    
    // toggle note editable

    if(onNote.editable === true) {
      onNote.editable = false;
    } else if(onNote.editable === false) {
      if(onNote.completed === false)
      onNote.editable = true;
    }

    this.setState({lists: allLists});

    /*

  
    let list = this.state.lists.find(function (item, index) { 
      console.log('testing')
      item.index = index;
      return item.key === key; 
    }); 
    
    // toggle complete status in the note by its index
    let allTodos = this.state.todos;
    if(allTodos[todo.index].editable === true) {
      allTodos[todo.index].editable = false;
    } else {
      // if not already editable and not completed
      if(allTodos[todo.index].completed === false) {
        allTodos[todo.index].editable = true;
      }
    }
    
    this.setState({todos: allTodos});
  */
  }

  saveEdit = (data) => {
    console.log(data)
    let key = data.key;
    // callback for saving changes to a note

    let selectedNote;
    let listIndex;
    let noteIndex;
    this.state.lists.forEach((list, index) => {
      list.notes.forEach((note, note_index) => {
        if(note.key === key) {
          selectedNote = note;
          listIndex = index;
          noteIndex = note_index;
        }
      })
    })


    // toggle completed
    let isCompleted;
    if(selectedNote.completed === true) {
      isCompleted = false;
    } else {
      isCompleted = true;
    }

    // set editable to false
    let allLists = this.state.lists;
    allLists[listIndex].notes[noteIndex].editable = false;
    this.setState({lists: allLists});

    // check if being passed null data
    // this can happen if the user clicked edit and 
    //then clicked save without changing anything
    if(data.value) {
      firebase.database().ref().child('/todos/' + this.state.userId + '/' + listIndex + '/notes/' + noteIndex)
        .update({ todoText: data.value, editable: false});
    } else {
      firebase.database().ref().child('/todos/' + this.state.userId + '/' + listIndex + '/notes/' + noteIndex)
        .update({editable: false});
    }

    

    /*
    // update state w/ new note text and turn off editing
    let todo = this.state.todos.find(function (item, index) { 
      item.index = index;
      return item.key === data[1]; 
    });

    let key = todo.dbKey;
    firebase.database().ref().child('/todos/' + this.state.userId + key)
      .update({ todoText: data[0], editable: false});
    
    */
  }

  toggleFilteringComplete = () => {
    if(this.state.filteringCompleted === true) {
      this.setState({filteringCompleted: false});   
    } else {
      this.setState({filteringCompleted: true});   
    }
  }

  updateSearchQuery = (data) => {
    this.setState({searchQuery: data});
  }

  updateListOrder = (data) => {
    // when a list changed locally send that upate to the server
    // data is new list order
    const db = firebase.database().ref('todos/' + this.state.userId);
    //console.log(data)
    if(this.state.userSignedIn) {
      db.set(data)
    } 
    
  }

  changeViewLayout = (data) => {
    // check which view button was pressed and set the view to that
    if(data === 'List') {
      this.setState({cardView: false});   
    } else {
      this.setState({cardView: true});   
    }
  }
  
  userSignedOut = () => {
    // the user has just signed out so we need to clear all their data
    this.setState({
      todos: [],
      filteringCompleted: false,
      searchQuery: '',
      lists: [],
      isLoadingLists: false,
      cardView: true,
      userSignedIn: false,
      userId: null,
    });

  }

  render() {
      return (
        <div className="homeContainer">
          {!this.state.userSignedIn && 
            <div className="notSignedInAlert">Warning! You are not signed in. Any notes created will not be saved.</div>
          }
          <TopNav 
            userSignedOut={this.userSignedOut}
            createNewList={this.createNewList} 
            filteringCompleted={this.state.filteringCompleted}
            toggleFilteringComplete={this.toggleFilteringComplete}
            updateSearchQuery={this.updateSearchQuery}
            changeViewLayout={this.changeViewLayout}
          />
          <div className="mainContainer">
            {/*}
            <LeftPanel 
              allLists={this.state.lists}
            />
            {*/}

            {/* 
              
              this.state.cardView && 
              checks if this.state.cardView is true and if so renders <CardView></CardView>
            
            */}
            {this.state.cardView && <CardView 
              allLists={this.state.lists}
              deleteNote={this.deleteNote}
              completedNote={this.completedNote}
              setEditMode={this.setEditMode}
              saveEdit={this.saveEdit}
              filteringCompleted={this.state.filteringCompleted}
              searchQuery={this.state.searchQuery}
              createNewNote={this.createNewNote}
              updateListOrder={this.updateListOrder}
              isLoadingLists={this.state.isLoadingLists}
              cardView={this.state.cardView}
            />}
            {!this.state.cardView && <ListView 
              allLists={this.state.lists}
              deleteNote={this.deleteNote}
              completedNote={this.completedNote}
              setEditMode={this.setEditMode}
              saveEdit={this.saveEdit}
              filteringCompleted={this.state.filteringCompleted}
              searchQuery={this.state.searchQuery}
              createNewNote={this.createNewNote}
              updateListOrder={this.updateListOrder}
              isLoadingLists={this.state.isLoadingLists}
              cardView={this.state.cardView}
            />}
          </div>
          {this.state.isLoadingLists &&
            <Loading />
          }
        </div>
      )
  }
};

export default Home;