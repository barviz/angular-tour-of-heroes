import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero'; //importo la interfaz hero
//import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs';
import { MessageService } from '../message.service';

//decorador que especifica metadatos Angular para un componente
@Component({
  selector: 'app-heroes', //selector de elementos CSS para el componente
  //'app-heroes', coincide con el nombre del elemento HTML que identifica este componente en el componente padre Plantillas
  templateUrl: './heroes.component.html', //La ubicación del archivo plantilla para el componente
  styleUrls: ['./heroes.component.css'] //ubicación de los estilos CSS privados del componente
})
export class HeroesComponent implements OnInit {

  //agrego una propiedad hero
  //esta propiedad hero del component la voy a refactorizar
  //para que sea del tipo 'Héroe'
  //hero = 'Superman';

  /*hero : Hero = {
    id: 1,
    name: 'Superman'
  };*/

  //defineo una propiedad de componente llamada heroes
  //para exponer el array HEROES para la vinculación
  //heroes = HEROES;

  heroes?: Hero[];

  selectedHero?: Hero;

  //inyecto heroservice mediante un parametro privado en el constructor
  //cuando angular crea un HeroesComponent, el sistema inyección de dependencia
  //establece el parámetro heroservice en la instancia única de HeroService
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  // gancho de ciclo de vida ("lifecycle hook")
  //Angular lo llama inmediatamente después de crear el componente
  //adecuado para poner la lógica de inicialización
  ngOnInit(): void {
    this.getHeroes();

  }

  //se asigna el héroe en el que se hizo clic desde Plantillas
  //al componente seleccionadoHero
  /*onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }*/

  /*getHeroes(): void {
    this.heroes = this.heroService.getHeroes(); //recupero a los héroes del servicio*
  }*/

  //espera a que el observable emita una serie de héroes, que podría suceder ahora o varios minutos dsp
  //el método subscribe() pasa el arreglo emitida a la devolución de llamada, que establece la propiedad heroes del componente
  //este enfoque asincrónico funcionará cuando el HeroService solicite héroes del servidor
  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  /*
  cuando el nombre de pila no está en blanco, el controlador crea un objeto similar a un Héroe del nombre (sólo falta el id)
  y lo pasa al método addHero() del servicio
  cuando addHero() se guarda correctamente, la devolución de llamada subscribe() recibe el nuevo héroe
  y lo empuja a la lista de héroes para mostrarlo
  */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        if (this.heroes) {
          this.heroes.push(hero);
        }
      });
  }

  /*
  aunque el componente delega la eliminación de héroes al HeroService, sigue siendo responsable
  de actualizar su propia lista de héroes
  el método delete() del componente elimina inmediatamente el hero-to-delete de esa lista
  anticipando que el HeroService tendrá éxito en el servidor
  el servicio no enviará la solicitud de eliminación al servidor si no se subscribe
  "un observable no hace nada hasta que algo se suscribe"
  */
  delete(hero: Hero): void {
    if (this.heroes) {
      this.heroes = this.heroes.filter(h => h !== hero);
    }
    this.heroService.deleteHero(hero).subscribe();
  }

}


//siempre exporta la clase de componente
//por lo que siempre puede importarla en otro lugar
//como un AppModule

//el constructor no debe hacer nada
//hay que reservar el constructor para una inicialización simple, como conectar los parámetros del constructor a las propiedades

//* el método HeroService.getHeroes() tiene una firma sincrónica, es decir el HeroService puede buscar héroes sincrónicamente
//el heroeshomponent consume el resultado getHeroes() como si los héroes pudieran ser recuperados sincrónicamente
//cuando deba buscarlos en un servidor la operación será del tipo asincrónica
