/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectCurrentString = () =>
  createSelector(
    selectHome,
    homeState => homeState.currentString,
  );

const makeSelectTargetString = () =>
  createSelector(
    selectHome,
    homeState => homeState.targetString,
  );
const makeSelectIsSimulationRunning = () =>
  createSelector(
    selectHome,
    homeState => homeState.isSimulationRunning,
  );
const makeSelectCurrentStyle = () =>
  createSelector(
    selectHome,
    homeState => homeState.style,
  );
const makeSelectCurrentIndividual = () =>
  createSelector(
    selectHome,
    homeState => homeState.individual,
  );
export { selectHome, makeSelectCurrentString, makeSelectTargetString, makeSelectIsSimulationRunning, makeSelectCurrentStyle, makeSelectCurrentIndividual };
