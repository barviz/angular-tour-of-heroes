import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const heroes = [
      { id: 11, name: 'Aquaman' },
      { id: 12, name: 'Batman' },
      { id: 13, name: 'Cyborg' },
      { id: 14, name: 'Superman' },
      { id: 15, name: 'The Flash' },
      { id: 16, name: 'Wonder Woman' },
      { id: 17, name: 'Mera' },
      { id: 18, name: 'Batgirl' },
      { id: 19, name: 'Martian Manhunter' },
      { id: 20, name: 'Green Lantern' }
    ];
    return { heroes };
  }

  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}

//asumirá la función de mock-heroes.ts