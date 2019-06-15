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
import { startSimulation, stopSimulation, updateCurrentString } from './actions';
import { makeSelectCurrentString, makeSelectTargetString, makeSelectIsSimulationRunning } from './selectors';
import reducer from './reducer';
import saga from './saga';

import styled from 'styled-components';

import { Simulator } from 'utils/simulator';

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

const Nav = styled.nav`
  /* this tells parent where to place this nav */
  grid-row: 2;
  grid-column: 1 / 2;
  padding: 0 10px;

  /* this tells nav how to display children */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
const Aside = styled.aside`
  grid-row: 2;
  grid-column: 3 / 4;
  padding: 0 10px;
  justify-self: right;
`;

const AsideItem = styled.div`
  display: none;
`;

const NavItem = styled.a`
  display: block;
  margin: 0 auto;
  display: none;
`;

const MainItem = styled.div`
  display: block;
  margin: 0 auto;

  /* border: 1px dotted red; */
`;

const CurrentString = styled.div`
  margin: 0 auto;

  padding-bottom: 10px;
  /* border: 6px groove white; */
`;
const TargetString = styled.div`
  margin: 0 auto;

  padding-bottom: 10px;
  /* border: 6px groove white; */
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
  display: flex;
  align-items: flex-end;
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

var simulator = null;

const onStartButtonPress = function (callback, target, onStartSimulation, onStopSimulation) {
  if (simulator === null) {
    simulator = new Simulator(50, callback, target);
  }
  if (simulator.isRunning()) {
    simulator.stopSimulation();
    onStopSimulation();
  } else {
    simulator.startSimulation();
    onStartSimulation();
  }
}

function buildSimResultCallback(onUpdateCurrentString, onStopSimulation) {
  return function (currentStr, finished) {
    onUpdateCurrentString(currentStr);
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
  onUpdateCurrentString,
  currentString,
  targetString,
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

      <Nav>
        <NavItem>
          nav one
        </NavItem>
        <NavItem>
          nav two
        </NavItem>
        <NavItem>
          nav three
        </NavItem>
      </Nav>

      <Main>
        <MainItem>
          <FlexEndContainer>
            <StartButton onClick={() => {
              onStartButtonPress(buildSimResultCallback(onUpdateCurrentString, onStopSimulation), targetString, onStartSimulation, onStopSimulation);
            }}>{isSimulationRunning ? 'STOP' : 'START'}</StartButton>
          </FlexEndContainer>
        </MainItem>
        <MainItem>
          <CenterContainer>
            <CurrentString>{currentString}</CurrentString>
            <TargetString>{targetString}</TargetString>
          </CenterContainer>
        </MainItem>
        <MainItem></MainItem>
      </Main>
      <Aside>
        <AsideItem>
          aside one
        </AsideItem>
        <AsideItem>
          aside two
        </AsideItem>
      </Aside>
    </Wrapper>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onStartSimulation: PropTypes.func,
  onStopSimulation: PropTypes.func,
  onUpdateCurrentString: PropTypes.func,
  currentString: PropTypes.string,
  targetString: PropTypes.string,
  isSimulationRunning: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentString: makeSelectCurrentString(),
  targetString: makeSelectTargetString(),
  isSimulationRunning: makeSelectIsSimulationRunning(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onStartSimulation: evt => dispatch(startSimulation()),
    onStopSimulation: evt => dispatch(stopSimulation()),
    onUpdateCurrentString: val => dispatch(updateCurrentString(val)),
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
