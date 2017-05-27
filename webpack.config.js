var path = require('path');

module.exports = {
    entry: './demo/app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'demo/dist')
    },
    watch: true
};