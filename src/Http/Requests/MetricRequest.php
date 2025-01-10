<?php

namespace Laravel\Nova\Http\Requests;

use Illuminate\Support\Collection;
use Laravel\Nova\Metrics\Metric;

/**
 * @property-read string $metric
 */
class MetricRequest extends NovaRequest
{
    /**
     * Get the metric instance for the given request.
     */
    public function metric(): Metric
    {
        return $this->availableMetrics()->first(function ($metric) {
            return $this->metric === $metric->uriKey();
        }) ?: abort(404);
    }

    /**
     * Get the metric instance for the given detail request.
     */
    public function detailMetric(): Metric
    {
        return $this->availableMetricsForDetail()->first(function ($metric) {
            return $this->metric === $metric->uriKey();
        }) ?: abort(404);
    }

    /**
     * Get all of the possible metrics for the request.
     *
     * @return \Illuminate\Support\Collection<int, \Laravel\Nova\Metrics\Metric>
     */
    public function availableMetrics(): Collection
    {
        $resource = $this->newResource();

        abort_unless($resource::authorizedToViewAny($this), 403);

        return $resource->availableCards($this)
                ->whereInstanceOf(Metric::class)
                ->map(function ($metric) use ($resource) {
                    /** @var \Laravel\Nova\Metrics\Metric $metric */
                    if ($metric->refreshWhenFiltersChange === true) {
                        $request = isset($this->resourceId)
                                        ? ResourceDetailRequest::createFromBase($this)
                                        : ResourceIndexRequest::createFromBase($this);

                        return $metric->setAvailableFilters($resource->availableFilters($request));
                    }

                    return $metric;
                });
    }

    /**
     * Get all of the possible metrics for a detail request.
     *
     * @return \Illuminate\Support\Collection<int, \Laravel\Nova\Metrics\Metric>
     */
    public function availableMetricsForDetail(): Collection
    {
        $resource = $this->newResource();

        abort_unless($resource::authorizedToViewAny($this), 403);

        return $resource->availableCardsForDetail($this)
                ->whereInstanceOf(Metric::class)
                ->map(function ($metric) use ($resource) {
                    /** @var \Laravel\Nova\Metrics\Metric $metric */
                    if ($metric->refreshWhenFiltersChange === true) {
                        return $metric->setAvailableFilters(
                            $resource->availableFilters(ResourceDetailRequest::createFromBase($this))
                        );
                    }

                    return $metric;
                });
    }
}
