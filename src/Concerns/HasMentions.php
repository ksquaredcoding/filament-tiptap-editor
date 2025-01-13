<?php

namespace FilamentTiptapEditor\Concerns;

use Closure;
use FilamentTiptapEditor\Data\MentionItem;

trait HasMentions
{
    protected array | Closure | null $mentionItems = null;

    protected string | Closure | null $mentionApiEndpoint = null;

    protected array $mentionApiBody = [];

    protected array $mentionApiHeaders = [
        'Content-Type' => 'application/json',
    ];

    protected int $mentionApiDebounce = 250;

    protected bool | Closure | null $suggestAfterTyping = false;

    protected string | Closure | null $noSuggestionsFoundMessage = null;

    protected string | Closure | null $suggestionsPlaceholder = null;

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
     * Retrieve mention suggestions through an API endpoint
     *
     * @param  string|Closure|null  $endpoint  The API endpoint
     * @param  array|null  $body  Optional body data for the API request. Will always contain a query param.
     * @param  array|null  $headers  Optional headers for the API request. Is application/json by default.
     */
    public function mentionItemsApi(string | Closure | null $endpoint, ?array $body = null, ?array $headers = null, int $debounce = 250): static
    {
        $this->mentionApiEndpoint = $endpoint;

        if ($body) {
            $this->mentionApiBody = $body;
        }

        $this->mentionApiHeaders = $headers ?? [
            'Content-Type' => 'application/json',
            'X-CSRF-TOKEN' => csrf_token(),
        ];

        $this->mentionApiDebounce = $debounce;

        return $this;
    }

    public function getMentionApiEndpoint(): ?string
    {
        return $this->evaluate($this->mentionApiEndpoint);
    }

    public function getMentionApiBody(): array
    {
        return $this->mentionApiBody;
    }

    public function getMentionApiHeaders(): array
    {
        return $this->mentionApiHeaders;
    }

    public function getMentionApiDebounce(): int
    {
        return $this->mentionApiDebounce;
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
}
