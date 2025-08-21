import markdownit from 'markdown-it';
import { toTitleCase } from 'titlecase'
import { slug } from 'github-slugger';
import path from 'path';

import getGitFirstAddedTimeStamp from '../node_modules/@11ty/eleventy/src/Util/DateGitFirstAdded.js';
import getGitLastUpdatedTimeStamp from '../node_modules/@11ty/eleventy/src/Util/DateGitLastUpdated.js';

import { generateGithubPermalink } from './build/generate-docs-file-meta.js';

// avoid new instance of MarkdownIt for each call
const md = new markdownit();

/**
 * Extract text content from a Markdown AST node.
 *
 * @param {*} node - The AST node to extract text from.
 * @returns {string} - The extracted text content.
 */
const extractText = (node) => {
  const nodeTypes = ['text', 'inlineCode'];

  if (nodeTypes.includes(node.type)) {
    return node.value;
  }
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}

/**
 * Extract the title from the page markdown h1.
 *
 * @param {string} markdown - The page markdown content.
 * @returns {string|null} - The extracted title or null.
 */
const extractTitleFromMarkdown = (markdown) => {
  const tokens = md.parse(markdown, {});

  for (const [i, { type, tag }] of tokens.entries()) {
    if (type === 'heading_open' && tag === 'h1') {
      // The next token should be the inline content of the heading
      const contentTokens = tokens[i + 1];

      let title = contentTokens.content

      if (contentTokens.children) {
        // Children array: filter for text and code_inline only
        title = contentTokens.children
          .filter(t => t.type === 'text' || t.type === 'code_inline')
          .map(t => t.content)
          .join('');
      }

      return title;
    }
  }

  return null;
}

/**
 * Extract the title from the file slug.
 * @param {*} fileSlug - The file slug to extract the title from.
 * @returns {string|null} - The extracted title or null.
 */
const extractTitleFromFileSlug = (fileSlug) => {
  if (!fileSlug || fileSlug === "index") {
    return null;
  }

  const wordsToAlwaysUpperCase = /\b(?:must|should|may)( not)?\b/gi;

  return toTitleCase(fileSlug).replaceAll("-", " ").replaceAll(wordsToAlwaysUpperCase, (match) => match.toUpperCase());
}

/**
 * Extract the title from the page data
 * .
 * @param {*} data - The page data.
 * @returns {string|null} - The extracted title or null.
 */
const extractTitleFromPageData = (data) => {
  const { title, page } = data;

  return [null, "", undefined].includes(title?.trim())
    ? extractTitleFromMarkdown(page.rawInput) ?? extractTitleFromFileSlug(page.fileSlug)
    : title
}

/**
 * Get the default title for a page.
 * @param {*} data - The page data.
 * @returns {string|null} - The default title or null.
 */
export const getDefaultTitle = (data) => {
  const { options, title } = data;

  const useMarkdownHeaderAsTitle
    = data.useMarkdownHeaderAsTitle // page front matter
    ?? options?.useMarkdownHeaderAsTitle // global options
    ?? false;

  if (!useMarkdownHeaderAsTitle) {
    return title;
  }

  // If title has explicitly set, regardless of useMarkdownHeaderAsTitle == true
  // return it, enables pages to have a title explicitly set in front matter
  if (![null, "", undefined].includes(title?.trim())) {
    return title;
  }

  return extractTitleFromPageData(data);
}

/**
 * Get the default section key for a page.
 * @param {*} data - The page data.
 * @returns {string|null} - The default section key or null.
 */
export const getDefaultSectionKey = data => {
  const { sectionKey, page, options, eleventyExcludeFromCollections } = data;

  if (!eleventyExcludeFromCollections) {
    if (![null, "", undefined].includes(sectionKey.trim())) {
      return sectionKey;
    }

    const directory = path.basename(path.dirname(page.filePathStem));

    return directory === "" ? options.homeKey.toLowerCase() : directory;
  }
}

const docsMeta = {}

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

/**
 * Get the Git Hub permalink for a page.
 * @param {*} data - The page data.
 * @returns {Promise<string|null>} - The permalink or null.
 */
export const getPagePermalink = async (data) => {
  if (isEmpty(data?.page) || data?.page?.templateSyntax?.split(',').includes('md') !== true) {
    return null;
  }

  const { eleventyExcludeFromCollections, page } = data;

  if (!eleventyExcludeFromCollections) {
    const gitMeta = await getDocMetaForPage(page);
    return gitMeta?.permalink;
  }
}

/**
 * Get the Git created date for a page.
 * @param {*} data - The page data.
 * @returns {Promise<Date|null>} - The created date or null.
 */
export const getPageGitCreatedDate = async (data) => {
  if (isEmpty(data?.page) || data?.page?.templateSyntax?.split(',').includes('md') !== true) {
    return null;
  }

  const { eleventyExcludeFromCollections, page } = data;

  if (!eleventyExcludeFromCollections) {
    const gitMeta = await getDocMetaForPage(page);
    return gitMeta.created ?? page.date;
  }
}

/**
 * Get the Git updated date for a page.
 * @param {*} data - The page data.
 * @returns {Promise<Date|null>} - The updated date or null.
 */
export const getPageGitUpdatedDate = async (data) => {
  if (isEmpty(data?.page) || data?.page?.templateSyntax?.split(',').includes('md') !== true) {
    return null;
  }
  const { eleventyExcludeFromCollections, page } = data;

  if (!eleventyExcludeFromCollections) {
    const gitMeta = await getDocMetaForPage(page);
    return gitMeta.lastUpdated ?? page.created;
  }
}

/**
 * Get the default navigation title for a page.
 *
 * @param {*} data - The page data.
 * @returns {string|null} - The default navigation title or null.
 */
export const getDefaultNavigationTitle = (data) => {
  const { eleventyNavigation, eleventyExcludeFromCollections } = data;

  if (!eleventyExcludeFromCollections) {
    return ![null, "", undefined].includes(eleventyNavigation?.title?.trim())
      ? eleventyNavigation.title
      : data.title;
  }
}

/**
 * Get the navigation key for a page.
 * @param {*} data - The page data.
 * @returns {string|null} - The navigation key or null.
 */
export const getDefaultNavigationKey = data => {
  const {
    homepage, eleventyExcludeFromCollections, eleventyNavigation, options, title
  } = data;

  let key = eleventyNavigation?.key?.trim();

  if (![null, "", undefined].includes(key)) {
    key = slug(key);
  }

  if (homepage) {
    // If no explicit navigation `key` use `homeKey` set in plugin options
    return key || slug(options.homeKey.toLowerCase());
  }

  if (!eleventyExcludeFromCollections) {
    // use explicit navigation `key` if it exists in all cases
    return key || slug(title);
  }
}

/**
 * Get the default navigation parent for a page.
 * @param {*} data - The page data.
 * @returns {string|null} - The default navigation parent or null.
 */
export const getDefaultNavigationParent = data => {
  const {
    homepage, eleventyExcludeFromCollections, eleventyNavigation, options, page: { filePathStem }
  } = data;

  if (homepage) {
    // The homepage has no parent
    return false;
  } else if (!eleventyExcludeFromCollections) {

    if (![null, "", undefined].includes(eleventyNavigation?.parent.trim())) {
      return eleventyNavigation.parent;
    }

    const parentDirectory = path.basename(path.dirname(filePathStem));

    return [null, "", undefined].includes(parentDirectory)
      ? options.homeKey.toLowerCase()
      : parentDirectory;
  }
}

/**
 * Get the metadata for a page from the docs meta file.
 *
 * @param {*} page - The page object.
 * @returns {Promise<Object|null>} - The metadata for the page or null if not found.
 */
async function getDocMetaForPage(page) {
  if ('SKIP_META' in process.env) {
    // skip creating the real metadata about a page, just use some sensible defaults
    const now = new Date();
    return {
      created: now,
      lastUpdated: now,
      permalink: page.inputPath
    }
  }

  const dirName = path.dirname(page.filePathStem);
  const parentFolder = dirName === "/" ? "home" : page.filePathStem.split(path.sep)[1];

  if (parentFolder === "home") {
    return {
      created: await getGitFirstAddedTimeStamp(page.inputPath),
      lastUpdated: await getGitLastUpdatedTimeStamp(page.inputPath),
      permalink: await generateGithubPermalink("docs", page.inputPath)
    }
  }

  if (!docsMeta[parentFolder]) {
    const {default: meta} =
      await import(`../docs/${parentFolder}/${parentFolder}-meta.json`, {with: {type: "json"}});
    docsMeta[parentFolder] = meta;
  }

  return docsMeta[parentFolder][page.inputPath];
}

