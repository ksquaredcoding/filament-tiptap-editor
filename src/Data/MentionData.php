<?php

namespace FilamentTiptapEditor\Data;

class MentionData
{
    public string $label;
    public ?int $id = null;
    public ?string $href = null;
    public array $data = [];

    /**
     * @param string $label
     * @param int|null $id
     * @param string|null $href
     * @param array $data
     */
    public function __construct(string $label, ?int $id = null, ?string $href = null, array $data = [])
    {
        $this->label = $label;
        $this->id = $id;
        $this->href = $href;
        $this->data = $data;
    }

    /**
     * Converts the object properties to an associative array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'label' => $this->label,
            'id' => $this->id,
            'href' => $this->href,
            'data' => $this->data,
        ];
    }

    /**
     * Converts the object properties to a JSON string.
     *
     * @return string
     */
    public function toJson(): string
    {
        return json_encode($this->toArray());
    }
}
