import suggestion from './suggestion.js'
import { Mention } from '@tiptap/extension-mention'

export const CustomMention = (suggestionList, apiEndpoint, apiMethod, apiBody) => {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: suggestion(suggestionList, apiEndpoint, apiMethod, apiBody)
  });
};
