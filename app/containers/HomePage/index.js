/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import messages from './messages';
import { startSimulation, stopSimulation, updateCurrentStyle } from './actions';
import { makeSelectCurrentStyle, makeSelectCurrentIndividual, makeSelectIsSimulationRunning } from './selectors';
import reducer from './reducer';
import saga from './saga';

import styled, { css } from 'styled-components';

import { Simulator } from 'utils/simulator';
import StyledUI from './StyledUi';

import Mousetrap from 'mousetrap';

const key = 'home';

const Wrapper = styled.div`
  /* this tells parent grid where to place this wrapper */
  grid-row: 2;
  grid-column: 1 / 4;

  /* this tells this wrapper where to place children */
  display: grid;
  grid-template-columns: 1fr 6fr 1fr;
  grid-template-rows: min-content 1fr min-content;

  /* border: 4px solid #1a4268; */
`;

const Main = styled.main`
  grid-row: 2;
  grid-column: 2 / 3;
  padding: 0 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  border: 4px solid #1a4268;
`;

const MainItem = styled.div`
  display: block;
  margin: 0 auto;

  /* border: 1px dotted red; */
`;

const StartButton = styled.button`
  /* display: flex; */
  /* margin: 50% auto; */
  margin-bottom: 1em;
  font-weight: 700;

  border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: 1.5px solid rgb(34, 213, 254);
  border-radius: 1.5px;

  color: white;
  background-color: #1d4c78;
  /* border: 3px solid white; */
`;

const FlexEndContainer = styled.div`
  /* tell children to stay in center of this container */
  display: grid;
  /* align-items: flex-end; */
  justify-content: center;

  margin: 0 auto;

  height: 100%;

  /* border: 6px solid green; */
`;

const CenterContainer = styled.div`
  /* tell children to stay in center of this container */

  display: grid;

  margin: 0 auto;

  height: 100%;

  /* border: 6px solid green; */
`;

// Mousetrap.bind('=', function () { onSimStep(1) });
// Mousetrap.bind('-', function () { onSimStep(0) });

Mousetrap.bind('=', function () { console.log('+') });
Mousetrap.bind('-', function () { console.log('-') });

var simulator = null;

const onStartButtonPress = function (callback, target, onStartSimulation, onStopSimulation) {
  if (simulator === null) {
    simulator = new Simulator({ interval: 1, resultCallback: callback, target: target });
  }
  if (simulator.isRunning()) {
    simulator.stopSimulation();
    onStopSimulation();
  } else {
    simulator.startSimulation();
    onStartSimulation();
  }
}

const onSimStep = function (val) {
  if (simulator !== null) {
    simulator.step(val);
  }
}

/**
 * builds a function that sim calls when a result is found.
 * calls function to update reducer of the current style
 * sends current style and a "finished" flag if an individual with top fitness is found
 * currently "finished" flag is not used
 * @param {*} onUpdateCurrentStyle 
 * @param {*} onStopSimulation 
 */
function buildSimResultCallback(onUpdateCurrentStyle, onStopSimulation) {
  return function (currentStyle, currentIndividual, finished) {
    onUpdateCurrentStyle(currentStyle, currentIndividual);
    if (finished) {
      onStopSimulation();
    }
  }
}

export function HomePage({
  loading,
  error,
  onSubmitForm,
  onStartSimulation,
  onStopSimulation,
  onUpdateCurrentStyle,
  currentStyle,
  currentIndividual,
  isSimulationRunning,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
  }, []);

  return (
    <Wrapper>
      <Helmet>
        <title>home</title>
        <meta
          name="description"
          content="genetic algorithm hello world"
        />
      </Helmet>

      <Main>
        <MainItem>
          <FlexEndContainer>
            <StartButton onClick={() => {
              onStartButtonPress(buildSimResultCallback(onUpdateCurrentStyle, onStopSimulation), null, onStartSimulation, onStopSimulation);
            }}>{isSimulationRunning ? 'STOP' : 'START'}</StartButton>
            <StartButton onClick={() => {
              onSimStep(1);
            }}>{isSimulationRunning ? 'LIKE' : 'NO PRESS'}</StartButton>
            <StartButton onClick={() => {
              onSimStep(0);
            }}>{isSimulationRunning ? 'DISLIKE' : 'NO PRESS'}</StartButton>
            <span>{currentIndividual}</span>
          </FlexEndContainer>
        </MainItem>
        <MainItem>
          <CenterContainer>
            <StyledUI style={currentStyle}></StyledUI>
          </CenterContainer>
        </MainItem>
      </Main>
    </Wrapper>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onStartSimulation: PropTypes.func,
  onStopSimulation: PropTypes.func,
  onUpdateCurrentStyle: PropTypes.func,
  currentStyle: PropTypes.object,
  currentIndividual: PropTypes.number,
  isSimulationRunning: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentStyle: makeSelectCurrentStyle(),
  currentIndividual: makeSelectCurrentIndividual(),
  isSimulationRunning: makeSelectIsSimulationRunning(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onStartSimulation: evt => dispatch(startSimulation()),
    onStopSimulation: evt => dispatch(stopSimulation()),
    onUpdateCurrentStyle: (style, individual) => dispatch(updateCurrentStyle(style, individual)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
