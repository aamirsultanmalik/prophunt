import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMapsAPIWrapper } from './../google-maps-api-wrapper';
/**
 * Manages all Data Layers for a Google Map instance.
 */
export class DataLayerManager {
    constructor(_wrapper, _zone) {
        this._wrapper = _wrapper;
        this._zone = _zone;
        this._layers = new Map();
    }
    /**
     * Adds a new Data Layer to the map.
     */
    addDataLayer(layer) {
        const newLayer = this._wrapper.createDataLayer({
            style: layer.style,
        })
            .then(d => {
            if (layer.geoJson) {
                // NOTE: accessing "features" on google.maps.Data is undocumented
                this.getDataFeatures(d, layer.geoJson).then(features => d.features = features);
            }
            return d;
        });
        this._layers.set(layer, newLayer);
    }
    deleteDataLayer(layer) {
        this._layers.get(layer).then(l => {
            l.setMap(null);
            this._layers.delete(layer);
        });
    }
    updateGeoJson(layer, geoJson) {
        this._layers.get(layer).then(l => {
            l.forEach(feature => {
                l.remove(feature);
                // NOTE: accessing "features" on google.maps.Data is undocumented
                const index = l.features.indexOf(feature, 0);
                if (index > -1) {
                    l.features.splice(index, 1);
                }
            });
            this.getDataFeatures(l, geoJson).then(features => l.features = features);
        });
    }
    setDataOptions(layer, options) {
        this._layers.get(layer).then(l => {
            l.setControlPosition(options.controlPosition);
            l.setControls(options.controls);
            l.setDrawingMode(options.drawingMode);
            l.setStyle(options.style);
        });
    }
    /**
     * Creates a Google Maps event listener for the given DataLayer as an Observable
     */
    createEventObservable(eventName, layer) {
        return new Observable((observer) => {
            this._layers.get(layer).then((d) => {
                d.addListener(eventName, (e) => this._zone.run(() => observer.next(e)));
            });
        });
    }
    /**
     * Extract features from a geoJson using google.maps Data Class
     * @param d : google.maps.Data class instance
     * @param geoJson : url or geojson object
     */
    getDataFeatures(d, geoJson) {
        return new Promise((resolve, reject) => {
            if (typeof geoJson === 'object') {
                try {
                    const features = d.addGeoJson(geoJson);
                    resolve(features);
                }
                catch (e) {
                    reject(e);
                }
            }
            else if (typeof geoJson === 'string') {
                d.loadGeoJson(geoJson, null, resolve);
            }
            else {
                reject(`Impossible to extract features from geoJson: wrong argument type`);
            }
        });
    }
}
DataLayerManager.decorators = [
    { type: Injectable }
];
DataLayerManager.ctorParameters = () => [
    { type: GoogleMapsAPIWrapper },
    { type: NgZone }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1sYXllci1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvbGliL3NlcnZpY2VzL21hbmFnZXJzL2RhdGEtbGF5ZXItbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFZLE1BQU0sTUFBTSxDQUFDO0FBRzVDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXBFOztHQUVHO0FBRUgsTUFBTSxPQUFPLGdCQUFnQjtJQUkzQixZQUFvQixRQUE4QixFQUFVLEtBQWE7UUFBckQsYUFBUSxHQUFSLFFBQVEsQ0FBc0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBSGpFLFlBQU8sR0FDZixJQUFJLEdBQUcsRUFBMkMsQ0FBQztJQUUwQixDQUFDO0lBRTlFOztPQUVHO0lBQ0gsWUFBWSxDQUFDLEtBQW1CO1FBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1lBQzdDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztTQUNhLENBQUM7YUFDakMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO2dCQUNqQixpRUFBaUU7Z0JBQ2pFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBRSxDQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDO2FBQ3pGO1lBQ0QsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENB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Q0FBQyxDQUFDO2lCQUNYO2FBQ0Y7aUJBQU0sSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7Z0JBQ3RDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN2QztpQkFBTTtnQkFDTCxNQUFNLENBQUMsa0VBQWtFLENBQUMsQ0FBQzthQUM1RTtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7O1lBdkZGLFVBQVU7OztZQUxGLG9CQUFvQjtZQUpSLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFnbURhdGFMYXllciB9IGZyb20gJy4vLi4vLi4vZGlyZWN0aXZlcy9kYXRhLWxheWVyJztcbmltcG9ydCB7IEdvb2dsZU1hcHNBUElXcmFwcGVyIH0gZnJvbSAnLi8uLi9nb29nbGUtbWFwcy1hcGktd3JhcHBlcic7XG5cbi8qKlxuICogTWFuYWdlcyBhbGwgRGF0YSBMYXllcnMgZm9yIGEgR29vZ2xlIE1hcCBpbnN0YW5jZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERhdGFMYXllck1hbmFnZXIge1xuICBwcml2YXRlIF9sYXllcnM6IE1hcDxBZ21EYXRhTGF5ZXIsIFByb21pc2U8Z29vZ2xlLm1hcHMuRGF0YT4+ID1cbiAgbmV3IE1hcDxBZ21EYXRhTGF5ZXIsIFByb21pc2U8Z29vZ2xlLm1hcHMuRGF0YT4+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfd3JhcHBlcjogR29vZ2xlTWFwc0FQSVdyYXBwZXIsIHByaXZhdGUgX3pvbmU6IE5nWm9uZSkgeyB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgRGF0YSBMYXllciB0byB0aGUgbWFwLlxuICAgKi9cbiAgYWRkRGF0YUxheWVyKGxheWVyOiBBZ21EYXRhTGF5ZXIpIHtcbiAgICBjb25zdCBuZXdMYXllciA9IHRoaXMuX3dyYXBwZXIuY3JlYXRlRGF0YUxheWVyKHtcbiAgICAgIHN0eWxlOiBsYXllci5zdHlsZSxcbiAgICB9IGFzIGdvb2dsZS5tYXBzLkRhdGEuRGF0YU9wdGlvbnMpXG4gICAgLnRoZW4oZCA9PiB7XG4gICAgICBpZiAobGF5ZXIuZ2VvSnNvbikge1xuICAgICAgICAvLyBOT1RFOiBhY2Nlc3NpbmcgXCJmZWF0dXJlc1wiIG9uIGdvb2dsZS5tYXBzLkRhdGEgaXMgdW5kb2N1bWVudGVkXG4gICAgICAgIHRoaXMuZ2V0RGF0YUZlYXR1cmVzKGQsIGxheWVyLmdlb0pzb24pLnRoZW4oZmVhdHVyZXMgPT4gKGQgYXMgYW55KS5mZWF0dXJlcyA9IGZlYXR1cmVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkO1xuICAgIH0pO1xuICAgIHRoaXMuX2xheWVycy5zZXQobGF5ZXIsIG5ld0xheWVyKTtcbiAgfVxuXG4gIGRlbGV0ZURhdGFMYXllcihsYXllcjogQWdtRGF0YUxheWVyKSB7XG4gICAgdGhpcy5fbGF5ZXJzLmdldChsYXllcikudGhlbihsID0+IHtcbiAgICAgIGwuc2V0TWFwKG51bGwpO1xuICAgICAgdGhpcy5fbGF5ZXJzLmRlbGV0ZShsYXllcik7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVHZW9Kc29uKGxheWVyOiBBZ21EYXRhTGF5ZXIsIGdlb0pzb246IG9iamVjdCB8IHN0cmluZykge1xuICAgIHRoaXMuX2xheWVycy5nZXQobGF5ZXIpLnRoZW4obCA9PiB7XG4gICAgICBsLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gICAgICAgIGwucmVtb3ZlKGZlYXR1cmUpO1xuXG4gICAgICAgIC8vIE5PVEU6IGFjY2Vzc2luZyBcImZlYXR1cmVzXCIgb24gZ29vZ2xlLm1hcHMuRGF0YSBpcyB1bmRvY3VtZW50ZWRcbiAgICAgICAgY29uc3QgaW5kZXggPSAobCBhcyBhbnkpLmZlYXR1cmVzLmluZGV4T2YoZmVhdHVyZSwgMCk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgKGwgYXMgYW55KS5mZWF0dXJlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RGF0YUZlYXR1cmVzKGwsIGdlb0pzb24pLnRoZW4oZmVhdHVyZXMgPT4gKGwgYXMgYW55KS5mZWF0dXJlcyA9IGZlYXR1cmVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldERhdGFPcHRpb25zKGxheWVyOiBBZ21EYXRhTGF5ZXIsIG9wdGlvbnM6IGdvb2dsZS5tYXBzLkRhdGEuRGF0YU9wdGlvbnMpXG4gIHtcbiAgICB0aGlzLl9sYXllcnMuZ2V0KGxheWVyKS50aGVuKGwgPT4ge1xuICAgICAgbC5zZXRDb250cm9sUG9zaXRpb24ob3B0aW9ucy5jb250cm9sUG9zaXRpb24pO1xuICAgICAgbC5zZXRDb250cm9scyhvcHRpb25zLmNvbnRyb2xzKTtcbiAgICAgIGwuc2V0RHJhd2luZ01vZGUob3B0aW9ucy5kcmF3aW5nTW9kZSk7XG4gICAgICBsLnNldFN0eWxlKG9wdGlvbnMuc3R5bGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBHb29nbGUgTWFwcyBldmVudCBsaXN0ZW5lciBmb3IgdGhlIGdpdmVuIERhdGFMYXllciBhcyBhbiBPYnNlcnZhYmxlXG4gICAqL1xuICBjcmVhdGVFdmVudE9ic2VydmFibGU8VD4oZXZlbnROYW1lOiBzdHJpbmcsIGxheWVyOiBBZ21EYXRhTGF5ZXIpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyOiBPYnNlcnZlcjxUPikgPT4ge1xuICAgICAgdGhpcy5fbGF5ZXJzLmdldChsYXllcikudGhlbigoZDogZ29vZ2xlLm1hcHMuRGF0YSkgPT4ge1xuICAgICAgICBkLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgKGU6IFQpID0+IHRoaXMuX3pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQoZSkpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgZmVhdHVyZXMgZnJvbSBhIGdlb0pzb24gdXNpbmcgZ29vZ2xlLm1hcHMgRGF0YSBDbGFzc1xuICAgKiBAcGFyYW0gZCA6IGdvb2dsZS5tYXBzLkRhdGEgY2xhc3MgaW5zdGFuY2VcbiAgICogQHBhcmFtIGdlb0pzb24gOiB1cmwgb3IgZ2VvanNvbiBvYmplY3RcbiAgICovXG4gIGdldERhdGFGZWF0dXJlcyhkOiBnb29nbGUubWFwcy5EYXRhLCBnZW9Kc29uOiBvYmplY3QgfCBzdHJpbmcpOiBQcm9taXNlPGdvb2dsZS5tYXBzLkRhdGEuRmVhdHVyZVtdPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGdvb2dsZS5tYXBzLkRhdGEuRmVhdHVyZVtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgZ2VvSnNvbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZXMgPSBkLmFkZEdlb0pzb24oZ2VvSnNvbik7XG4gICAgICAgICAgICByZXNvbHZlKGZlYXR1cmVzKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBnZW9Kc29uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGQubG9hZEdlb0pzb24oZ2VvSnNvbiwgbnVsbCwgcmVzb2x2ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KGBJbXBvc3NpYmxlIHRvIGV4dHJhY3QgZmVhdHVyZXMgZnJvbSBnZW9Kc29uOiB3cm9uZyBhcmd1bWVudCB0eXBlYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59XG4iXX0=