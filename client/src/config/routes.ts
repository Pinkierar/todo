import {RouteBase} from '#includes/RouteBase';

export enum Route {
  Home = 1,

  SignUp,
  SignIn,
  SignOut,

  Tasks,
  Task,

  About,

  NotFound,
}

export const routes = {
  [Route.Home]: new RouteBase('/'),

  [Route.SignUp]: new RouteBase('/sign-up'),
  [Route.SignIn]: new RouteBase('/sign-in'),
  [Route.SignOut]: new RouteBase('/sign-out'),

  [Route.Tasks]: new RouteBase('/tasks'),
  [Route.Task]: new RouteBase('/tasks/:id', ['id']),

  [Route.About]: new RouteBase('/about'),

  [Route.NotFound]: new RouteBase('/*'),
} as const satisfies {[route in Route]: RouteBase<string, any>};