// https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBPuR4W8ZrEFmXBqwBsigAxvaTT2WqzsHA
// const fetch = require('node-fetch');
import fetch from 'node-fetch';
const GCVA_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBPuR4W8ZrEFmXBqwBsigAxvaTT2WqzsHA';

const getGCVAHeaders = imageDataUrl => ({
    cors: 'no-cors',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        requests: [{
            image: {
                content: imageDataUrl
            },
            features: [{
                type: 'LABEL_DETECTION',
                maxResults: 10
            }]
        }]
    })
});

const generateMediaLabels = async imageDataUrl => {
    if (!imageDataUrl) throw new Error('No data url provided cant analyze');

    try {
        let resJson = await (await fetch(GCVA_ENDPOINT, getGCVAHeaders(imageDataUrl))).json();

        return resJson.responses[0].labelAnnotations
            .filter(ann => ann.score > 0.75)
            .map(filteredAnn => filteredAnn.description);
    } catch (error) {
        console.log('ERROR: ', error);

        return {
            error
        };
    }
};

export default generateMediaLabels;