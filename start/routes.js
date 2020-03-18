'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.on('/sandbox').render('sandbox')
Route.post('/sandbox', 'InstapingController.search')
Route.on('/sandbox/search').render('search_result').as('search_result')
Route.get("/sandbox/analyze/:username/:user_id", 'InstapingController.analyze').as('analysis')
