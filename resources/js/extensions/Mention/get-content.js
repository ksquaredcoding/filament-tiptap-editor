export default (props, noSuggestionsFoundMessage, suggestionsPlaceholder, query, suggestAfterTyping) => {
    Alpine.data('suggestions', () => ({
        items: props.items,
        query: query,
        selectedIndex: 0,
        noSuggestionsFoundMessage: noSuggestionsFoundMessage,
        suggestionsPlaceholder: suggestionsPlaceholder,
        loading: false,
        suggestAfterTyping: suggestAfterTyping,
        init() {
            this.$watch('items', () => {
            });
        },
        rootEvents: {
            ['@update-props.window'](e) {
                this.items = e.detail.items || [];
            },
            ['@update-mention-query.window'](e) {
                this.query = e.detail.query || '';
            },
            ['@suggestion-keydown.window.stop'](e) {
                this.onKeyDown(e.detail);
            },
            ['@mention-api-loading-start.window'](e) {
                this.loading = true;
            },
            ['@mention-api-loading-end.window'](e) {
                this.loading = false;
            },
        },

        selectItem(index) {
            const item = this.items[index];

            if (item) {
                props.command(item);
            }
        },
        onKeyDown({ event }) {
            if (event.key === 'ArrowUp') {
                this.selectedIndex =
                    (this.selectedIndex + this.items.length - 1) % this.items.length;
                return true;
            }

            if (event.key === 'ArrowDown') {
                this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
                return true;
            }

            if (event.key === 'Enter') {
                this.selectItem(this.selectedIndex);
                return true;
            }

            return false;
        },
    }));
    return `
  <div class="mention-dropdown" x-data=suggestions  x-bind="rootEvents">
  
   <template x-for="(item, index) in items" :key="index">
        <button
            x-text="item['label']"
            x-on:click="selectItem(index)"
            :class="{ 'bg-primary-500': index === selectedIndex }"
            class="block w-full text-left rounded px-2 py-1 hover:bg-white/20"
        ></button>
    </template>
  
<!--  No results found -->
  <template x-if="! items.length && !loading && (query.length || !suggestAfterTyping)">
      <p x-text="noSuggestionsFoundMessage"></p>
  </template>
<!--  Placeholder-->
    <template x-if="suggestAfterTyping && ! items.length && ! query.length && !loading">
      <p x-text="suggestionsPlaceholder"></p>
  </template>
  <template x-if="loading">
    <svg class="animate-spin mr-3 size-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </template>
  </div>
  `;
};
