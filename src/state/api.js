import fetch from 'node-fetch';
const GCVA_ENDPOINT = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.REACT_APP_GCVA_KEY}`;

const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

const getProcessedColors = colors => {
	return colors.filter(colorObj => colorObj.score > 0.01)
		.map(filteredColor => {
			const { red, green, blue } = filteredColor.color;

			return {
				rgb: `rgb(${red},${green},${blue})`,
				hex: rgbToHex(red, green, blue)
			};
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
				dominantColors: getProcessedColors(colors)
		}
	} catch (error) {
		return {
			error
		};
	}
};

export default generateMediaAnalysis;