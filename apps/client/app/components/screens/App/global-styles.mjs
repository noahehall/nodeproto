'use strict';
/*
  good links
  https://www.rapidtables.com/web/css/css-color.html
  https://colorhunt.co/
  https://freebiesbug.com/
  */

import { createGlobalStyle } from 'styled-components';

/* quickies
  rem - root container fontsize
  em - parent container fontsize
  NEVER add vw to anything unless you want to hunt for a mysterious margin
  NEVER use vw to any dimension when a % would suffice
    or you need to account for the width of the scrollbar
  need to think through when to use REM vs VH vs VW`;
  remember MARGIN lets clickrhrough to background elements, padding CANNOT click through
  in order for a child flexbox to be scrollable, all parents have to be flex

*/
// need to convert html entities before usingn in content; '';
// http://www.evotech.net/blog/2007/08/css-javascript-character-entities/
// https://www.w3schools.com/charsets/ref_utf_dingbats.asp
// https://dev.w3.org/html5/html-author/charref
// https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references
export default createGlobalStyle`
  // vars
    :root {
      /* everything relative to these sizes!*/
      /* --fontsize-normal: 32px;
      --spacing-normal: 1.15rem;
      --lineheight-normal: 1.5rem;
      --lineheight-big: 2rem; */

      /* --fontsize-big: calc(1.5 * var(--fontsize-normal));
      --fontsize-bigger: calc(1.8 * var(--fontsize-normal));
      --fontsize-biggest: calc(2.1 * var(--fontsize-normal));
      --fontsize-small: calc(.7 * var(--fontsize-normal));
      --fontsize-smaller: calc(.5 * var(--fontsize-normal));
      --fontsize-smallest: calc(.3 * var(--fontsize-normal));

      --button-big: 2rem;
      --button-small: 0.5rem;
      --button-normal: 1rem;

      --spacing-big: calc(2 * var(--spacing-normal));
      --spacing-bigger: calc(2.5 * var(--spacing-normal));
      --spacing-biggest: calc(3 * var(--spacing-normal));
      --spacing-huge: calc(3.5 * var(--spacing-normal));
      --spacing-small: calc(0.8 * var(--spacing-normal));
      --spacing-smaller: calc(0.6 * var(--spacing-normal));
      --spacing-tiniest: calc(0.2 * var(--spacing-normal));
      --spacing-tiny: calc(0.4 * var(--spacing-normal));
      --spacing-records: 75vh; */


      /* zindex layers */
      --layer-1: 1;
      --layer-2: 200;
      --layer-3: 3000;
      --layer-4: 40000;
      --layer-5: 500000;
      --layer-6: 6000000;



      --color-bg-default: black;
      --color-default: antiquewhite;
      --color-black: black;
      --color-blue: #3273dc;
      --color-gold-normal: darkgoldenrod;
      --color-gold-yellow: #ffdd57;
      --color-gold-white: #dbdbdb;
      --color-green-vibrant: GreenYellow;
      --color-green: #48c774;
      --color-green-lime: lime;
      --color-grey-dark2: #363636;
      --color-grey-dark3: darkslategray;
      --color-grey-dark: #373a47;
      --color-grey-blue: slategrey;
      --color-grey-light: lightslategrey;
      --color-hover: #a90000;
      --color-pink-vibrant: DeepPink;
      --color-purple-vibrant: #5755d9;
      --color-red-dark:  #a90000;
      --color-red-pink: #f14668;
      --color-teal: #00d1b2;
      --color-white-dark: #bdc3c7;
      --color-white1: antiquewhite;
      --color-white2: MintCream;
      --color-white-peach: peachpuff;
    }

    @media (max-width: 700px) {
      :root {
        /* --flexflow-column: row nowrap;
        --flexflow-row: column nowrap;
        --fontsize-normal: 12px;
        --justity-content-column: space-between; */
      }
    }

    @media (min-width: 701px) {
      :root {
        /* --fontsize-normal: 16px; */
      }
    }

    @media (min-width: 1300px) {
      :root {

      }
    }

  // hierarchy
    html {
      /* font-size: var(--fontsize-normal); */
      font-family: Fabriga, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      color: var(--color-default);

      /* defaults */
        * {
          color: inherit;
          background-color: var(--color-bg-default);
        }

        small {
          display: block;
          font-size: var(--fontsize-small);
          font-style: italic;
          text-align: center;
        }


        img {
          width: 100%;
        }

        form, .form {
        }

        .button-group {
        }

        a, button, .button {
          background-color: transparent;
          border-color: transparent;

          span {
            background-color: transparent;
            text-transform: uppercase;
          }
          &:hover {
            color: var(--color-hover);
          }

          svg {
            width: inherit;
            height: inherit;
            background-color: transparent;
          }
          svg + span {
          }
        }


        button, input, select, label {
          color: var(--color-blue);
          cursor: pointer;

          &[type="checkbox"] {
            cursor: pointer;
          }
        }


        button, .button {
          span {
            color: var(--color-black);
          }
        }

        input {
          background-color: var(--color-bg-default);
          color: var(--color-white2);
          padding-left: var(--spacing-smaller);
        }

        input, textarea, .input, .textarea {
          cursor: text;
        }

        label + input,
        .control, .chip > input,
        textarea {
          border: none;
          border-left: var(--left-border-input);
          padding-left: var(--spacing-smaller);
        }


        [disabled] {
          cursor: not-allowed !important;
          color: var(--color-grey-dark3) !important;
        }

        input:disabled {
          background-color: transparent !important;
        }

        .icon {
          align-items: center;
          display: inline-flex;
          justify-content: center;

          * {
            text-transform: uppercase;
          }
        }

        .button {
          cursor: pointer;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
        }

        .is-success {
          border-color: transparent;
          background-color: var(--color-green-vibrant);
          color: var(--color-black);
        }

        .is-success:hover {
          background-color: var(--color-green);
        }

        .is-success:focus {

        }

        .is-success:focus:not(:active) {
          box-shadow: 0 0 0 0.125em rgba(72, 199, 116, 0.25);
        }

        .is-success:active {
          background-color: var(--color-green-lime);
        }

        .is-success[disabled] {
          background-color: var(--color-green);

        }

        .is-link {
          background-color: var(--color-blue);
        }

        .title {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
        }

        .label, .button, .input, .textarea, .select, .select select {
          padding-bottom: initial;
          padding-top: initial;
          resize: none;
          width: 100%;

          &.checkbox {
            display: flex;
            flex-flow: row-reverse nowrap;
            align-items: center;
            justify-content: flex-end;
          }

          input[type=checkbox], input[type=radio] {
            width: 2rem !important;
          }
        }

        .select {
          width: inherit;

          &::after {
            top: 0.8rem !important;
          }
        }

        label.label {
          border: none;
          display: inline;
          text-align: left;
          padding: 0;
          margin: 0 !important;
          position: relative;
          top: 0.2rem;
          text-shadow: var(--color-green-vibrant) 1px 0px 3rem;
          z-index:1000;

          &.button {
            text-align: center;
          }
        }

        .field {
          display: flex;
          flex-flow: wrap column;
          align-items: stretch;
          overflow: visible;


          select,
          input {
            &:only-child {
              width: inherit;
              /*padding: calc(0.5em - 1px) calc(0.75em - 1px);*/
            }
          }

          & > textarea {
            height: fit-content;
            white-space: pre-wrap;
          }
          & > .chip {
            /*align-self: center;*/
            height: auto;
            padding: 5px;
            border-radius: 1rem;
          }
        } /*field*/

        .form-actions {
          align-items: center;
          align-self: center;
          display: flex;
          flex-flow: row wrap;

          button {
            text-transform: uppercase;
          }
        }

      body {
        overflow: visible;

        .hide {
          display: none !important;
        }

        .show {
          display: block;
        }

        .record:nth-child(even) {
          background-color: var(--color-grey-dark2);

          span {
            background-color: inherit;
          }
        }

        .chip:nth-child(odd) {
          input {
            background-color: var(--color-grey-dark2) !important;
          }
        }

        #root {
          #outer-container {
            #inner-container {
              #app-wrapper {
                .off {
                  * {
                    color: var(--color-red-dark);
                  }
                }
                .on {
                  * {
                    color: var(--color-green-vibrant);
                  }
                }
              }/* #app-wrapper */
            }
          } /* #outer-container */
        } /* #app */
      } /*body*/
    } /* html */

  @keyframes gradientBG {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
  }



  /********************
   * OVERRIDES
   *******************/
`
