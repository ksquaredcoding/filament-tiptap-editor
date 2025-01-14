<?php

namespace FilamentTiptapEditor\Concerns;

use Closure;
use FilamentTiptapEditor\Data\MentionItem;
use Illuminate\Contracts\Support\Arrayable;

trait HasMentions
{
    protected array | Closure | null $mentionItems = null;

    protected bool | Closure | null $suggestAfterTyping = false;

    protected string | Closure | null $noSuggestionsFoundMessage = null;

    protected string | Closure | null $suggestionsPlaceholder = null;

    protected ?Closure $getMentionItemsUsing = null;

    /**
     * Set mention suggestions.
     *
     * @param  array|Closure|null  $suggestions  Either a hardcoded array or an array with MentionItem objects
     */
    public function mentionItems(array | Closure | null $suggestions): static
    {
        $this->mentionItems = $suggestions;

        return $this;
    }

    public function getMentionItems(): ?array
    {
        $items = $this->evaluate($this->mentionItems);
        if (is_null($items)) {
            return null;
        }

        return collect($items)
            ->map(fn ($item) => $item instanceof MentionItem ? $item->toArray() : $item)
            ->toArray();
    }

    /**
     * Set whether suggestions should only appear after you start typing
     */
    public function suggestAfterTyping(bool | Closure | null $suggestAfterTyping = true): static
    {
        $this->suggestAfterTyping = $suggestAfterTyping;

        return $this;
    }

    public function getSuggestAfterTyping(): bool
    {
        return $this->evaluate($this->suggestAfterTyping);
    }

    /**
     * Set the message to display when no mention suggestions are found.
     */
    public function noSuggestionsFoundMessage(string | Closure | null $message): static
    {
        $this->noSuggestionsFoundMessage = $message;

        return $this;
    }

    public function getNoSuggestionsFoundMessage(): string
    {
        return $this->evaluate($this->noSuggestionsFoundMessage) ?? trans('filament-tiptap-editor::editor.mentions.no_suggestions_found');
    }

    /**
     * Set the message to display in the empty suggestions state when the trigger character is typed but no input is provided.
     */
    public function suggestionsPlaceholder(string | Closure | null $message): static
    {
        $this->suggestionsPlaceholder = $message;

        return $this;
    }

    public function getSuggestionsPlaceholder(): string
    {
        return $this->evaluate($this->suggestionsPlaceholder) ?? trans('filament-tiptap-editor::editor.mentions.suggestions_placeholder');
    }

    public function getMentionItemsUsing(?Closure $callback): static
    {
        $this->getMentionItemsUsing = $callback;

        return $this;
    }

    public function getMentionItemsUsingEnabled(): bool
    {
        return ! is_null($this->getMentionItemsUsing);
    }

    public function getSearchResults(string $search): array
    {
        if (! $this->getMentionItemsUsing) {
            return [];
        }

        $results = $this->evaluate($this->getMentionItemsUsing, [
            'query' => $search,
        ]);

        if ($results instanceof Arrayable) {
            $results = $results->toArray();
        }

        return $results;
    }
}
