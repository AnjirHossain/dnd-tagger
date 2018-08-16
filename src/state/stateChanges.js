import { mediaLoadStates } from '../consts';

export const resetState = (state, props) => ({
  mediaLoaderMeta: {
    status: mediaLoadStates.INITIAL
  },
  currentMediaMeta: null,
  dragActive: false,
  error: null
});

export const setUploadInitiatedStatus = (state, props) => ({
  mediaLoaderMeta: {
    status: mediaLoadStates.ANALYSIS_INITIATED
  }
});

export const setUploadError = message => {
  return (state, props) => ({
    ...resetState(state, props),
    error: {
      type: 'UPLOAD_ERROR',
      message
    }
  });
};

export const setUnhandledError = message => {
  return (state, props) => ({
    error: {
      type: 'UN-HANDLED ERROR',
      message
    }
  });
};

export const setDragInactive = (state, props) => ({
  dragActive: false
});

export const setDragActive = (state, props) => ({
  dragActive: true
});

export const dissmissError = (state, props) => ({ error: null });

export const setMediaMeta = (data, src, alt) => {
  return (state, props) => ({
    currentMediaMeta: {
      ...data,
      src,
      alt
    }
  });
};

export const setAnalysisCompleteStatus = (state, props) => ({
  mediaLoaderMeta: {
    status: mediaLoadStates.ANALYSIS_COMPLETE
  }
});

export const syncMediaAnalysis = (data, src, alt) => {
  return (state, props) => ({
    ...setMediaMeta(data, src, alt)(state, props),
    ...setAnalysisCompleteStatus(state, props)
  });
};