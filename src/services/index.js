export default class MoveDB_API {
  static #api = "https://api.themoviedb.org/3";
  static #api_key = "afd969831ed06c467f48ec70164a65bb";

  static async #fetchData(request) {
    const data = await fetch(request);
    if (!data.ok)
      throw new Error(`Couldn’t fetch "${data.url}" (status ${data.status})`);
    return data.json();
  }

  static async getMovies(count, query = "return", page = 1) {
    if (!query) return [];
    const json = await this.#fetchData(
      `${this.#api}/search/movie?api_key=${
        this.#api_key
      }&query=${query}&page=${page}`
    );

    return [json.results.slice(0, count), json.total_pages * 10];
  }

  static async getGenres() {
    const json = await this.#fetchData(
      `${this.#api}/genre/movie/list?api_key=${this.#api_key}`
    );

    return json.genres;
  }

  static async getExtId(id) {
    return await this.#fetchData(
      `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${
        this.#api_key
      }`
    );
  }

  static async findByIds(ids, page) {
    const movies = [],
      idsTotal = ids.length;
    if (idsTotal > page * 6 - idsTotal) {
      const pageStart = (page - 1) * 6;
      ids = ids.slice(pageStart, pageStart + 6);
    }

    for (const id of ids) {
      const json = await this.#fetchData(
        `https://api.themoviedb.org/3/find/${id}?api_key=${
          this.#api_key
        }&language=en-US&external_source=imdb_id`
      );
      movies.push(json.movie_results[0]);
    }

    return [movies, Math.ceil(idsTotal / 6) * 10];
  }
}
