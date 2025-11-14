import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-map-section',
  standalone: true,
  template: `
    <div class="map-container">
      <div class="map-header">
        <div class="map-header-content">
          <h3 class="map-title">Découvrez nos Services à Travers le Maroc</h3>
          <p class="map-subtitle">Cliquez sur les marqueurs pour explorer les destinations disponibles</p>
        </div>
        <div class="map-stats">
          <div class="stat">
            <span class="stat-number">{{ locations.length }}</span>
            <span class="stat-label">Villes</span>
          </div>
          <div class="stat">
            <span class="stat-number">500+</span>
            <span class="stat-label">Hôtes</span>
          </div>
          <div class="stat">
            <span class="stat-number">1000+</span>
            <span class="stat-label">Services</span>
          </div>
        </div>
      </div>
      <div id="map" class="map-element"></div>
      <div class="map-footer">
        <div class="map-legend">
          <div class="legend-item">
            <div class="legend-marker"></div>
            <span>Services Disponibles</span>
          </div>
        </div>
        <button class="explore-btn" (click)="onExploreClick()">
          <span class="material-icons">explore</span>
          Explorer Toutes les Destinations
        </button>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      background: white;
    }

    .map-header {
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .map-header-content {
      flex: 1;
      min-width: 250px;
    }

    .map-title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    .map-subtitle {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }

    .map-stats {
      display: flex;
      gap: 24px;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 24px;
      font-weight: 700;
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }

    .map-element {
      height: 500px;
      width: 100%;
      border: none;
    }

    .map-legend {
      padding: 16px 24px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      display: flex;
      justify-content: center;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6c757d;
    }

    .legend-marker {
      width: 12px;
      height: 12px;
      background: #dc3545;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .map-footer {
      padding: 24px 32px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .explore-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .explore-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .explore-btn .material-icons {
      font-size: 18px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .map-header {
        padding: 16px;
        flex-direction: column;
        text-align: center;
      }

      .map-stats {
        justify-content: center;
      }

      .map-title {
        font-size: 20px;
      }

      .map-subtitle {
        font-size: 14px;
      }

      .map-element {
        height: 350px;
      }

      .map-legend {
        padding: 12px 16px;
      }

      .map-footer {
        padding: 20px;
        flex-direction: column;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .map-stats {
        gap: 16px;
      }

      .stat-number {
        font-size: 20px;
      }

      .map-title {
        font-size: 18px;
      }
    }
  `]
})
export class MapSectionComponent implements AfterViewInit, OnDestroy {
  @Input() locations: { lat: number; lng: number; label?: string }[] = [];
  private map: L.Map | undefined;

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  onExploreClick() {
    // Navigate to services page or scroll to services section
    console.log('Explore all destinations clicked');
  }

  private async initializeMap() {
    try {
      const L = await import('leaflet');

      // Initialize map centered on Morocco
      this.map = L.map('map', {
        center: [31.7917, -7.0926],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: true,
        boxZoom: false,
        keyboard: false,
        dragging: true,
        touchZoom: true
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.map);

      // Add markers for locations
      this.locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background: #dc3545; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(this.map);

        if (location.label) {
          marker.bindPopup(`
            <div style="font-family: 'Roboto', sans-serif; text-align: center;">
              <strong style="color: #333; font-size: 16px;">${location.label}</strong>
              <br>
              <span style="color: #666; font-size: 14px;">Services disponibles</span>
            </div>
          `);
        }
      });

      // Fit map to show all markers
      if (this.locations.length > 0) {
        const group = L.featureGroup(this.locations.map(loc => L.marker([loc.lat, loc.lng])));
        this.map.fitBounds(group.getBounds().pad(0.1));
      }

    } catch (error) {
      console.error('Failed to load Leaflet:', error);
    }
  }
}
