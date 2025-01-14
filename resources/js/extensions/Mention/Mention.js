import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'
import { Mention } from '@tiptap/extension-mention'
import getContent from './get-content.js'


let _query = null
let debounceTimeout = null
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

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '@',
        items: async ({ query }) => {
          _query = query
          console.log('query: ' + query)
          window.dispatchEvent(new CustomEvent('update-mention-query', { detail: { query: query } }))
          if (this.options.suggestAfterTyping && !query) return []

          // TODO: accept hardcoded and callback
          // return this.options.mentionItems
          //   .filter((item) => item['label'].toLowerCase().startsWith(query.toLowerCase()))
          //   .slice(0, 5);

          return await this.options.getSearchResultsUsing(_query)
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
              console.log('howdy')
              console.log(this.options.suggestAfterTyping)
              component = getContent(
                props,
                this.options.noSuggestionsFoundMessage,
                this.options.suggestionsPlaceholder,
                _query.length > 0,
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
              const event = new CustomEvent('update-props', { detail: props })
              window.dispatchEvent(event)
              if (!props.clientRect) {
                return
              }
            },

            onKeyDown(props) {
              const event = new CustomEvent('suggestion-keydown', { detail: props })
              window.dispatchEvent(event)
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
