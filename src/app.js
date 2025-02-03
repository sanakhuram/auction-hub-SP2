//src/app.js

import "./css/style.css";

import router from "./js/router";

import './js/setupEvents';

await router(window.location.pathname);
