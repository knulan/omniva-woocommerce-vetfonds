const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const WooCommerceDependencyExtractionWebpackPlugin = require('@woocommerce/dependency-extraction-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Remove SASS rule from the default config so we can define our own.
const defaultRules = defaultConfig.module.rules.filter((rule) => {
    return String(rule.test) !== String(/\.(sc|sa)ss$/);
});

module.exports = {
    ...defaultConfig,
    entry: {
        index: path.resolve(process.cwd(), 'src', 'index.js'),
        'terminal-selection-block/index': path.resolve(process.cwd(), 'src', 'terminal-selection-block', 'index.js'),
        'terminal-selection-block/checkout/index': path.resolve(process.cwd(), 'src', 'terminal-selection-block', 'checkout', 'index.js'),
        'terminal-selection-block/checkout/frontend': path.resolve(process.cwd(), 'src', 'terminal-selection-block', 'checkout', 'frontend.js'),
        'terminal-selection-block/cart/index': path.resolve(process.cwd(), 'src', 'terminal-selection-block', 'cart', 'index.js'),
        'terminal-selection-block/cart/frontend': path.resolve(process.cwd(), 'src', 'terminal-selection-block', 'cart', 'frontend.js'),
    },
    output: {
        path: path.resolve(process.cwd(), '../omniva-woocommerce/assets/blocks'),
    },
    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultRules,
            {
                test: /\.(sc|sa)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: ['src/css'],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...defaultConfig.plugins.filter(
            (plugin) =>
                plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new WooCommerceDependencyExtractionWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `[name].css`,
        }),
    ],
}
