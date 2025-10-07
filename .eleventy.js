const CleanCSS = require("clean-css");
const htmlMinifier = require("html-minifier");
const { minify } = require("terser");

module.exports = function (eleventyConfig) {
    // Minify HTML files on build
    eleventyConfig.addTransform("htmlMinifier", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            let minified = htmlMinifier.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }

        return content;
    });

    // Minify CSS upon request.
    eleventyConfig.addFilter("cssMinifier", function (css) {
        return new CleanCSS({}).minify(css).styles;
    });

    // Minify JS upon request
    eleventyConfig.addNunjucksAsyncFilter("jsMinifier", async function(code, callback) {
        try {
            const minified = await minify(code);
            callback(null, minified.code);
        } catch (err) {
            console.error("Terser error: ", err);
            // Fail gracefully.
            callback(null, code);
        }
    })

    // Pass through everything in the assets folder
    eleventyConfig.addPassthroughCopy("src/_assets");

    return {
        dir: {
            // By separating source into a sub folder, we don't have to
            // ignore the package's README.
            input: "src"
        }
    }
};
