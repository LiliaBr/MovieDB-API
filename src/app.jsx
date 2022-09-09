import React, { Component } from 'react';
import { Tabs, Input, Row, Col, Pagination, Spin, Alert, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MovieDB_API from './services/index';
import { MovieDB_Provider } from './moviedb_context';
import MovieCard from './components/movie-card/movie-card';
import NetworkDetector from './networkDetector';
import _debounce from './_debounce';

import 'antd/dist/antd.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: true,
      exception: null,
      searchQuery: '',
      currentPage: 1,
      totalPages: 10,
      activeTab: '1'
    };
  }

  handleInputChange = (e) => {
    const query = e.target.value;
    if (!query.length || this.state.activeTab != '1') return;
    this.setState({ loading: true, searchQuery: query, currentPage: 1 });
    this.updateDB(1, query);
    console.log('handleInputChange: loading movies…');
  }

  handlePageChange = (page) => {
    this.setState({ loading: true, currentPage: page });
    if (this.state.activeTab == '1')
      this.updateDB(page);
    else
      this.showRated(page);
  }

  handleTabChange = (activeTabKey) => {
    this.setState({ loading: true, currentPage: 1, activeTab: activeTabKey });
    if (activeTabKey == '1')
      this.updateDB();
    else
      this.showRated();
  }

  updateDB(page = 1, query) {
    MovieDB_API.getMovies(6, query || this.state.searchQuery || 'return', page)
      .then(([movies, pages]) => {
        this.setState({ movies, loading: false, totalPages: pages, exception: null });
      })
      .catch(e => {
        this.setState({ loading: false, exception: e });
      });
  }

  showRated(page = 1) {
    const rated = [];
    for (let i = 0; i < localStorage.length; i++)
      if (!+localStorage.key(i)) rated.push(localStorage.key(i));

    MovieDB_API.findByIds(rated, page)
      .then(([movies, pages]) => {
        if (this.state.activeTab == '2')
          this.setState({ movies, loading: false, totalPages: pages, exception: null });
      })
      .catch(e => {
        this.setState({ loading: false, exception: e });
      });
  }

  render() {

    const cards = [], movies = this.state.movies;
    for (let i = 0, k = 1; i < movies.length; i += 2, k++) {
      cards.push(
        <Row gutter={[32, 32]} justify={'center'} align={'middle'} key={k}>
          <Col span={12}>
            <MovieDB_Provider>
              <MovieCard
                id={movies[i].id}
                poster_path={movies[i].poster_path}
                genre_ids={movies[i].genre_ids}
                release_date={movies[i].release_date ?? ''}
                title={movies[i].title}
                overview={movies[i].overview}
                vote_average={movies[i].vote_average}
              />
            </MovieDB_Provider>
          </Col>
          <Col span={12}>
            {movies[i + 1] ?
              <MovieDB_Provider>
                <MovieCard
                  id={movies[i + 1].id}
                  poster_path={movies[i + 1].poster_path}
                  genre_ids={movies[i + 1].genre_ids}
                  release_date={movies[i + 1].release_date ?? ''}
                  title={movies[i + 1].title}
                  overview={movies[i + 1].overview}
                  vote_average={movies[i + 1].vote_average}
                />
              </MovieDB_Provider>
              : null}
          </Col>
        </Row>
      );
    }

    const { loading, exception } = this.state;
    const spinner = (
      <div className='centering-container'>
        <Spin indicator={<LoadingOutlined spin />} size='large' />
      </div>
    );
    const errorMsg = (
      <Alert
        message='Error'
        description={exception?.message ?? ''}
        type='error'
        showIcon
      />
    );
    const emptyMsg = (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{ height: 65 }}
        description={<span>No movies found :&#40;</span>}
      />
    );

    const body = (
      <div className='moviedb__wrapper'>
        {loading && spinner || null}
        {!(loading || exception) && cards || null}
        {exception && errorMsg}
        {!movies.length && !loading && emptyMsg}
      </div>
    );
    const pagination = (
      <div className='centering-container'>
        <Pagination
          size='small'
          total={this.state.totalPages}
          showSizeChanger={false}
          onChange={this.handlePageChange}
          current={this.state.currentPage}
        />
      </div>
    );

    return (
      <section className='moviedb'>
        <Tabs defaultActiveKey='1' centered tabBarStyle={{ border: 'none', outline: 'none' }} onChange={this.handleTabChange}>
          <Tabs.TabPane tab='Search' key='1'>
            <Input
              placeholder='Type to search'
              onChange={_debounce(this.handleInputChange, 2000)}
            />
            {body}
            {pagination}
          </Tabs.TabPane>
          <Tabs.TabPane tab='Rated' key='2'>
            {body}
            {pagination}
          </Tabs.TabPane>
        </Tabs>
      </section>
    );
  }

  componentDidMount() {
    this.updateDB();
  }
}

export default NetworkDetector(App);
