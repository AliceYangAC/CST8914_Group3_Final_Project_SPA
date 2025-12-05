// array of views for the SPA
const views = [
  {
    route: "/",
    id: "home",
    title: "Home",
  },
  {
    route: "/services",
    id: "services",
    title: "Services",
  },
  {
    route: "/schedule",
    id: "schedule",
    title: "Schedule a Call",
  },
];

let currentView;

// JS that runs when page loads
document.addEventListener("DOMContentLoaded", () => {
  // restore path if page was refreshed
  const fallbackPath = sessionStorage.getItem("spa-fallback-path");
  if (fallbackPath) {
    sessionStorage.removeItem("spa-fallback-path");
    history.replaceState(null, "", fallbackPath);
  }

  // loop through nav links adding the click event handler
  const navLinks = document.getElementsByClassName("nav-link");
  for (const link of navLinks) {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // prevent the links from refreshing the page
      history.pushState(null, "", link.href); // update the history for the back button
      renderView();
      // focus the header
      document.querySelector(`#${currentView} h1`).focus();
    });
  }

  // once page has finished loading everything, render the view
  renderView();
});

// render the previous view when the user presses the back button
window.addEventListener("popstate", renderView);

// checks the path to update the title and render the correct view
function renderView() {
  // get the path from the URL
  const route = getRoute();

  // render view based on route
  for (const view of views) {
    if (view.route === route) {
      // display the view
      document.getElementById(view.id).style.display = "block";

      // update the title
      document.title = `${view.title} - Empower Ability Labs`;

      // set the nav link as active

      document
        .querySelector(`.nav-link[href=".${view.route}"]`)
        .parentElement.classList.add("active");

      currentView = view.id;
    } else {
      // hide the view if it isn't the one selected
      document.getElementById(view.id).style.display = "none";

      // set the nav link as inactive
      document
        .querySelector(`.nav-link[href=".${view.route}"]`)
        .parentElement.classList.remove("active");
    }
  }
}

// gets the route from the current url
function getRoute() {
  const path = window.location.pathname;

  // extract the SPA root by removing everything after the last /
  const root =
    path
      .replace(/index\.html$/, "")
      .split("/")
      .slice(0, -1)
      .join("/") + "/";

  // get the relative path
  let relative = path.substring(root.length);

  // handle home edge case
  if (relative === "index.html" || relative === "") return "/";

  // prepend slash to become a route
  return "/" + relative;
}

// -------------------------------
// Dialog Box (for lightbox modals and potentially alerts)
// -------------------------------

let previousActiveElement = null;

// get all keyboard focusable elements within a given element
function getKeyboardFocusableElements(element) {
  return [
    ...element.querySelectorAll(
      'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])',
    ),
  ].filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
  );
}

function openDialog(dialogId, element) {
  // save the element that triggered the dialog to return focus later
  previousActiveElement = element;

  // get the dialog and remove the hidden class
  const dialog = document.getElementById(dialogId);
  dialog.classList.remove("hidden");

  // find all focusable elements within the dialog
  const focusableElements = getKeyboardFocusableElements(dialog);

  // identify first and last focusable elements
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // focus the first focusable element
  firstElement.focus();

  // add event listener for keyboard navigation
  dialog.onkeydown = function (e) {
    if (e.key === "Escape") {
      closeDialog(dialog);
    }

    // handle tabbing within the dialog
    if (e.key === "Tab") {
      // SHIFT + TAB (Going Backwards)
      if (e.shiftKey) {
        // if on first focusable elem, loop around to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // TAB (Going Forwards)
      else {
        // if on last focusable elem, loop around to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
}

function closeDialog(element) {
  // made this reusable; maybe for alerts if you also want to use dialogs? @victor & liza
  const dialog = element.closest('[role="dialog"], [role="alertdialog"]');

  if (dialog) {
    dialog.classList.add("hidden");
    dialog.onkeydown = null;
  }

  // restore focus to main page prev element
  if (previousActiveElement) {
    previousActiveElement.focus();
  }
}

//Functionality for the switch, taken from https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:  switch-checkbox.js
 *
 *   Desc:  Switch widget using input[type=checkbox] that implements ARIA Authoring Practices
 */
("use strict");

class CheckboxSwitch {
  constructor(domNode) {
    this.switchNode = domNode;
    this.switchNode.addEventListener("focus", () => this.onFocus(event));
    this.switchNode.addEventListener("blur", () => this.onBlur(event));
  }

  onFocus(event) {
    event.currentTarget.parentNode.classList.add("focus");
  }

  onBlur(event) {
    event.currentTarget.parentNode.classList.remove("focus");
  }
}

// Initialize switches
window.addEventListener("load", function () {
  // Initialize the Switch component on all matching DOM nodes
  Array.from(
    document.querySelectorAll("input[type=checkbox][role^=switch]"),
  ).forEach((element) => new CheckboxSwitch(element));
});

//functionality for hidden textbox
const usability_testing_checkbox = document.getElementById("usability_testing");
const hidden_field_paragraph = document.getElementById("hiddenField");
usability_testing_checkbox.addEventListener("change", () => {
  if (usability_testing_checkbox.checked) {
    hidden_field_paragraph.hidden = false;
  } else {
    hidden_field_paragraph.hidden = true;
  }
});

// functionality from https://www.w3.org/WAI/ARIA/apg/patterns/alert/examples/alert/

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */

("use strict");

window.addEventListener("load", function () {
  console.log("Loaded:", document.getElementById("alert-trigger"));
  var button = document.getElementById("alert-trigger");

  button.addEventListener("click", addAlert);
});

/*
 * @function addAlert
 *
 * @desc Adds an alert to the page
 *
 * @param   {object}  event  -  Standard W3C event object
 *
 */

function addAlert() {
  var example = document.getElementById("example");
  var email_value = document.getElementById("email_entry").value;
  var template = document.getElementById("alert-template").innerHTML;
  var template2 = document.getElementById("alert-template2").innerHTML;
  if (email_value !== "") {
    example.innerHTML = template;
  } else {
    example.innerHTML = template2;
  }
}
