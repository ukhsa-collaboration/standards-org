import { govukEleventyPlugin } from '@x-govuk/govuk-eleventy-plugin'
import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";

import { eleventyComputed } from './src/data/eleventy-computed.js'
import { markdownItGitHubAlerts } from './src/markdown-it/github-alerts.js'
import { mermaidPlugin } from './src/markdown-it/mermaid.js'
import { headingRules } from './src/markdown-it/heading.js'
import jsonDumpSafe from './src/filters/json-filter.js';

export default function (eleventyConfig) {
  const gitHubRepositoryUrl = "https://github.com/ukhsa-collaboration/standards-org";
  // Register the plugin
  eleventyConfig.addPlugin(govukEleventyPlugin, {
    homeKey: 'home',
    headingPermalinks: true,
    useMarkdownHeaderAsTitle: true,
    url: process.env.GITHUB_ACTIONS && 'https://ukhsa-collaboration.github.io/standards-org/',
    header: {
      productName: 'UKHSA Engineering Standards',
      organisationName: 'UK Health Security Agency',
      search: {
        indexPath: '/search.json',
        sitemapPath: '/sitemap'
      },
      logotype: {
        html:
          `<span class="govuk-header__logotype">
            <img src="/assets/images/govuk-crest-header.svg" height="34px" alt="UKHSA Logo">
          </span>`
      }
    },
    footer: {
      meta: {
        items: [
          {
            href: '/about/',
            text: 'About'
          },
          {
            href: '/sitemap/',
            text: 'Sitemap'
          },
          {
            href: gitHubRepositoryUrl,
            text: 'GitHub repository'
          }
        ]
      }
    },
    stylesheets: ['/assets/styles.css'],
  });
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Filters
  eleventyConfig.addFilter("safeJson", jsonDumpSafe);

  // Libraries
  eleventyConfig.amendLibrary('md',
    md => md.use(markdownItGitHubAlerts)
      .use(headingRules)
      .use(mermaidPlugin));

  // Global data
  eleventyConfig.addGlobalData('eleventyComputed', eleventyComputed);
  eleventyConfig.addGlobalData('eleventyComputed.eleventyNavigation', eleventyComputed.override.eleventyNavigation);

  eleventyConfig.addPassthroughCopy({ "docs/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "node_modules/mermaid/dist/mermaid.esm.min.mjs": "assets/mermaid/mermaid.esm.min.mjs" });
  eleventyConfig.addPassthroughCopy({ "node_modules/mermaid/dist/chunks/**/*.mjs": "assets/mermaid/chunks/mermaid.esm.min" });

  eleventyConfig.setUseGitIgnore(false);

  if (process.env.GITHUB_ACTIONS) {
    eleventyConfig.addPreprocessor("scss asset path", "scss", (data, content) => {
      if (data.page.inputPath === './docs/assets/styles.scss') {
        return content.replace(/^(.*\n){1}/, `$asset-path: "/standards-org/assets/";\n`);
      }

      return content;
    });
  }

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: { input: 'docs' },
    pathPrefix: process.env.GITHUB_ACTIONS && '/standards-org/'
  }
};