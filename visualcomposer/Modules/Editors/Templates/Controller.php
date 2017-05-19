<?php

namespace VisualComposer\Modules\Editors\Templates;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\EditorTemplates;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Templates\Controller::allMyTemplates */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:body:extraOutput', 'allMyTemplates');
        /** @see \VisualComposer\Modules\Editors\Templates\Controller::allPredefinedTemplates */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:body:extraOutput', 'allPredefinedTemplates');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::create */
        $this->addFilter('vcv:ajax:editorTemplates:create:adminNonce', 'create');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::delete */
        $this->addFilter('vcv:ajax:editorTemplates:delete:adminNonce', 'delete');
    }

    protected function allMyTemplates($extraOutput, EditorTemplates $editorTemplatesHelper)
    {
        $extraOutput = array_merge(
            $extraOutput,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_MY_TEMPLATES',
                        'values' => $this->getData($editorTemplatesHelper->all()),
                    ]
                ),
            ]
        );

        return $extraOutput;
    }

    protected function allPredefinedTemplates($extraOutput, EditorTemplates $editorTemplatesHelper)
    {
        $extraOutput = array_merge(
            $extraOutput,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_PREDEFINED_TEMPLATES',
                        'values' => $editorTemplatesHelper->allPredefined(),
                    ]
                ),
            ]
        );

        return $extraOutput;
    }

    protected function getData(array $templates)
    {
        $data = [];
        foreach ($templates as $template) {
            /** @var $template \WP_Post */
            $templateElements = get_post_meta($template->ID, 'vcvEditorTemplateElements', true);
            if (!empty($templateElements)) {
                $data[] = [
                    // @codingStandardsIgnoreLine
                    'name' => $template->post_title,
                    'data' => $templateElements,
                    'id' => (string)$template->ID,
                ];
            }
        }

        return $data;
    }

    /**
     * @CRUD
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    protected function create(Request $requestHelper, PostType $postTypeHelper)
    {
        $data = $requestHelper->inputJson('vcv-template-data');
        $data['post_type'] = 'vcv_templates';
        $data['post_status'] = 'publish';

        return [
            'status' => $postTypeHelper->create($data),
        ];
    }

    /**
     * @CRUD
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    protected function delete(Request $requestHelper, PostType $postTypeHelper)
    {
        $id = $requestHelper->input('vcv-template-id');

        return [
            'status' => $postTypeHelper->delete($id, 'vcv_templates'),
        ];
    }
}
