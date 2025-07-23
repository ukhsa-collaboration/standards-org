import { 
  getDefaultSectionKey,
  getDefaultTitle,
  getDefaultNavigationTitle,
  getDefaultNavigationKey,
  getDefaultNavigationParent,
  getPageGitCreatedDate,
  getPageGitUpdatedDate,
} from "../utils.js";

export const eleventyComputed = {
  page: {
    created: async (data) => await getPageGitCreatedDate(data),
    modified: async (data) => await getPageGitUpdatedDate(data),
  },
  title: (data) => getDefaultTitle(data),
  sectionKey: (data) => getDefaultSectionKey(data),
  override: { // Override the xgov plugin eleventyComputed
    eleventyNavigation: {
      title: data => getDefaultNavigationTitle(data),
      key: (data) => getDefaultNavigationKey(data),
      parent: (data) => getDefaultNavigationParent(data),
    }
  }
}