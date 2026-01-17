const path = require("node:path");
const { fileURLToPath } = require("node:url");
const sass = require("sass");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("src/assets/scss");

  eleventyConfig.addTemplateFormats("scss");

  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,

    compile: function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);

      // не компилируем partial'ы
      if (parsed.name.startsWith("_")) {
        return;
      }

      return async () => {
        const result = sass.compileString(inputContent, {
          loadPaths: [
            parsed.dir,
            path.join(__dirname, "src/_includes"),
            path.join(__dirname, "src/assets/scss"),
          ],
          sourceMap: true,
        });

        // регистрируем зависимости для watch-режима
        const deps = (result.loadedUrls || [])
          .filter((u) => u.protocol === "file:")
          .map((u) => fileURLToPath(u));

        this.addDependencies(inputPath, deps);

        return new CleanCSS({}).minify(result.css).styles;
      };
    },
  });

  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });

  eleventyConfig.setBrowserSyncConfig({
    mimeTypes: {
      ".js": "text/javascript",
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html", "scss"],
  };
};
