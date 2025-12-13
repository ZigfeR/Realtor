const path = require("node:path");
const sass = require("sass");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  // Отслеживание изменений в папках с шаблонами и стилями
  eleventyConfig.addWatchTarget("src/_includes/**/*.{scss,njk,md,html}");
  eleventyConfig.addWatchTarget("src/assets/**/*.{scss,njk,md,html}");
  eleventyConfig.addWatchTarget("src/assets/scss/**/*.scss");

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
        loadPaths: [
          parsed.dir || ".", // Текущая директория файла
          path.join(__dirname, "src/_includes"), // Добавляем src/_includes для импортов
          path.join(__dirname, "src/assets/scss"), // Добавляем src/assets/scss для импортов
        ],
        sourceMap: true,
      });
      console.log("CSS generated:", result.css.slice(0, 100)); // Отладка
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
      input: "src", // Папка с исходными файлами
      output: "_site", // Папка с выходными файлами
      includes: "_includes", // Папка для шаблонов
      data: "_data", // Папка с данными
    },
    templateFormats: ["njk", "md", "html"], // Форматы шаблонов
  };
};
