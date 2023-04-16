export default {
    name: 'TheKidsHomeComponent',

    props: ['user'],

    template: `
    <div>
    <div class="tabs">
    <div class="tabs">
    <button
      :class="{ active: activeTab === 'movies' }"
      @click="activeTab = 'movies'"
      class="tab-button movie-button"
    >
      Movies
    </button>
    <button
      :class="{ active: activeTab === 'series' }"
      @click="activeTab = 'series'"
      class="tab-button series-button"
    >
      Series
    </button>
  </div>
  </div>
  <ul class="movie-list">
  <li v-for="movie in activeTab === 'movies' ? movieList : seriesList" :key="movie.id" class="movie-card" @click="showMovieDetails(movie.id)">
    <img :src="movie.img" alt="Movie poster">
    <h2>{{ movie.name }}</h2>
  </li>
</ul>
    <div class="movie-details-popup" v-if="selectedMovie">
    <div class="movie-poster">
      <img :src="selectedMovie.poster" alt="Movie poster">
    </div>
    <div class="movie-info">
      <h2>{{ selectedMovie.title }}</h2>
      <p>{{ selectedMovie.plot }}</p>
      <ul class="movie-genres">
        <li v-for="genre in selectedMovie.genres">{{ genre }}</li>
      </ul>
    </div>
    <button class="close-button" @click="selectedMovie = null">Close</button>
  </div>



  </div>
    `,

    data() {
        return {
          activeTab: 'movies',
          movieList: [],
          seriesList: [],
          selectedMovie: null,
        };
    },

    created() {
     
        const movieApiUrl = `https://imdb-api.com/API/AdvancedSearch/k_85pgs5gt?title_type=tv_movie&release_date=1950-01-01,1990-01-01&certificates=us:G&count=100`;
        const seriesApiUrl = `https://imdb-api.com/API/AdvancedSearch/k_85pgs5gt?title_type=tv_series&release_date=1950-01-01,1990-01-01&certificates=us:G&count=100`;
      
        // Fetch movie data
        fetch(movieApiUrl)
          .then(response => response.json())
          .then(data => {
            if (data.results) {
              this.movieList = data.results.map(movie => ({
                id: movie.id,
                name: movie.title,
                img: movie.image
              }));
            } else {
              console.log('No movie results found');
            }
          })
          .catch(error => console.log(error));
      
        // Fetch series data
        fetch(seriesApiUrl)
          .then(response => response.json())
          .then(data => {
            if (data.results) {
              this.seriesList = data.results.map(series => ({
                id: series.id,
                name: series.title,
                img: series.image
              }));
            } else {
              console.log('No series results found');
            }
          })
          .catch(error => console.log(error));
      },

      methods: {
        showMovieDetails(movieId) {
          const movie = this.activeTab === 'movies' ? this.movieList.find(movie => movie.id === movieId) : this.seriesList.find(series => series.id === movieId);
          if (!movie) {
            console.log('Movie/series not found');
            return;
          }
    
          const apiUrl = `https://imdb-api.com/en/API/Title/k_85pgs5gt/${movieId}`;
          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              if (data.id) {
                this.selectedMovie = {
                  title: data.title,
                  plot: data.plot,
                  poster: data.image,
                  genres: data.genres.split(',').map(genre => genre.trim())
                };
              } else {
                console.log('No results found');
              }
            })
            .catch(error => console.log(error));
        },
        
        showSeriesDetails(seriesId) {
          const series = this.seriesList.find(series => series.id === seriesId);
          if (!series) {
            console.log('Series not found');
            return;
          }
    
          const apiUrl = `https://imdb-api.com/en/API/Title/k_85pgs5gt/${seriesId}`;
          fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
              if (data.id) {
                this.selectedSeries = {
                  title: data.title,
                  plot: data.plot,
                  poster: data.image,
                  genres: data.genres.split(',').map(genre => genre.trim())
                };
              } else {
                console.log('No results found');
              }
            })
            .catch(error => console.log(error));
        },
    
        switchTab(tab) {
          this.activeTab = tab;
        }
      }
}