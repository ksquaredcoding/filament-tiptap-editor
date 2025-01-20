import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'
import { Mention } from '@tiptap/extension-mention'
import getContent from './get-content.js'


let _query = ''
let isLoading = false

export const CustomMention = Mention.extend({

  addOptions() {
    return {
      ...this.parent?.(),
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
      target: {
        default: null,
        parseHTML: element => element.getAttribute('data-target'),
        renderHTML: attributes => {
          if (!attributes.target) {
            return {}
          }

          return {
            'data-target': attributes.target,
          }
        },
      },
      data: {
        default: [],
        parseHTML: element => element.getAttribute('data-mention-data'),
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

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '@',
        items: async ({ query }) => {
          if(!query) return [];

          _query = query

          window.dispatchEvent(new CustomEvent('update-mention-query', { detail: { query: query } }))

          if (this.options.suggestAfterTyping && !query) return []

          if(this.options.getMentionItemsUsingEnabled) {
            return await this.options.getSearchResultsUsing(_query)
          }

          return this.options.mentionItems
            .filter((item) => item['label'].toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5);
        },
        command: ({ editor, range, props }) => {
          let deleteFrom = range.to + 1
          let deleteTo = _query.length + deleteFrom

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'mention',
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .deleteRange({ from: deleteFrom, to: deleteTo })
            .run()

          window.getSelection()?.collapseToEnd()
        },
        render: () => {
          let component
          let popup

          return {
            onStart: (props) => {
              component = getContent(
                props,
                this.options.noSuggestionsFoundMessage,
                this.options.suggestionsPlaceholder,
                _query,
                this.options.suggestAfterTyping,
              )
              if (!props.clientRect) {
                return
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: () => component,
                allowHTML: true,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate(props) {
              window.dispatchEvent(new CustomEvent('update-props', { detail: props }));
              if (!props.clientRect) {
                return
              }
            },

            onKeyDown(props) {
              window.dispatchEvent(new CustomEvent('suggestion-keydown', { detail: props }))
              if (['ArrowUp', 'ArrowDown', 'Enter'].includes(props.event.key)) {
                return true
              }
              return false
            },

            onExit() {
              popup[0].destroy()
            },
          }
        },
      }),
    ]
  },
})
