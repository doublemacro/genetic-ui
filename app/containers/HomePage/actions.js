/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { START_SIMULATION, STOP_SIMULATION, UPDATE_CURRENT_STRING } from './constants';

/**
 * Starts the simulation
 *
 */
export function startSimulation() {
  return {
    type: START_SIMULATION,
  };
}

/**
 * Stops the simulation
 *
 */
export function stopSimulation() {
  return {
    type: STOP_SIMULATION,
  };
}

/**
 * updates current string from highest fitness individual
 *
 */
export function updateCurrentString(value) {
  return {
    type: UPDATE_CURRENT_STRING,
    value
  };
}