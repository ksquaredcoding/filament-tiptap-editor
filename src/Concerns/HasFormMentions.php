<?php

namespace FilamentTiptapEditor\Concerns;

use FilamentTiptapEditor\TiptapEditor;
use Livewire\Attributes\Renderless;

trait HasFormMentions
{
    #[Renderless]
    public function getMentionsItems(string $statePath, string $search): array
    {
        foreach ($this->getCachedForms() as $form) {
            if ($results = $this->getFilamentTipTapMentionResults($form, $statePath, $search)) {
                return $results;
            }
        }

        return [];
    }

    public function getFilamentTipTapMentionResults($form, string $statePath, string $search): array
    {
        foreach ($form->getComponents() as $component) {
            if ($component instanceof TiptapEditor && $component->getStatePath() === $statePath) {
                return $component->getSearchResults($search);
            }

            foreach ($component->getChildComponentContainers() as $container) {
                if ($container->isHidden()) {
                    continue;
                }

                if ($results = $container->getSelectSearchResults($statePath, $search)) {
                    return $results;
                }
            }
        }

        return [];
    }
}
