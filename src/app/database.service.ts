import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    private baseUrl = window.location.href;

    constructor(private http: HttpClient) {}

    private getData(request: object): Observable<any> {
        const query = JSON.stringify(request);
        const params = new HttpParams().set('query', query);
        return this.http.get<any>(this.baseUrl + 'stats/collections', { params });
    }

    public getMostActivePlayers(): Observable<{ _id: string; count: number }[]> {
        const request = {
            aggregate: 'users_statuses',
            pipeline: [{ $group: { _id: '$id', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }],
            cursor: { batchSize: 0 },
        };
        return this.getData(request);
    }

    public playersCount(): Observable<number> {
        const request = {
            aggregate: 'users',
            pipeline: [{ $group: { _id: null, count: { $sum: 1 } } }],
            cursor: { batchSize: 0 },
        };
        return this.getData(request).pipe(map((response: { count: number }[]) => response[0].count));
    }

    public getMostAttackPlayers(): Observable<{ _id: string; count: number }[]> {
        const request = {
            aggregate: 'user_attacks',
            pipeline: [{ $group: { _id: '$id', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }],
            cursor: { batchSize: 0 },
        };
        return this.getData(request);
    }

    public getMostChestPlayers(): Observable<{ playerId: string; chestCount: number }[]> {
        const request = {
            aggregate: 'users',
            pipeline: [
                {
                    $lookup: {
                        from: 'chest_grabbed',
                        localField: 'id',
                        foreignField: 'playerid',
                        as: 'chest_grabbed',
                    },
                },
                {
                    $group: {
                        _id: '$id',
                        playerId: { $first: '$id' },
                        chestCount: { $sum: { $size: '$chest_grabbed' } },
                    },
                },
                {
                    $sort: { chestCount: -1 },
                },
                {
                    $limit: 10,
                },
                {
                    $project: {
                        _id: 0,
                        playerId: 1,
                        chestCount: 1,
                    },
                },
            ],
            cursor: { batchSize: 0 },
        };
        return this.getData(request);
    }
}
