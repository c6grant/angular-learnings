import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { tap } from 'rxjs/internal/operators/tap';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Failed to load available places'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Failed to load user places'
    ).pipe(
      tap({
        next: (userPlaces) => {
          this.userPlaces.set(userPlaces);
        },
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const currentPlaces = this.userPlaces();
    if (!currentPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set([...currentPlaces, place]);
    }

    return this.httpClient
      .put('http://localhost:3000/user-places', {
        placeId: place.id,
      })
      .pipe(
        catchError((errorRes) => {
          this.userPlaces.set(currentPlaces);
          this.errorService.showError('Failed to add place to user places');
          return throwError(
            () => new Error('Failed to add place to user places')
          );
        })
      );
  }

  removeUserPlace(place: Place) {
    const prevUserPlaces = this.userPlaces();
    return this.httpClient
      .delete<void>(`http://localhost:3000/user-places/${place.id}`)
      .pipe(
        tap({
          next: () => {
            this.userPlaces.set(
              prevUserPlaces.filter((p) => p.id !== place.id)
            );
          },
        }),
        catchError((errorRes) => {
          this.userPlaces.set(prevUserPlaces);
          this.errorService.showError(
            'Failed to remove place from user places'
          );
          return throwError(
            () => new Error('Failed to remove place from user places')
          );
        })
      );
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((resData) => resData.places),
      catchError((errorRes) => throwError(() => new Error(errorMessage)))
    );
  }
}
