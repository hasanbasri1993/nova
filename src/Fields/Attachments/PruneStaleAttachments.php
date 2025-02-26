<?php

namespace Laravel\Nova\Fields\Attachments;

use Illuminate\Support\Facades\Artisan;

class PruneStaleAttachments
{
    /**
     * The pending attachment model.
     *
     * @var class-string<\Laravel\Nova\Fields\Attachments\PendingAttachment>
     */
    public static $model = PendingAttachment::class;

    /**
     * Prune the stale attachments from the system.
     */
    public function __invoke(): void
    {
        Artisan::call('model:prune', [
            '--model' => static::$model,
            '--chunk' => 100,
        ]);
    }
}
