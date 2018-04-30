import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyBrz2Jd2f3tSl1xOo0SLHBeZ75negt5l6A",
  authDomain: "react-todo-2123d.firebaseapp.com",
  databaseURL: "https://react-todo-2123d.firebaseio.com",
  projectId: "react-todo-2123d",
  storageBucket: "",
  messagingSenderId: "400451262892"
};

firebase.initializeApp(config);
export default firebase;