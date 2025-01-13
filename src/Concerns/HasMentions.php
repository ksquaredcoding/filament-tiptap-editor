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

    public function mentionItemsApi(string | Closure | null $endpoint, ?array $body = null, ?array $headers = null): static
    {
        $this->mentionApiEndpoint = $endpoint;

        if ($body) {
            $this->mentionApiBody = $body;
        }

        $this->mentionApiHeaders = $headers ?? [
            'Content-Type' => 'application/json',
            'X-CSRF-TOKEN' => csrf_token(),
        ];

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
}
