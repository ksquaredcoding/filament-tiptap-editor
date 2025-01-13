import tippy from 'tippy.js';
import getContent from './get-content.js';

let _query = null;
let debounceTimeout = null;
let isLoading = false;

export default (
  mentionItems = [],
  mentionApiEndpoint = null,
  mentionApiBody = null,
  mentionApiHeaders = {},
  mentionApiDebounce = 250,
  suggestAfterTyping = false,
  noSuggestionsFoundMessage = '',
  suggestionsPlaceholder = '',
) => ({
    char: '@',
    items: async ({ query }) => {
        _query = query;
        window.dispatchEvent(new CustomEvent('update-mention-query', { detail: { query: query } }));

        if (suggestAfterTyping && !query) return [];

        // Dispatch an event to indicate loading started
        if (mentionApiEndpoint) {
            if (!isLoading) {
                isLoading = true;
                window.dispatchEvent(new CustomEvent('mention-api-loading-start'));
            }

            // Implement debounce
            return new Promise((resolve) => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(async () => {
                    try {
                        const response = await fetch(mentionApiEndpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                ...mentionApiHeaders,
                            },
                            body: JSON.stringify({
                                query: query,
                                ...mentionApiBody,
                            }),
                        });
                        const users = await response.json();

                        // Loading complete
                        isLoading = false;
                        window.dispatchEvent(new CustomEvent('mention-api-loading-end'));

                        resolve(users.slice(0, 5));
                    } catch (error) {
                        isLoading = false;
                        window.dispatchEvent(new CustomEvent('mention-api-loading-end'));
                        resolve([]);
                    }
                }, mentionApiDebounce);
            });
        } else {
            return mentionItems
              .filter((item) => item['label'].toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5);
        }
    },
    command: ({ editor, range, props }) => {
        let deleteFrom = range.to + 1;
        let deleteTo = _query.length + deleteFrom;

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
          .run();

        window.getSelection()?.collapseToEnd();
    },
    render: () => {
        let component;
        let popup;

        return {
            onStart: (props) => {
                console.log("howdy");
                console.log(suggestAfterTyping);
                component = getContent(
                    props,
                    noSuggestionsFoundMessage,
                    suggestionsPlaceholder,
                    _query.length > 0,
                    suggestAfterTyping
                );
                if (!props.clientRect) {
                    return;
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
                });
            },

            onUpdate(props) {
                const event = new CustomEvent('update-props', { detail: props });
                window.dispatchEvent(event);
                if (!props.clientRect) {
                    return;
                }
            },

            onKeyDown(props) {
                const event = new CustomEvent('suggestion-keydown', { detail: props });
                window.dispatchEvent(event);
                if (['ArrowUp', 'ArrowDown', 'Enter'].includes(props.event.key)) {
                    return true;
                }
                return false;
            },

            onExit() {
                popup[0].destroy();
            },
        };
    },
});
