import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dragActive: false
    };

    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }
  handleDragEnter = e => {
    e.preventDefault();

    this.setState({
      dragActive: true
    });
  }
  handleDragLeave = e => {
    e.preventDefault();

    this.setState({
      dragActive: false
    });
  }
  handleDrop = e => {
    e.preventDefault();

    console.log(e.dataTransfer);
  }
  render() {
    return (
      <div id="dropZone" className={'Dropzone' + (this.state.dragActive ? ' active' : '')}
        onDrop={this.handleDrop}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}>
        Drop an image file here or click to upload.
      </div>
    );
  }
}

export default App;
