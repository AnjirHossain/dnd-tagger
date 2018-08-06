import React, {
  Component,
  Fragment
} from 'react';
import 'antd/dist/antd.css';
import '../styles/App.css';
import oval from '../styles/oval.svg';
import placeHolderGradient from '../styles/Rectangle.png';

import { Icon } from 'antd';
import generateMediaAnalysis from '../../state/api';

const REGEX_BASE64_FILTER = /^data:image\/(png|jpg|jpeg|gif);base64,/;
const READER = new FileReader();

const mediaLoadStates = {
  INITIAL: 'INITIAL',
  LOADING_INITIATED: 'LOADING_INITIATED',
  ANALYSIS_INITIATED: 'ANALYSIS_INITIATED',
  ANALYSIS_COMPLETE: 'ANALYSIS_COMPLETE'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaLoaderMeta: {
        status: mediaLoadStates.INITIAL
      },
      currentMediaMeta: null,
      dragActive: false
    };

    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.triggerClick = this.triggerClick.bind(this);

    this.getDndCallToActionContent = this.getDndCallToActionContent.bind(this);
    this.getDndAnalysisInitiatedContent = this.getDndAnalysisInitiatedContent.bind(this);
    this.getDndLoadingInitiatedContent = this.getDndLoadingInitiatedContent.bind(this);
    this.onFileReaderLoad = this.onFileReaderLoad.bind(this);

    READER.addEventListener('load', this.onFileReaderLoad);
  }
  handleDragLeave = e => {
    e.preventDefault();

    this.setState({
      mediaLoaderMeta: {
        status: mediaLoadStates.INITIAL,
        currentMedia: null
      },
      dragActive: false
    });
  }
  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    // set ui feedback to analysis initiated state
    this.setState({
      mediaLoaderMeta: {
        status: mediaLoadStates.ANALYSIS_INITIATED
      }
    });

    /* start: event validation cycle */
    const eType = e.type;

    if (eType !== 'change' && eType !== 'drop') {
      throw new Error('Unrecognized event');
    }

    const fileInputSource = eType === 'change' ? this.fileUplRef : e.dataTransfer;
    const loadedMedia = fileInputSource.files[0];

    if (!loadedMedia || !loadedMedia.type.match(/image.*/)) {
      throw new Error('Unrecognized file type');
    }
    /* end: event validation cycle */

    // side effect warning
    READER.readAsDataURL(loadedMedia);
  }
  handleDragOver = e => {
    e.preventDefault();
    this.setState({
      dragActive: true
    });
  }
  triggerClick = () => {
    this.fileUplRef.click();
  }
  onFileReaderLoad = () => {
    const readerResult = READER.result;

    generateMediaAnalysis(readerResult.replace(REGEX_BASE64_FILTER, ''))
      .then(data => {
        this.setState({
          currentMediaMeta: {
            ...data,
            src: readerResult
          },
        }, () => {
          this.setState({
            mediaLoaderMeta: {
              status: mediaLoadStates.ANALYSIS_COMPLETE
            }
          });
        });
      });
  }
  getDndCallToActionContent = () => {
    return <div id="dropZoneContainer"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '300px',
        height: '300px',
        backgroundColor: '#efefef'
      }}
      className={'Dropzone' + (this.state.dragActive ? ' active' : '')}
      onClick={this.triggerClick}
      onDrop={this.handleDrop}
      onDragOver={this.handleDragOver}
      onDragEnter={this.handleDragEnter}
      onDragLeave={this.handleDragLeave}>
      <input ref={fileUplRef => this.fileUplRef = fileUplRef}
        type="file"
        onChange={this.handleDrop}
        multiple="false"
        style={{ display: "none", zIndex: "-100" }}
        />
      <Icon style={{ margin: '10px' }} type="plus-circle-o" />
      <span style={{ margin: '10px' }}>
        Click or drag and drop an image here to begin analyzing
      </span>
    </div>;
  }
  getDndLoadingInitiatedContent = () => {
    return <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '300px',
      height: '300px',
      backgroundColor: '#efefef'
    }}>
      <img src={oval} alt='loading spinner' width='30px' height='30px'/>
      <span style={{ margin: '10px' }}>Uploading...</span>
    </div>;
  }
  getDndAnalysisInitiatedContent = () => {
    return <div style={{
      position: 'relative',
      display: 'flex',
      flexFlow: 'column wrap'
    }}>
      {/* color palatte place holder */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '900',
        margin: '10px',
        display: 'flex',
        flexDirection: 'row',
      }}>
        {['#E0E0E0','#BDBDBD','#9E9E9E','#757575'].map((el, index) => <span className='blinkers' key={index} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px',
          backgroundColor: el
        }}></span>)}
      </div>
      {/* image container place holder */}
      <div>
        <img src={placeHolderGradient}
          style={{
            width: '300px'
          }} />
      </div>
      {/* image labels container place holder */}
      <div style={{
        margin: '10px',
        display: 'flex',
        flexFlow: ''
      }}>
        <span className='blinkers'>loading labels...</span>
      </div>
    </div>;
  }
  getDndAnalysisCompleteContent = () => {
    const { state } = this;
    const { currentMediaMeta, currentMediaSrc } = state;
    const {
      dominantColors,
      labels,
      src
    } = currentMediaMeta;

    return <div style={{
      position: 'relative',
      display: 'flex',
      flexFlow: 'column wrap',
      maxWidth: '300px'
    }}>
      {/* color palatte place holder */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '900',
        margin: '10px',
        display: 'flex',
        flexDirection: 'row',
        border: '5px solid #fff'
      }}>
        {(dominantColors ? dominantColors : ['#E0E0E0','#BDBDBD','#9E9E9E','#757575']).map((el, index) => {
          return <span className={ dominantColors ? null : 'blinkers' } key={index} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '15px',
            backgroundColor: el
          }}></span>
        })}
      </div>
      {/* image container place holder */}
      <div>
        <img src={src || placeHolderGradient}
          style={{
            width: '300px'
          }}/>
      </div>
      {/* image labels container place holder */}
      <div style={{
        margin: '10px',
        display: 'flex',
        flexFlow: 'row wrap'
      }}>
        {
          labels ? labels.map((lText, lIndex) => {
            return <span style={{
              marginRight: '5px',
              marginBottom: '5px',
              padding: '5px',
              backgroundColor: '#eee' }} key={lIndex}>
              {`#${lText}`}
            </span>
          }) : (<span className='blinkers'>
            loading labels...
          </span>)
        }
      </div>
    </div>;
  }
  render = () => {
    const { state } = this;
    const { mediaLoaderMeta } = state;
    const { status } = mediaLoaderMeta;

    let dndContent;

    switch (status) {
      case mediaLoadStates.INITIAL:
        dndContent = this.getDndCallToActionContent();
        break;
      case mediaLoadStates.LOADING_INITIATED:
        dndContent = this.getDndLoadingInitiatedContent();
        break;
      case mediaLoadStates.ANALYSIS_INITIATED:
        dndContent = this.getDndAnalysisInitiatedContent();
        break;
      case mediaLoadStates.ANALYSIS_COMPLETE:
        dndContent = this.getDndAnalysisCompleteContent();
        break;
    }

    return (
      <div style={{
        display: 'flex',
        flexFlow: 'column wrap'
      }}>
        {
          dndContent || 'Nothing to show, check App.js:render for errors'
        }
      </div>
    );
  }
}

export default App;
