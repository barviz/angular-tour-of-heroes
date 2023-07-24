import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  //es una propiedad de entrada
  //porque el HeroesComponent externo se vinculará de esta manera
  @Input() hero?: Hero;

  constructor(private route: ActivatedRoute, private heroService: HeroService, private location: Location) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    const id = idString !== null ? +idString : 0;
    if (id !== 0) {
      this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
    }
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }
}

//este componente solo toma un objeto héroe a través de la propiedad hero y lo muestra

//ActivatedRoute contiene información sobre la ruta a esta instancia del HeroDetailComponent
//componente que está interesado en los parámetros de la ruta extraídos de la URL
//HeroService obtiene los datos del héroe del servidor remoto y este componente lo usará para mostrar el héroe
//Location un servicio angular para interactuar con el navegador. vuelve a la vista que navegó aquí

//*(+) convierte la cadena en un número como los parámetros de ruta son siempre cadenas
//(que es lo que debería ser un "id" de héroe)