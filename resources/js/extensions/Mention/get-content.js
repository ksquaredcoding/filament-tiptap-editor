export default (props, emptyMentionItemsMessage, mentionItemsPlaceholder, query) => {
    Alpine.data('suggestions', () => ({
        items: props.items,
        query: query,
        selectedIndex: 0,
        emptyMentionItemsMessage: emptyMentionItemsMessage,
        mentionItemsPlaceholder: mentionItemsPlaceholder,
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
  <template x-if="! items.length && (query.length || !mentionItemsPlaceholder)">
      <p x-text="emptyMentionItemsMessage"></p>
  </template>
  <!--  Placeholder-->
    <template x-if="mentionItemsPlaceholder && ! items.length && ! query.length">
      <p x-text="mentionItemsPlaceholder"></p>
  </template>
  </div>
  `;
};
