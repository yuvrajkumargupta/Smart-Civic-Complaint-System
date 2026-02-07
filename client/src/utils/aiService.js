
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

let model = null;

export const loadModel = async () => {
    try {
        if (!model) {
            console.log("Loading MobileNet model...");
            model = await mobilenet.load();
            console.log("MobileNet model loaded.");
        }
        return model;
    } catch (error) {
        console.error("Failed to load AI model:", error);
        return null;
    }
};

export const classifyImage = async (imageElement) => {
    try {
        const net = await loadModel();
        if (!net) return null;

        // Classify the image.
        const predictions = await net.classify(imageElement);
        return predictions;
    } catch (error) {
        console.error("AI Classification failed:", error);
        return null;
    }
};

export const mapPredictionToCategory = (predictions) => {
    if (!predictions || predictions.length === 0) return null;

    // Mapping keywords to our categories
    const categoryKeywords = {
        road: ['pothole', 'manhole', 'street', 'asphalt', 'road', 'traffic light', 'bridge'],
        garbage: ['garbage', 'trash', 'waste', 'bin', 'container', 'can'],
        water: ['water', 'pipe', 'faucet', 'leak', 'drain'],
        electricity: ['light', 'lamp', 'electric', 'bulb', 'wire', 'pole']
    };

    // Look at top 3 predictions
    for (let i = 0; i < Math.min(predictions.length, 3); i++) {
        const className = predictions[i].className.toLowerCase();

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => className.includes(keyword))) {
                return {
                    category: category,
                    confidence: (predictions[i].probability * 100).toFixed(0),
                    detected: className
                };
            }
        }
    }

    return null; // No confident match found
};
