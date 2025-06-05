# Mintlify Starter Kit

Click on `Use this template` to copy the Mintlify starter kit. The starter kit contains examples including

- Guide pages
- Navigation
- Customizations
- API Reference pages
- Use of popular components

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where mint.json is)

```
mintlify dev
```

### Publishing Changes

Install our Github App to auto propagate changes from your repo to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the link to install on your dashboard. 

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`

### OpenAPI Spec and SDK Generation

The repository includes an automated workflow for handling OpenAPI specification changes and SDK generation. Here's how it works:

#### Automatic Workflow
When changes are made to `api-reference/swagger-spec.json`, the following happens automatically:
1. GitHub Action workflow (`.github/workflows/update-swagger-pr.yml`) is triggered
2. New SDK code is generated using Fern
3. SDK snippets are generated in `snippets/sdk/`
4. Snippets are combined with the spec into `api-reference/swagger-with-sdk-snippets.json`
5. All changes are committed back to your PR

#### Key Files
- `api-reference/swagger-spec.json` - Main OpenAPI specification
- `snippets/sdk/` - Generated SDK code snippets
- `api-reference/swagger-with-sdk-snippets.json` - Combined spec with SDK snippets
- `.github/workflows/update-swagger-pr.yml` - GitHub Action workflow
- `fern/scripts/merge_snippets_to_spec.js` - Script for combining snippets with spec

#### Manual Snippet Generation
To combine snippets with spec locally without triggering SDK generation:
```bash
node fern/scripts/merge_snippets_to_spec.js
```
This will read from `api-reference/swagger-spec.json` and `snippets/sdk/`, and output to `api-reference/swagger-with-sdk-snippets.json`.
