import { API_KEY } from "./constants.js";
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    //variables globales
    
    let containerMovie = document.getElementById("elements-movie");
    let spanResultados = document.getElementById("numTotalLanzamientos");
    const tituloOBusqueda = document.getElementById("busquedaOLazamientos");
    const paginacion = document.getElementById("lista-pagination");
    const botonSearch = document.getElementById("btnSearch");

    function loadIndex() {
      botonSearch.addEventListener("click", llamadoBuscar, false);
      containerMovie.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("one-movie")) {
          const peliculaSeleccionada = e.target.getAttribute("id");
          peliculaSolicitada(peliculaSeleccionada);
        }
      });
      paginacion.addEventListener("click", (e) => {
        if (e.target.classList.contains("page-link")) {
          const paginaSeleccionada = e.target.getAttribute("id");
          llamarPagina(paginaSeleccionada);
        }
      });
      const urlMovies = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-MX&region=MX&page=1`;
      sendRequest(urlMovies, "1");
    }

    function loadContentHome(data) {
      const { page, results, total_pages, total_results } = data;
      spanResultados.innerHTML = `Página ${page} de ${total_results} resultados`;
      insertHmtl(results);
      insertPagination(total_pages, page);
    }

    function loadContentSearch(data) {
      const { page, results, total_pages, total_results } = data;
      tituloOBusqueda.innerHTML = "";
      containerMovie.innerHTML = "";
      paginacion.innerHTML = "";
      tituloOBusqueda.innerHTML = "Búsqueda";
      spanResultados.innerHTML = `Página ${page} de ${total_results} resultados`;

      insertHmtl(results);
      insertPagination(total_pages, page);
    }

    function loadContentOneMovie(data) {
      containerMovie.innerHTML = "";
      paginacion.innerHTML = "";
      spanResultados.innerHTML = ``;
      tituloOBusqueda.innerHTML = `Detalles de la película`;
      insertHmtlOneMovie(data);
    }

    function loadContentPagination(data) {
      const { page, results, total_pages, total_results } = data;

      containerMovie.innerHTML = "";
      paginacion.innerHTML = "";
      spanResultados.innerHTML = `Página ${page} de ${total_results} resultados`;
      insertHmtl(results);
      insertPagination(total_pages, page);
    }

    function insertHmtlOneMovie(data) {
      let movieTitle = document.createElement("div");
      movieTitle.className = "col-12";
      movieTitle.innerHTML = createCardOneMovie(data);
      containerMovie.appendChild(movieTitle);
    }

    function createCardOneMovie(data) {
      const {
        original_language,
        original_title,
        overview,
        poster_path,
        release_date,
        runtime,
        vote_average,
      } = data;
      return `<div class="card mb-3" >
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
    }

    async function sendRequest(url, value) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          const data = JSON.parse(xhr.responseText);
          switch (value) {
            case "1":
              loadContentHome(data);
              break;
            case "2":
              loadContentSearch(data);
              break;
            case "3":
              loadContentOneMovie(data);
              break;
            case "4":
              loadContentPagination(data);
              break;
            default:
              break;
          }
        }
      };
      xhr.send();
    }

    function insertHmtl(results) {
      results.forEach((element) => {
        let movieTitle = document.createElement("div");
        movieTitle.className = "col-12 col-sm-6 col-md-4  col-lg-3 p-3";
        movieTitle.innerHTML = createCard(element);
        containerMovie.appendChild(movieTitle);
      });
    }

    function insertPagination(totalPages, page) {
      for (let index = 1; index <= totalPages; index++) {
        let listPagination = document.createElement("li");
        index === page
          ? (listPagination.className = "page-item active")
          : (listPagination.className = "page-item");
        listPagination.innerHTML = `<a class="page-link" href="#" id="${index}" >${index}</a>`;
        paginacion.appendChild(listPagination);
      }
    }

    function createCard(element) {
      return `<div class="card">
            <img ${
              element.poster_path == null
                ? `src="img/under-construction.jpg"`
                : `src="https://image.tmdb.org/t/p/w500${element.poster_path}"`
            } class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
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
    }

    function llamadoBuscar() {
      let valorInput = document.getElementById("inputBuscar").value;
      const urlBusqueda = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-MX&region=MX&page=1&query=${valorInput}`;
      sendRequest(urlBusqueda, "2");
    }

    function peliculaSolicitada(pelicula) {
      const urlPagSoli = `https://api.themoviedb.org/3/movie/${pelicula}?api_key=${API_KEY}&language=es-MX`;
      sendRequest(urlPagSoli, "3");
    }

    function llamarPagina(pagina) {
      let valorInput = document.getElementById("inputBuscar").value;
      let urlMoviesPag;
      //se verifica si la paginacion es para la barra de busqueda o la pagina principal
      if (valorInput == "") {
        urlMoviesPag = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-MX&region=MX&page=${pagina}`;
      } else {
        urlMoviesPag = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-MX&region=MX&page=${pagina}&query=${valorInput}`;
      }
      sendRequest(urlMoviesPag, "4");
    }

    //RENDER
    loadIndex();
  });
})();
