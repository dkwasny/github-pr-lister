module.exports = {
    'env': {
        'es6': true,
        'browser': true
    },
    'extends': 'eslint:recommended',
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 'off'
    },
    'parserOptions': {
        'sourceType': 'module'
    }
};