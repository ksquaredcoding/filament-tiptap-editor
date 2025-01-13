<?php

namespace FilamentTiptapEditor\Concerns;

use Closure;
use FilamentTiptapEditor\Data\MentionData;

trait HasMentions
{
    protected array | Closure | null $mentionSuggestions = null;

    protected string | Closure | null $mentionSuggestionEndpoint = null;

    protected ?string $mentionSuggestionEndpointMethod = null;

    protected ?array $mentionSuggestionEndpointBody = null;

    public function mentionSuggestions(array | Closure | null $suggestions): static
    {
        $this->mentionSuggestions = $suggestions;

        return $this;
    }

    public function getMentionSuggestions(): ?array
    {
        $suggestions = $this->evaluate($this->mentionSuggestions);
        if (is_null($suggestions)) {
            return null;
        }

        return collect($suggestions)
            ->map(fn ($suggestion) => $suggestions instanceof MentionData ? $suggestion->toArray() : $suggestion)
            ->toArray();
    }

    public function mentionSuggestionEndpoint(string | Closure | null $endpoint, string $method = 'get', array $body = []): static
    {
        $this->mentionSuggestionEndpoint = $endpoint;

        $this->mentionSuggestionEndpointMethod = $method;

        $this->mentionSuggestionEndpointBody = $body;

        return $this;
    }

    public function getMentionSuggestionEndpoint(): ?string
    {
        return $this->evaluate($this->mentionSuggestionEndpoint);
    }

    public function getMentionSuggestionMethod(): ?string
    {
        return $this->mentionSuggestionEndpointMethod;
    }

    public function getMentionSuggestionBody(): ?array
    {
        return $this->mentionSuggestionEndpointBody;
    }
}
