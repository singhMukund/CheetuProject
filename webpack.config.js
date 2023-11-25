const path = require('path');


module.exports = {
  entry: './index.js', // Entry point for your web app
  // ... other webpack configuration options ...
  plugins: [
    // ... other plugins ...

    // DefinePlugin is used to define global constants
    new webpack.DefinePlugin({
      __WEB__: true, // Define a global constant to indicate that it's the web version
    }),

    // HtmlWebpackPlugin is used to generate the HTML file
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'path-to-your-custom-index.html'), // Specify the path to your custom index.html file
    }),
  ],
};
