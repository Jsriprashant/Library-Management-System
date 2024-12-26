module.exports = {
    presets: [
        '@babel/preset-env', // Ensures compatibility across various environments
        '@babel/preset-react' // For React if needed
    ],
    plugins: [
        '@babel/plugin-transform-modules-commonjs', // Transforms ESM to CommonJS for Jest
    ],
};
