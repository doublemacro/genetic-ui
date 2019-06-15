/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  display: grid;
  /* max-width: calc(768px + 16px * 2); */
  margin: 0 auto;
  min-height: 100vh;
  padding: 0 16px;

  /* css grid */
  grid-template-columns: 200px 1fr 150px;
  grid-template-rows: min-content 1fr min-content;

`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - home"
        defaultTitle="genetic algorithm hello world"
      >
        <meta name="description" content="a genetic hello world application" />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <Footer />
      <GlobalStyle />
    </AppWrapper>
  );
}
