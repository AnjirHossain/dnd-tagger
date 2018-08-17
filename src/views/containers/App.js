import React, {
  Component,
  Fragment
} from 'react';
import 'antd/dist/antd.css';
import placeHolderGradient from '../styles/Rectangle.png';

import generateMediaAnalysis from '../../state/api';
import {
  resetState,
  setUploadInitiatedStatus,
  setUploadError,
  setUnhandledError,
  setDragActive,
  setDragInactive,
  syncMediaAnalysis,
  dissmissError
}
from '../../state/stateChanges';

import {
  mediaLoadStates
} from '../../consts';

import Media from '../components/Media';
import ColorInspector from '../components/ColorInspector';
import Error from '../components/Error';
import LabelList from '../components/LabelList';

const REGEX_BASE64_FILTER = /^data:image\/(png|jpg|jpeg|gif);base64,/;
const READER = new FileReader();
const DEFAULT_COLORPALETTE = [{
    hex: '#E0E0E0',
    rgb: 'rgb(224,224,224)'
  },
  {
    hex: '#BDBDBD',
    rgb: 'rgb(189,189,189)'
  },
  {
    hex: '#9E9E9E',
    rgb: 'rgb(158,158,158)'
  },
  {
    hex: '#757575',
    rgb: 'rgb(117,117,117)'
  }
];
const dropZoneDefaultStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '300px',
  height: '300px',
  padding: '10px',
  textAlign: 'center'
};
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaLoaderMeta: {
        status: mediaLoadStates.INITIAL
      },
      currentMediaMeta: null,
      dragActive: false,
      error: null
    };

    READER.addEventListener('load', this.onFileReaderLoad);
  }

  // event handlers
  handleDragLeave = e => {
    e.preventDefault();
    this.setState(setDragInactive);
  }
  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    // set ui feedback to upload initiated state
    this.setState(setUploadInitiatedStatus);

    /* start: event validation cycle */
    const eType = e.type;

    if (eType !== 'change' && eType !== 'drop') {
       this.setState(setUnhandledError('Unrecognized event, check elements to ensure correct markup is in place'));
       return;
    }

    const fileInputSource = eType === 'change' ? this.fileUplRef : e.dataTransfer;
    const loadedMedia = fileInputSource.files[0];

    if (!loadedMedia || !loadedMedia.type.match(/image.*/)) {
      this.setState(setUploadError('Unrecognized file type, please provide one of png, jpg or gif formats'));
      return;
    }
    /* end: event validation cycle */

    // side effect warning
    READER.readAsDataURL(loadedMedia);
  }
  handleDragOver = e => {
    e.preventDefault();
    this.setState(setDragActive);
  }

  // side effect for controlled proxy input component
  triggerClick = () => {
    this.fileUplRef.click();
  }

  // api interaction handlers
  onFileReaderLoad = async () => {
    const readerResult = READER.result;
    const analysisPayload = await generateMediaAnalysis(readerResult.replace(REGEX_BASE64_FILTER, ''));

    this.setState(syncMediaAnalysis(analysisPayload, readerResult, analysisPayload.labels.join(' ')));
  }

  // ui composition handlers
  getDndCallToActionContent = () => {
    return <div id="dropZoneContainer"
      style={dropZoneDefaultStyles}
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
      <span style={{ margin: '10px' }}>
        Click or drag and drop an image here to begin analyzing
      </span>
    </div>;
  }
  getDndAnalysisInitiatedContent = () => {
    return <div style={{
      position: 'relative',
      display: 'flex',
      flexFlow: 'column wrap'
    }}>

      {/* color palatte place holder */}
      <ColorInspector isPlaceHolder={true} colors={DEFAULT_COLORPALETTE} />


      {/* image container place holder */}
      <Media src={placeHolderGradient}
        alt='Image processing gradient place holder' />
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
    const { currentMediaMeta } = this.state;
    const {
      dominantColors,
      labels,
      src,
      alt
    } = currentMediaMeta;

    return <div style={{
      position: 'relative',
      display: 'flex',
      flexFlow: 'column wrap',
      maxWidth: '300px'
    }}>
      {/* color palatte place holder */}
      <ColorInspector isPlaceHolder={false} colors={dominantColors} />
      {/* image container place holder */}
      <Media src={src || placeHolderGradient} alt={alt} />
      {/* image labels container place holder */}
      {
        <LabelList labels={labels}
          noLabels={!!labels && labels.length === 0 ? 'No labels with 75% accuracy or greater were found via the Google Cloud Vision API': null} />
      }
      {/* reset app state call to action */}
      <button onClick={() => {
          this.setState(resetState)
        }}
        style={{
          maxWidth: '50vw',
          WebkitAppearance: 'none',
          padding: '5px',
          margin: '5px 0px',
          backgroundColor: '#F44336',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}>
        Clear image
      </button>
    </div>;
  }
  getErrorContent = () => {
    return <Error dismissError={() => {
      this.setState(dissmissError);
    }} {...this.state.error} />
  }

  render = () => {
    const { mediaLoaderMeta, error } = this.state;
    const { status } = mediaLoaderMeta;

    let dndContent;
    let errorContent = !!error ? this.getErrorContent() : null;

    switch (status) {
      case mediaLoadStates.INITIAL:
        dndContent = this.getDndCallToActionContent();
        break;
      case mediaLoadStates.ANALYSIS_INITIATED:
        dndContent = this.getDndAnalysisInitiatedContent();
        break;
      case mediaLoadStates.ANALYSIS_COMPLETE:
        dndContent = this.getDndAnalysisCompleteContent();
        break;
      default:
        dndContent = 'Nothing to show, check App.js:render for errors';
    }

    return <Fragment>
      { errorContent }
      <div style={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '50vw'
      }}>
        { dndContent }
      </div>
    </Fragment>;
  }
}

export default App;
