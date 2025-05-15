module.exports = {
    webpack: {
        configure: {
            ignoreWarnings: [
                {
                    module: /node_modules\/react-datepicker/,
                    message: /Failed to parse source map/,
                },
            ],
        },
    },
}; 