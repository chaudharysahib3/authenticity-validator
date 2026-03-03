const preprocessText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 2);
};

const calculateTF = (words) => {
    const tf = {};
    words.forEach(word => {
        tf[word] = (tf[word] || 0) + 1;
    });

    Object.keys(tf).forEach(word => {
        tf[word] = tf[word] / words.length;
    });
    return tf;
}

const calculateIDF = (documents) => {
    const idf = {};
    const totalDocs = documents.length;

    documents.forEach(doc => {
        const uniqueWords = new Set(doc);
        uniqueWords.forEach(word => {
            idf[word] = (idf[word] || 0) + 1;
        });
    });
    Object.keys(idf).forEach(word => {
        idf[word] = Math.log(totalDocs / idf[word]);
    });
    return idf;
};

const calculateTFIDF = (tf, idf) => {
    const tfidf = {};
    Object.keys(tf).forEach(word => {
        tfidf[word] = tf[word] * (idf[word] || 0);
    });
    return tfidf;
}

const cosineSimilarity = (vec1, vec2) => {
    const words = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    words.forEach(word => {
        const v1 = vec1[word] || 0;
        const v2 = vec2[word] || 0;

        dotProduct += v1 * v2;
        magnitude1 += v1 * v2;
        magnitude2 += v1 * v2
    });

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
};

module.exports = {
    preprocessText,
    calculateTF,
    calculateIDF,
    calculateTFIDF,
    cosineSimilarity
};