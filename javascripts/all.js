// import Vue from '../../vue';
// import firebase from '../../firebase';

// const Vue = require('Vue');
// const firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyB7RvFO4z78Y6tHGDlLgBXG-7PVD9Tm5P8",
    authDomain: "postit-6c3c4.firebaseapp.com",
    databaseURL: "https://postit-6c3c4.firebaseio.com",
    projectId: "postit-6c3c4",
    storageBucket: "postit-6c3c4.appspot.com",
    messagingSenderId: "1014638656236",
    appId: "1:1014638656236:web:6710e4645255ab96a883c9",
    measurementId: "G-FB6RM0490E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var postitsRef = firebase.database().ref('postit');
postitsRef.on('value', (snapshot)=>{
  vm.postits=snapshot.val()
});

var vm = new Vue({
  el: "#app",
  data: {
    colorList: [
      {
        name: "yellow",
        color: "#FFEB67"
      },
      {
        name: "blue",
        color: "#A5D8D6"
      },
      {
        name: "red",
        color: "#EF898C"
      },
      {
        name: "green",
        color: "#CBE196"
      }
    ],
    postits: [],
    nowId: -1,
    hoverId: -1,
    mousePos: {
      x: 0,
      y: 0
    },
    startMousePos: {
      x: 0,
      y: 0
    }
  },
  watch: {
    mousePos(){
      if(this.nowId != -1){
        let nowPostit = this.postits[this.nowId]
        nowPostit.pos = {
          x: this.mousePos.x - this.startMousePos.x,
          y: this.mousePos.y - this.startMousePos.y
        }
        postitsRef.child(this.nowId).set(nowPostit)
      }
    }
  },
  methods: {
    postgroupCss(id){
      return{
        left: this.postits[id].pos.x+"px",
        top: this.postits[id].pos.y+"px"
      }
    },
    postitCss(id){
      return{
        backgroundColor: this.colorList.find((o)=>
          o.name == this.postits[id].color).color
      }    
    },
    selectId(evt, id){
      if(evt.srcElement.className=="text"){
        this.nowId = -1
      }
      else{
        this.startMousePos = {
        x: evt.offsetX,
        y: evt.offsetY
        }
        this.nowId = id
      }
    },
    textCss(id){
      return{
        fontSize: (100/this.postits[id].text.length)+"px"
      } 
    },
    inputText(id){
      postitsRef.child(id).child("text").set(this.postits[id].text)
    },
    changeColor(id, c){
      this.postits[id].color = c.name
      postitsRef.child(id).child("color").set(this.postits[id].color)
    },
    addPostit(){
      postitsRef.push(
        {
          text: "",
          color: "yellow",
          pos: {
            x: 150 + Math.random()*100,
            y: 150 + Math.random()*100
          }
        }
      )
    },
    delPostit(id){
      postitsRef.child(id).remove();
    }
  }
});

window.onmousemove = (evt)=>{
  if(vm.nowId != -1){
    vm.mousePos = {
      x: evt.pageX,
      y: evt.pageY
    }
  }
}

window.onmouseup = (evt)=>{
  vm.nowId = -1
}