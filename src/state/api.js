import fetch from 'node-fetch';
const GCVA_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBPuR4W8ZrEFmXBqwBsigAxvaTT2WqzsHA';

const getProcessColors = colors => {
    return colors.filter(colorObj => colorObj.score > 0.01)
        .map(filteredColor => {
            const { red, green, blue } = filteredColor.color;

            return `rgb(${red},${green},${blue})`;
        });
}

const getProcessLabels = labelAnnotations => {
    return labelAnnotations
        .filter(ann => ann.score > 0.75)
        .map(filteredAnn => filteredAnn.description.split(' ').join(''));
}

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
            },{
                type: 'IMAGE_PROPERTIES'
            }]
        }]
    })
});

const generateMediaAnalysis = async imageDataUrl => {
    if (!imageDataUrl) throw new Error('No data url provided cant analyze');

    try {
        const resJson = await (await fetch(GCVA_ENDPOINT, getGCVAHeaders(imageDataUrl))).json();
        const response = resJson.responses[0];

        let colors = response
            .imagePropertiesAnnotation
            .dominantColors
            .colors;
        const labelAnnotations = response.labelAnnotations;

        if (colors.length > 4) {
            colors = colors.slice(0,5);
        }

        return {
            labels: getProcessLabels(labelAnnotations),
            dominantColors: getProcessColors(colors)
        }
    } catch (error) {
        console.log('ERROR: ', error);

        return {
            error
        };
    }
};

export default generateMediaAnalysis;