const global = {
  currentPage: window.location.pathname,
};

// Highlight active links
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}
const API_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'f6fae4956dab7f7476dab631a534eac7';

async function getPopularMovies() {
  const { results } = await fetchApiData('movie/popular');
  /* console.log(results); */
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = ` 
          <a href="movie-details.html?id=${movie.id}">
            <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">${movie.release_date}</small>
            </p>
          </div>
        `;
    document.querySelector('#popular-movies').appendChild(div);
  });
}

async function getPopularTvShows() {
  const { results } = await fetchApiData('tv/popular');
  console.log(results);

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `<div class="card">
          <a href="tv-details.html?id=${show.id}">
            <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">${show.first_air_date}</small>
            </p>
          </div>
        </div>`;

    document.getElementById('popular-shows').appendChild(div);
  });
}

async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  console.log(movieId);

  const movie = await fetchApiData(`movie/${movieId}`);
  const div = document.createElement('div');
  div.innerHTML = `   <div class="details-top">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
                  ${movie.vote_average}  / 10
            </p>
            <p class="text-muted">${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href=${
              movie.homepage
            } target="_blank" class="btn">Visit Movie Homepage </a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${
              movie.budget
            }$</li>
            <li><span class="text-secondary">Revenue:</span>${
              movie.revenue
            }$</li>
            <li><span class="text-secondary">Runtime:</span>${
              movie.runtime
            } minutes</span> </li>
            <li><span class="text-secondary">Status:</span>${
              movie.status
            }</span></li>
          </ul>
          <h4>Production Companies</h4>
          <div class=${movie.production_companies
            .map((company) => `<li>${company.name}`)
            .join('')}</div>
        </div>`;

  document.getElementById('movie-details').appendChild(div);
}

async function displayTvShowDetails() {
  const showId = window.location.search.split('=')[1];
  console.log(showId);
  const show = await fetchApiData(`tv/${showId}`);
  console.log(show);

  const div = document.createElement('div');

  div.innerHTML = `<div class="details-top">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="Show Name"
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average} / 10
            </p>
            <p class="text-muted">Release Date:${show.first_air_date} </p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${show.genres.map((genre) => `<li>${genre.name}<li>`).join('')}
            </ul>
            <a href="#" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies
            .map((company) => `<li>${company.name}<li/>`)
            .join('')}</div>
        </div>`;
  document.getElementById('show-details').appendChild(div);
}

async function fetchApiData(endpoint) {
  showSpinner();
  try {
    const response = await fetch(
      `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );
    if (!response.ok) {
      throw new Error(`HTTP error ! status:${response.status}`);
    }
    const data = await response.json();
    hideSpinner();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data', error);
  }
}

// Init App
function init() {
  if (global.currentPage === '/' || global.currentPage === '/index.html') {
    getPopularMovies();
  } else if (global.currentPage === '/shows.html') {
    getPopularTvShows();
  } else if (global.currentPage === '/movie-details.html') {
    displayMovieDetails();
  } else if (global.currentPage === '/tv-details.html') {
    displayTvShowDetails();
  } else if (global.currentPage === '/search.html') {
    console.log('Search');
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
