import typescript from 'typescript';
import typescriptPlugin from 'rollup-plugin-typescript2';
import { uglify as uglifyPlugin } from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

const config = {
    output: {
        name: 'HistoryQueryEnhancer',
        format: 'umd',
    },
    plugins: [
        typescriptPlugin({
            typescript,
        }),
    ],
};

if (env === 'production') {
    config.plugins.push(
        uglifyPlugin({
            compress: {
                /* eslint-disable-next-line camelcase */
                pure_getters: true,
                unsafe: true,
                /* eslint-disable-next-line camelcase */
                unsafe_comps: true,
                warnings: false,
            },
        }),
    );
}

export default config;
