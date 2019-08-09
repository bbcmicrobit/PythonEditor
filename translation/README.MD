Python Editor - Crowdin bridge

Requires [Node.js](https://nodejs.dev/how-to-install-nodejs) and [Crowdin CLI](https://support.crowdin.com/cli-tool/#installation)

- Parses en.js to JSON object to be uploaded to crowdin
- Downloads from Crowdin can be parsed and JSON put back into object in JS file

## Uploads
run `./push-source` from this directory to get current json strings to upload to crowdin. This will erturn an en.json file using the `js-json` script.

## Downloads
1.run `.pull-translations` to download current translations, convert these back to JS files and place in the `/lang` folder.