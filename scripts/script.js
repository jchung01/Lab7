// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too

document.addEventListener('DOMContentLoaded', () => {
  let state = 'main';
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
      });
      const journal = document.querySelectorAll('journal-entry');
      // open single journal entry
      journal.forEach((entry, index) => {
        entry.addEventListener('click', () => {
          // console.log('clicked entry ' + index);
          setState('entry-page', true, entry, index);
        });
      });
    });
  const settings = document.querySelector('header img');
  const header = document.querySelector('header h1');
  
  // add back/forward button functionality
  window.addEventListener('popstate', (poppedState) => {
    // console.log(poppedState);
    if(poppedState.state == null) {
      setState('main', false);
    }
    else if(poppedState.state.currState == 'entry-page') {
      const entryCopy = document.createElement('journal-entry');
      entryCopy.entry = poppedState.state.entry;
      setState(poppedState.state.currState, false, entryCopy, poppedState.state.entryNum);
    }
    else {
      setState(poppedState.state.currState, false);
    }
  });
  // switch to settings or main on click
  settings.addEventListener('click', () => {
    state = router.state;
    // console.log('state: ', state);
    if(state == 'settings') {
      setState('main');
    }
    else {
      setState('settings');
    }
  });
  // go back to home page
  header.addEventListener('click', () => setState('main'));
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // /Lab7/sw.js
    navigator.serviceWorker.register('/Lab7/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}