const fs = require('fs');
const path = require('path');

// Paths to the swagger.json and snippets folder
const swaggerPath = path.join(__dirname, '..', '..', 'api-reference', 'swagger-spec.json');
const snippetsPath = path.join(__dirname, '..', '..', 'snippets', 'sdk');
const outputPath = path.join(__dirname, '..', '..', 'api-reference', 'swagger-with-sdk-snippets.json');

// Load JSON files with error handling
const loadJson = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`File not found: ${filePath}`);
        } else {
            console.log(`Error reading file ${filePath}: ${error.message}`);
        }
        return null;
    }
};

// Save JSON file with error handling
const saveJson = (filePath, data) => {
    try {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Successfully saved: ${filePath}`);
        return true;
    } catch (error) {
        console.log(`Error saving file ${filePath}: ${error.message}`);
        return false;
    }
};

// Merge snippets into swagger.json
const mergeSnippetsIntoSwagger = () => {
    const swagger = loadJson(swaggerPath);
    if (!swagger) {
        console.log('Cannot proceed without swagger spec file');
        return;
    }

    // Check if snippets directory exists
    if (!fs.existsSync(snippetsPath)) {
        console.log(`Snippets directory not found: ${snippetsPath}`);
        return;
    }

    // Read all snippet files in the folder
    let snippetFiles;
    try {
        snippetFiles = fs.readdirSync(snippetsPath);
    } catch (error) {
        console.log(`Error reading snippets directory: ${error.message}`);
        return;
    }

    if (snippetFiles.length === 0) {
        console.log(`No snippet files found in: ${snippetsPath}`);
        return;
    }

    snippetFiles.forEach((file) => {
        const snippetFilePath = path.join(snippetsPath, file);
        const snippets = loadJson(snippetFilePath);
        
        if (!snippets) {
            console.log(`Skipping invalid snippet file: ${file}`);
            return;
        }

        if (!snippets.endpoints || !Array.isArray(snippets.endpoints)) {
            console.log(`Invalid snippet format in file ${file}: missing or invalid endpoints array`);
            return;
        }

        snippets.endpoints.forEach((snippet) => {
            if (!snippet.snippet || !snippet.id || !snippet.id.path || !snippet.id.method) {
                console.log(`Invalid snippet format in file ${file}: missing required properties`);
                return;
            }

            const { snippet: snippetData } = snippet;
            const { path: endpointPath, method } = snippet.id;
            const endpoint = swagger.paths[endpointPath]?.[method.toLowerCase()];

            if (!endpoint) {
                console.log(`Endpoint not found in swagger spec: ${method} ${endpointPath}`);
                return;
            }

            endpoint['x-codeSamples'] = endpoint['x-codeSamples'] || [];
            endpoint['x-codeSamples'].push({
                lang: snippetData.type,
                label: `${snippetData.type.charAt(0).toUpperCase()}${snippetData.type.slice(1)} SDK`,
                source: snippetData.client,
            });
            console.log(`Added snippet for: ${method} ${endpointPath}`);
        });
    });

    if (saveJson(outputPath, swagger)) {
        console.log('Merge completed successfully!');
    }
};

// Execute the merge
mergeSnippetsIntoSwagger();
