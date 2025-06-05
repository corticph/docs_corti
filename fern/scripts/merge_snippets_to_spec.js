const fs = require('fs');
const path = require('path');

// Paths to the swagger.json and snippets folder
const swaggerPath = path.join(__dirname, '..', '..', 'api-reference', 'swagger-spec.json');
const snippetsPath = path.join(__dirname, '..', '..', 'snippets', 'sdk');
const outputPath = path.join(__dirname, '..', '..', 'api-reference', 'swagger-doc.json'); // New file path

// Load JSON files
const loadJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Save JSON file
const saveJson = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Merge snippets into swagger.json
const mergeSnippetsIntoSwagger = () => {
    const swagger = loadJson(swaggerPath);

    // Read all snippet files in the folder
    const snippetFiles = fs.readdirSync(snippetsPath);

    snippetFiles.forEach((file) => {
        const snippets = loadJson(path.join(snippetsPath, file));

        snippets.endpoints.forEach((snippet) => {
            const { snippet: snippetData } = snippet;
            const { path: endpointPath, method } = snippet.id;
            const endpoint = swagger.paths[endpointPath]?.[method.toLowerCase()];

            // console.log({ endpointPath, method, snippetData, snippet });

            if (endpoint) {
                endpoint['x-codeSamples'] = endpoint['x-codeSamples'] || [];
                endpoint['x-codeSamples'].push({
                    lang: snippetData.type,
                    label: `${snippetData.type.charAt(0).toUpperCase()}${snippetData.type.slice(1)} SDK`,
                    source: snippetData.client,
                });
            }
        });
    });

    saveJson(outputPath, swagger); // Save to the new file
    console.log(`Snippets merged into ${outputPath} successfully!`);
};

// Execute the merge
mergeSnippetsIntoSwagger();
