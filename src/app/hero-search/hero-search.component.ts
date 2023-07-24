import { Component, OnInit } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]> = of([]); //asigna un observable vacío como valor inicial
  private searchTerms = new Subject<string>(); //*

  constructor(private heroService: HeroService) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  /**
  ngOnInit() filtra los searchTerms observables a través de una secuencia de operadores RxJS
  que reducen el número de llamadas searchHeroes(), en última instancia,
  devuelve un observable de resultados de búsqueda de héroes oportunos (cada uno un Héroe[])
   */
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300), // espera hasta que el flujo de nuevos eventos de cadena se detenga durante 300 milisegundos antes de pasar por la última cuerda. nunca hará solicitudes con más frecuencia que 300 ms
      distinctUntilChanged(), // asegura que una solicitud se envíe solo si el texto del filtro cambió
      switchMap((term: string) => this.heroService.searchHeroes(term)), //llama al servicio de búsqueda para cada término de búsqueda que pasa por debounce() y distinctUntilChanged()
                                                                        //cancela y descarta los observables de búsqueda anteriores, devolviendo solo el último servicio de búsqueda observable
    );
  }
}

//* un subject es tanto una fuente de valores observables como un Observable en sí mismo
//puede suscribirse a un subject como lo haría con cualquier Observable
//también puede insertar valores en ese Observable llamando a su método next(value)
//como lo hace el método search()