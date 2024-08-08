(function () {
  document.addEventListener("DOMContentLoaded", () => {
    //variables globales
    let containerMovie = document.getElementById("elements-movie");
    const urlMovies = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}&language=es-MX&region=MX&page=1`;
    let spanResultados = document.getElementById("numTotalLanzamientos");
    const tituloOBusqueda = document.getElementById("busquedaOLazamientos");
    const paginacion = document.getElementById("lista-pagination");

    //Boton que llama la funcion de llamadoBuscar
    const botonSearch = document
      .getElementById("btnSearch")
      .addEventListener("click", llamadoBuscar, false);
    //Evento que dispara la paginacion
    paginacion.addEventListener("click", (e) => {
      //e.preventDefault();
      if (e.target.classList.contains("page-link")) {
        const paginaSeleccionada = e.target.getAttribute("id");
        llamarPagina(paginaSeleccionada);
      }
    });

    containerMovie.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("one-movie")) {
        const peliculaSeleccionada = e.target.getAttribute("id");
        peliculaSolicitada(peliculaSeleccionada);
      }
    });
    /**LLAMAR A LA FUNCION PELICULA SOLICITADA */
    function peliculaSolicitada(pelicula) {
      const urlPagSoli = `https://api.themoviedb.org/3/movie/${pelicula}?api_key=${key}&language=es-MX`;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", urlPagSoli, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          // se almacena en un variable los datos de la respuesta en formato JSON
          let data = JSON.parse(xhr.responseText);
          console.log(data);

          // se destructura la variable data
          const {
            original_language,
            original_title,
            overview,
            poster_path,
            release_date,
            runtime,
            vote_average,
          } = data;
          // se limpia el HTML
          containerMovie.innerHTML = "";
          paginacion.innerHTML = "";
          // se va a mostrar el total de los resultados de la consulta
          spanResultados.innerHTML = ``;
          tituloOBusqueda.innerHTML = `Detalles de la película`;

          let movieTitle = document.createElement("div");
          movieTitle.className = "col-12";

          movieTitle.innerHTML = `<div class="card mb-3" >
                                        <div class="row">
                                          <div class="col-12 col-md-4 col-lg-5">
                                            <img class="w-100" ${
                                              poster_path == null
                                                ? `src="img/under-construction.jpg"`
                                                : `src="https://image.tmdb.org/t/p/w500${poster_path}"`
                                            } alt="...">
                                          </div>
                                          <div class="col-12 col-md-8 col-lg-7">
                                            <div class="card-body">
                                              <h3 class="card-title">${original_title}</h3>
                                              <p class="card-text">Idioma original: ${original_language}</p>
                                              <p class="card-text">Calificación: ${vote_average}</p>
                                              <p class="card-text">Duración: ${runtime} min.</p>                                                
                                              <p class="card-text">${overview}</p>
                                              
                                              <p class="card-text"><small class="text-muted">Fecha de estreno: ${release_date}</small></p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>`;
          containerMovie.appendChild(movieTitle);

          // se itera sobre results de data

          console.log("se cargo correctamente");
          //console.log(results)
        }
      };
      xhr.send();
    } // Termina funcion peliculaSolicitada

    /**FUNCION QUE SE LANZA A DAR CLIC EN LA PAGINACION */

    function llamarPagina(pagina) {
      let valorInput = document.getElementById("inputBuscar").value;
      let urlMoviesPag;
      //console.log(valorInput)
      //se verifica si la paginacion es para la barra de busqueda o la pagina principal
      if (valorInput == "") {
        urlMoviesPag = `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=es-MX&region=MX&page=${pagina}`;
      } else {
        urlMoviesPag = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=es-MX&region=MX&page=${pagina}&query=${valorInput}`;
      }
      // se hace el llamado  a la API
      let xhr = new XMLHttpRequest();

      xhr.open("GET", urlMoviesPag, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          // se almacena en un variable los datos de la respuesta en formato JSON
          let data = JSON.parse(xhr.responseText);
          console.log(data);

          // se destructura la variable data
          const { page, results, total_pages, total_results } = data;
          // se limpia el HTML
          containerMovie.innerHTML = "";
          paginacion.innerHTML = "";
          // se va a mostrar el total de los resultados de la consulta
          spanResultados.innerHTML = `Página ${page} de ${total_results} resultados`;

          // se itera sobre results de data
          results.forEach((element) => {
            let movieTitle = document.createElement("div");
            movieTitle.className = "col-12 col-sm-6 col-md-4  col-lg-3 p-3";
            // se crea el html
            movieTitle.innerHTML = `<div class="card" >
                                                    <img ${
                                                      element.poster_path ==
                                                      null
                                                        ? `src="img/under-construction.jpg"`
                                                        : `src="https://image.tmdb.org/t/p/w500${element.poster_path}"`
                                                    } class="card-img-top" alt="...">
                                                    <div class="card-body">
                                                        <h5 class="card-title">${
                                                          element.title
                                                        }</h5>
                                                        <p class="card-text">${element.overview.substr(
                                                          0,
                                                          100
                                                        )}...<a href="#" class="one-movie" id="${
              element.id
            }">Ver más</a></p>
                                                        <p class="card-text"><small class="text-muted">Fecha de estreno: ${
                                                          element.release_date
                                                        }</small></p>
                                                    </div>
                                                </div>`;

            containerMovie.appendChild(movieTitle);
          });
          // se crea los botones de la paginación
          for (let i = 1; i <= total_pages; i++) {
            let listPagination = document.createElement("li");
            if (i === page) {
              listPagination.className = "page-item active";
            } else {
              listPagination.className = "page-item";
            }

            listPagination.innerHTML = `<a class="page-link" href="#" id="${i}" >${i}</a>`;
            paginacion.appendChild(listPagination);
          }
          console.log("se cargo correctamente");
          //console.log(results)
        }
      };

      xhr.send();
    } /*TERMINA LA FUNCION LLAMAR PAGINA*/

    /**SE HACE LA CONSULTA A LA API QUE SON LOS DEFAULT AL ENTRAR AL INDEX */
    //se crea un xhtmlrequest
    let xhr = new XMLHttpRequest();

    xhr.open("GET", urlMovies, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // se almacena en un variable los datos de la respuesta en formato JSON
        let data = JSON.parse(xhr.responseText);
        console.log(data);

        // se destructura la variable data
        const { page, results, total_pages, total_results } = data;

        // se va a mostrar el total de los resultados de la consulta
        spanResultados.innerHTML = `Página ${page} de ${total_results} resultados`;

        // se itera el objeto data, sobre los resultados que los almacena en un arreglo
        results.forEach((element) => {
          let movieTitle = document.createElement("div");
          movieTitle.className = "col-12 col-sm-6 col-md-4  col-lg-3 p-3";
          movieTitle.innerHTML = `<div class="card" >
                                                <img ${
                                                  element.poster_path == null
                                                    ? `src="img/under-construction.jpg"`
                                                    : `src="https://image.tmdb.org/t/p/w500${element.poster_path}"`
                                                } class="card-img-top" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title">${
                                                      element.title
                                                    }</h5>
                                                    <p class="card-text">${element.overview.substr(
                                                      0,
                                                      100
                                                    )}...<a href="#" class="one-movie" id="${
            element.id
          }">Ver más</a></p>
                                                    <p class="card-text"><small class="text-muted">Fecha de estreno: ${
                                                      element.release_date
                                                    }</small></p>
                                                </div>
                                            </div>`;

          containerMovie.appendChild(movieTitle);
        });
        //Se hace la paginacion
        for (let i = 1; i <= total_pages; i++) {
          let listPagination = document.createElement("li");

          if (i === page) {
            listPagination.className = "page-item active";
          } else {
            listPagination.className = "page-item";
          }

          listPagination.innerHTML = `<a class="page-link" href="#" id="${i}" >${i}</a>`;

          paginacion.appendChild(listPagination);
        }
        console.log("se cargo correctamente");
        //console.log(results)
      }
    };

    xhr.send();

    /**FUNCION QUE SE MANDA A LLAMAR CUANDO SE DA CLIC EN LA BARRA DE BUSQUEDA */

    function llamadoBuscar() {
      let valorInput = document.getElementById("inputBuscar").value;
      const urlBusqueda = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=es-MX&region=MX&page=1&query=${valorInput}`;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", urlBusqueda, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let data2 = JSON.parse(xhr.responseText);
          console.log(data2);
          const { page, results, total_pages, total_results } = data2;
          tituloOBusqueda.innerHTML = "";
          containerMovie.innerHTML = "";
          paginacion.innerHTML = "";
          tituloOBusqueda.innerHTML = "Búsqueda";
          // se va a mostrar el total de los resultados de la consulta
          spanResultados.innerHTML = `Página ${page} de ${total_results} resultados`;
          console.log(total_pages);

          // se itera el objeto data, sobre los resultados que los almacena en un arreglo
          results.forEach((element) => {
            let movieTitle = document.createElement("div");
            movieTitle.className = "col-12 col-sm-6 col-md-4  col-lg-3 p-3";
            movieTitle.innerHTML = `<div class="card" >
                                                    <img ${
                                                      element.poster_path ==
                                                      null
                                                        ? `src="img/under-construction.jpg"`
                                                        : `src="https://image.tmdb.org/t/p/w500${element.poster_path}"`
                                                    } class="card-img-top" alt="...">
                                                    <div class="card-body">
                                                        <h5 class="card-title">${
                                                          element.title
                                                        }</h5>
                                                        <p class="card-text">${element.overview.substr(
                                                          0,
                                                          100
                                                        )}...<a href="#" class="one-movie" id="${
              element.id
            }">Ver más</a></p>
                                                        <p class="card-text"><small class="text-muted">Fecha de estreno: ${
                                                          element.release_date
                                                        }</small></p>
                                                    </div>
                                                </div>`;

            containerMovie.appendChild(movieTitle);
          });
          for (let i = 1; i <= total_pages; i++) {
            let listPagination = document.createElement("li");
            if (i === page) {
              listPagination.className = "page-item active";
            } else {
              listPagination.className = "page-item";
            }

            listPagination.innerHTML = `<a class="page-link" href="#" id="${i}" >${i}</a>`;
            paginacion.appendChild(listPagination);
          }
          console.log("se cargo correctamente");
          //console.log(results)
        }
      };

      xhr.send();
    } //TERMINA FUNCION LLAMADA BUSQUEDA
  });
})();
