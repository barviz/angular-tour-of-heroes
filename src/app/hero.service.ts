import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

//indica que la clase participa en el sistema de inyección de dependencia
//proporcionará servicios inyectables y puede tener dependencias
//el decorador @Injectable() acepta el objeto de metadatos de un servicio
//de la misma manera que el decorador @Component() para las clases de componente
@Injectable({
  providedIn: 'root' //por defecto, el comando angular cli registra a un proveedor con el inyector raíz para su servicio
  //al incluir los metadatos del proveedor, que se proporcionan en el decorador @Injectable()
  //cuando proporciona el servicio en el nivel raíz, angular crea una única instancia compartida de HeroService
  //e inyecta en cualquier clase que lo solicite
  //el registro del proveedor en los metadatos @Injectable también le permite a Angular
  //optimizar una aplicación eliminando el servicio si resulta que no se usará después de todo
})

//como los componentes sólo se centran en presentar datos
//se delega el acceso a los datos a un servicio
//ya que son una manera de compartir información entre clases que no se conocen entre sí
export class HeroService {

  //angular inyectará el singleton MessageService en esa propiedad cuando crea el HeroService
  //(servicio en servicio) inyecta el MessageService en el HeroService que se inyecta en el HeroesComponent
  constructor(private http: HttpClient, private messageService: MessageService) { }

  private heroesUrl = 'api/heroes';  // URL to web api

  /*getHeroes(): Hero[] {
    return HEROES; //heroes simulados
  }*/
  /*getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes'); //envío mje cuando se busquen los héroes
    return of(HEROES); //simulo obtener datos del servidor con la función RxJS of()
    //of (HEROES) devuelve un Observable <Hero[]> que emite un valor único, el conjunto de héroes simulados
  }*/

  //GET heroes desde el servidor
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')), //** 
        catchError(this.handleError<Hero[]>('getHeroes', [])) //*
      );
  }
  //la llamada a HttpClient.get() devuelve un Observable<Hero[]>
  //es decir "un observable de un arreglo de héroes"
  //en la práctica, solo devolverá un único conjunto de héroes
  //HttpClient.get() devuelve el cuerpo de la respuesta como un objeto JSON sin tipo de forma predeterminada
  //al aplicar el especificador de tipo opcional, <Hero[]>, se agregan capacidades de typescript, que reducen los errores durante el tiempo de compilación

  /*getHero(id: number): Observable<Hero | undefined> {
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }*/
  //getHero() construye una url de solicitud con la identificación del héroe deseado
  //devuelve un Observable<Hero> (un observable de objetos Hero), no un observable de arreglos de héroes
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  //usa http.put() para persistir el héroe cambiado en el servidor 
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  //espera que el servidor genere una identificación para el nuevo héroe
  //que devuelve en el Observable<Hero> a la persona que llama
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /*
  a medida que el usuario escribe un nombre en un cuadro de búsqueda, harás solicitudes HTTP
  repetidas para héroes filtrados por ese nombre
  su objetivo es emitir solo tantas solicitudes como sea necesario
  */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]); //regresa inmediatamente con una matriz vacía si no hay un término de búsqueda
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //la API web de héroes espera un encabezado especial en las solicitudes de guardado HTTP
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  //en lugar de manejar el error directamente, devuelve una función de controlador de errores a catchError
  //que se configuró con el nombre de la operación que falló y un valor de retorno seguro
  //después de informar el error a la consola, el controlador construye un mensaje fácil de usar y
  //devuelve un valor seguro a la aplicación para que la aplicación pueda seguir funcionando
  //como cada método de servicio devuelve un tipo diferente de resultado 'Observable'
  //handleError() toma un parámetro de tipo para que pueda devolver el valor seguro como el tipo que la aplicación espera
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

/*la menera en que ponemos este servicio a disposición del sistema de inyección de dependencias
es mediante el decorador @Injectable
luego angular va a poder inyectarlo en un componente al registrar un proveedor
proveedor: algo que puede crear o prestar un servicio. es creado por el decorador para el servicio ej: en este caso
crea una instancia de la clase HeroService para proporcionar el servicio (en este caso en la raiz/root)
la presencia del inyector, que es el objeto responsable de elegir e inyectando el proveedor donde la aplicación lo requiere
es quien me asegura que este heroservice puede proporcionar el servicio
*/

//* catchError() intercepta un observable que falló, pasa el error a un controlador de errores que puede hacer lo que quiera con el error
//handleError() informa el error y luego devuelve un resultado inocuo para que la aplicación siga funcionando.

//** el operador tap mira los valores observables, hace algo con esos valores
//y los pasa La devolución de llamada tap() (no toca los valores en sí mismos)