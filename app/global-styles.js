import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto Mono';
    src: url('./fonts/RobotoMono-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }
  html,
  body {
    display: grid;
    height: 100%;
    width: 100%;
    line-height: 1.5;
    color: white;
    /* white-space: pre; */

    white-space: pre-wrap;
    }

  body {
    /* font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; */
    font-family: 'Roboto Mono', monospace;
  }

  body.fontLoaded {
    /* font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; */
    font-family: 'Roboto Mono', monospace;
  }

  #app {
    background-color: rgb(14,36,57);
    min-height: 100vh;
    min-width: 100%;
  }

  p,
  label {
    /* font-family: Georgia, Times, 'Times New Roman', serif; */
    line-height: 1.5em;
  }

  * {
    transition: all .3s ease;
  }
`;

export default GlobalStyle;
