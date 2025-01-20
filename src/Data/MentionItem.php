<?php

namespace FilamentTiptapEditor\Data;

class MentionItem
{
    public int $id;

    public string $label;

    public ?string $href = null;

    public string $target;

    public ?string $image = null;

    public bool $roundedImage = false;

    public array $data = [];

    public function __construct(
        int $id,
        string $label,
        ?string $href = null,
        ?string $target = '_blank',
        ?string $image = null,
        bool $roundedImage = false,
        array $data = []
    ) {
        $this->id = $id;
        $this->label = $label;
        $this->href = $href;
        $this->target = $target;
        $this->image = $image;
        $this->roundedImage = $roundedImage;
        $this->data = $data;
    }

    /**
     * Converts the object properties to an associative array.
     */
    public function toArray(): array
    {
        return [
            'label' => $this->label,
            'id' => $this->id,
            'href' => $this->href,
            'target' => $this->target,
            'image' => $this->image,
            'data' => $this->data,
        ];
    }

    /**
     * Converts the object properties to a JSON string.
     */
    public function toJson(): string
    {
        return json_encode($this->toArray());
    }
}
