const path = require("node:path");
const sass = require("sass");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  // Поддержка SCSS как шаблонов
  eleventyConfig.addTemplateFormats("scss");

  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,
    compile: async function (inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }
      console.log("Compiling SCSS:", inputPath); // Отладка
      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
        sourceMap: true,
      });
      console.log("CSS generated:", result.css.slice(0, 100));
      this.addDependencies(inputPath, result.loadedUrls);
      return async (data) => {
        return new CleanCSS({}).minify(result.css).styles;
      };
    },
  });

  // Коллекция для страниц
  eleventyConfig.addCollection("pages", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/page.njk");
  });
  // Копируем изображения
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });

  // Копируем JavaScript
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });

  // Шорткод для кнопки с поддержкой атрибутов
  eleventyConfig.addShortcode(
    "button",
    function (text, className, attributes = "") {
      return `<button class="btn ${className}" ${attributes}>${text}</button>`;
    }
  );

  // Фильтр для минификации CSS
  eleventyConfig.addFilter("cssMinifier", function (cssCode) {
    return new CleanCSS({}).minify(cssCode).styles;
  });

  // Настройка MIME-типа для JS
  eleventyConfig.setBrowserSyncConfig({
    mimeTypes: {
      ".js": "text/javascript",
    },
    callbacks: {
      ready: function (err, bs) {
        console.log(
          "BrowserSync serving files from:",
          bs.options.get("server").baseDir
        );
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
  };
};
