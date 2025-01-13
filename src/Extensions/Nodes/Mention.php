<?php

declare(strict_types=1);

namespace FilamentTiptapEditor\Extensions\Nodes;

use Tiptap\Core\Node;

class Mention extends Node
{
    public static $name = 'mention';

    public function addAttributes(): array
    {
        return [
            'href' => [
                'default' => null,
                'parseHTML' => function ($DOMNode) {
                    return $DOMNode->firstChild->getAttribute('src');
                },
            ],
        ];
    }

    public function parseHTML(): array
    {
        return [
            [
                'tag' => 'span[data-mention]',
            ],
        ];
    }

    public function renderText($node)
    {
        return $node->attrs->label;
    }

    public function renderHTML($node, $HTMLAttributes = []): array
    {
        if (property_exists($node->attrs, 'href')) {
            return [
                'a',
                [
                    'href' => $node->attrs->href,
                ],
            ];
        }

        return [
            'span',
            [
                'data-mention-id' => $node->attrs->id,
            ],
            0,
        ];
    }
}
