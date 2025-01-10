import tippy from 'tippy.js';
import getContent from './get-content.js';

let _query = null;
export default (suggestionList = [], apiEndpoint = null, apiMethod = null, apiBody = null) => ({
    items: async ({ query }) => {
        _query = query;

        if(apiEndpoint) {
            if(!query) return [];
            const response = await fetch(`${apiEndpoint}/${query}`);
            const users = await response.json();
            return users.slice(0, 5);
        } else {
            return suggestionList
              .filter(item => item['label'].toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5)
        }
    },
    // Override command property
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
                component = getContent(props);
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
