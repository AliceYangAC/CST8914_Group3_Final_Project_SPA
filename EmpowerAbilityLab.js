const views = [
  {
    route: '/',
    id: 'home',
    title: 'Home'
  },
  {
    route: '/services',
    id: 'services',
    title: 'Services'
  },
  {
    route: '/schedule',
    id: 'schedule',
    title: 'Schedule a Call'
  }
];

const resourcePrefix = window.location.hostname === 'aliceyangac.github.io'
  ? '/CST8914_Group3_Final_Project_SPA'
  : '';

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.getElementsByClassName('nav-link');
  for (const link of navLinks) {
    link.addEventListener('click', e => {
      e.preventDefault();
      history.pushState(null, '', link.href);
      renderView();
    });
  }

  renderView();
});

// render the previous view when the user presses the back button
window.addEventListener('popstate', renderView);

// checks the path to update the title and render the correct view
function renderView() {
  const path = window.location.pathname;

  // render view based on path
  for (const view of views) {
    if (resourcePrefix + view.route === path) {
      // display the view
      document.getElementById(view.id).style.display = 'block';

      // update the title
      document.title = `${view.title} – Empower Ability Labs`;

      // set the nav link as active
      document.querySelector(`.nav-link[href=".${view.route}"]`)
        .parentElement.classList.add('active');

      // focus the header
      document.querySelector(`#${view.id} h1`).focus();
    } else {
      // hide the view if it isn't the one selected
      document.getElementById(view.id).style.display = 'none';

      // set the nav link as inactive
      document.querySelector(`.nav-link[href=".${view.route}"]`)
        .parentElement.classList.remove('active');
    }
  }
}

