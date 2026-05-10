const markdownIt = require("markdown-it");

const pathPrefix = process.env.PATH_PREFIX || "/";

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");

  const md = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addCollection("pages", api =>
    api.getFilteredByGlob("src/*.md")
      .filter(p => p.data.weight != null)
      .sort((a, b) => a.data.weight - b.data.weight)
  );

  eleventyConfig.addFilter("md", content => md.render(content));
  eleventyConfig.addFilter("year", date => new Date(date).getFullYear());

  eleventyConfig.addNunjucksShortcode("pageList", function(pages, title, showDescriptions, excludeHome) {
    const currentUrl = this.page.url;
    const items = (excludeHome ? pages.filter(p => p.url !== "/") : pages).map(p => {
      const slug = p.url.replace(/\//g, "");
      const label = p.data.title || (slug ? slug[0].toUpperCase() + slug.slice(1) : "Home");
      const desc = showDescriptions && p.data.description
        ? `\n      <p>${p.data.description}</p>` : "";
      const prefix = pathPrefix.replace(/\/$/, "");
      return p.url === currentUrl
        ? `<li><span>${label}</span>${desc}</li>`
        : `<li><a href="${prefix}${p.url}">${label}</a>${desc}</li>`;
    }).join("\n    ");
    const heading = title ? `<h2>${title}</h2>\n  ` : "";
    return `<nav>\n  ${heading}<ul>\n    ${items}\n  </ul>\n</nav>`;
  });

  return {
    pathPrefix,
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
    },
  };
};
