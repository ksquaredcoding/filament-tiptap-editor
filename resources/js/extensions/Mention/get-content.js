export default (props) => {
    Alpine.data('suggestions', () => ({
        items: props.items,
        selectedIndex: 0,
        init() {
            this.$watch('items', () => {
            });
        },
        rootEvents: {
            ['@update-props.window'](e) {
                this.items = e.detail.items || [];
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
  <div class="mention-dropdown" x-data=suggestions  x-bind="rootEvents" x-trap="true">
  <template x-for="(item, index) in items">
  <p :class="{'selected': selectedIndex === index}" @click="selectItem(index)" x-text="item['label']"></p>
  </template>
  <template x-if="! items.length">
    <p>No results found</p>
  </template>
  </div>
  `;
};
