import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //define una propiedad de arreglo de héroes
  heroes: Hero[] = [];

  //el constructor espera que angular inyecte el HeroService en una propiedad privada de heroService
  constructor(private heroService: HeroService) {}

  //el método del ciclo de vida ngOnInit() llama a getHeroes()
  ngOnInit(): void {
    this.getHeroes();
  }

  //devuelve la lista dividida de héroes en las posiciones 1 y 5
  //devolviendo solo cuatro de los mejores héroes (segundo, tercero, cuarto y quinto)
  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }

}
