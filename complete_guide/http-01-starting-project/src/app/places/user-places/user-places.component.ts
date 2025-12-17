import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NgIf } from '@angular/common';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent, NgIf],
})
export class UserPlacesComponent {
  isFetching = signal(false);
  error = signal<string>('');
  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places = this.placeService.loadedUserPlaces;

  ngOnInit() {
    this.isFetching.set(true);
    const httpSubscription = this.placeService.loadUserPlaces().subscribe({
      error: (err) => {
        this.error.set(err.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      // Clean up logic here
      httpSubscription.unsubscribe();
    });
  }

  onDeletePlace(place: Place) {
    const previousPlaces = this.places();
    this.placeService.removeUserPlace(place).subscribe({});
  }
}
