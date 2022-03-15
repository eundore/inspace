import MainView from "../views/MainView.js";
import LoginView from "../views/LoginView.js";
import SignupView from "../views/SignupView.js";
import TicketView from "../views/TicketView.js";
import FindView from "../views/FindView.js";
import SelectView from "../views/SelectView.js";
import PayCheckView from "../views/PayCheckView.js";

const routes = [
  { path: "/", view: new LoginView() },
  { path: "/signup", view: new SignupView() },
  { path: "/find", view: new FindView() },
  { path: "/select", view: new SelectView() },
  { path: "/main", view: new MainView() },
  { path: "/ticket", view: new TicketView() },
  { path: "/paycheck", view: new PayCheckView() },
];

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );
  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  let match = {
    route: routes.find((route) => route.path === location.pathname),
    result: location.pathname.match(pathToRegex(location.pathname)),
  };

  if (
    !match ||
    (localStorage.getItem("token") === null &&
      match.route.path !== "/signup" &&
      match.route.path !== "/find")
  ) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }
  const view = match.route.view;
  await view.getHtml().then((content) => {
    document.querySelector("#root").innerHTML = content;
    view.defaultFunc();
  });
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.parentElement.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.parentElement.href);
    }
  });
  router();
});
