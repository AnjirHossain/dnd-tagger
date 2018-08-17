# Image analysis using React and Google Cloud Vision API.

This project utilizes the [Google Cloud Vision API](https://cloud.google.com/vision/), to conduct annotations of uploaded media. Displaying the dominant colors and
most accurate image contents found by the api (accuracy tolerance is set to 75%).

### Checklist before running
1. Deployments are done using [zeit/now](https://zeit.co/docs/examples/create-react-app)
2. [Google Cloud Vision Api key](https://cloud.google.com/vision/docs/how-to)
3. `npm install`
4. `REACT_APP_GCVA_KEY=<google cloud vision api key> npm start`
