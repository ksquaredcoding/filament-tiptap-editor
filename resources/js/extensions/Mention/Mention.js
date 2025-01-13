import suggestion from './suggestion.js'
import { Mention } from '@tiptap/extension-mention'

export const CustomMention = (suggestionList, apiEndpoint, apiMethod, apiBody) => {
  return Mention.extend({
    addOptions() {
      return {
        ...this.parent?.(),
        suggestion: suggestion(suggestionList, apiEndpoint, apiMethod, apiBody),
        HTMLAttributes: {
          class: 'mention',
        },
      }
    },
    addAttributes() {
      return {
        ...this.parent?.(),
        href: {
          default: null,
          parseHTML: element => element.getAttribute('data-href'),
          renderHTML: attributes => {
            if (!attributes.href) {
              return {}
            }

            return {
              'data-href': attributes.href,
            }
          },
        },
        data: {
          default: [],
          parseHTML: element => element.getAttribute('data-data'),
          renderHTML: attributes => {
            if (!attributes.data) {
              return {}
            }

            return {
              'data-data': attributes.data,
            }
          },
        },
      }
    },
  });
};
