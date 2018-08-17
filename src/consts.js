export const mediaLoadStates = {
  INITIAL: 'INITIAL',
  ANALYSIS_INITIATED: 'ANALYSIS_INITIATED',
  ANALYSIS_COMPLETE: 'ANALYSIS_COMPLETE',
  ANALYSIS_ERROR: 'ANALYSIS_ERROR'
};
export const REGEX_BASE64_FILTER = /^data:image\/(png|jpg|jpeg|gif);base64,/;
export const READER = new FileReader();
export const DEFAULT_COLORPALETTE = [{
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