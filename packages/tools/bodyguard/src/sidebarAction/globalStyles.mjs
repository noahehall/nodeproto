// @flow

import { css } from '@emotion/react';

import type { ComponentType } from '../libdefs';

export const globalStyles: ComponentType<any> = css`
  :disabled {
    cursor: not-allowed !important;
  }

  :checked {
    background-color: green !important;
  }

  [type=checkbox] {
    background-color: maroon;
  }

  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    box-sizing: border-box;
  }


  body {
    height: 90%;
    font: caption;
    background-color: #F4F7F8;

    * {
      color: inherit;
      background-color: unset;
      font: inherit;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  button, label {
    text-transform:uppercase;
  }

  button, [type=checkbox] {
    text-align: center;
    border: 0.5px solid #6272a4;
    outline: none;
  }

  button, label.checkbox, [type=checkbox] {
    cursor: pointer;
  }

  code {
    height: 400px;
    background: gray;
    margin: 15px;

    &.log {
      transition: background-color .2s ease-out;
    }
  }

  form {
    padding: 10px;
  }

  label, fieldset {
    display: grid;
    align-items: center;
    grid-gap: 0.5rem;
    /* single column shrinks to minimum of 240px */
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  label {
    &.text {
      cursor: text;
    }

    &.checkbox {
      cursor: pointer;
      /* 2 columns: first second */
      grid-template-columns: 1.5rem 1fr;
    }
  }

  .filter-rule-group {
    display: grid;
    grid-template-columns: 1fr;
  }

  .group.flex {
    display: flex;
    justify-content: center;
  }

  .panel-section-footer {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex-direction: row;

    button {
      flex: 1;
    }
  }

  #bodyguard-debug {
    overflow: scroll;
    white-space: pre-wrap;
  }
`;
