'use strict'
const spawn = require('await-spawn')

class InstapingController {

    async search ({request, response, view}) {
        let query = request.only(['query']).query
        console.log(query)

        try {
            const result = await spawn('py',["./app/Python/search_user.py", query])
            let retval = {
                query: query,
                data: JSON.parse(result.toString('utf8'))
            }
            return view.render("sandbox", retval)
        } catch (e) {
            console.log(e)
            let err = e.stderr.toString()
            console.error("Error while getting search results")
            // console.error(e)
            return "error: " + err
        }
    }

    async analyze ({request, response, params, view}) {

        // check if exists in db here
        // call nlp functions

        try {

            const result = await spawn('py',["./app/Python/get_feed_web.py", params.user_id])
            let retval = {
                query: params.user_id,
                data: JSON.parse(result.toString('utf8'))
            }
            return view.render("sandbox_analysis", retval)
        } catch (e) {
            console.log(e)
            let err = e.stderr.toString()
            console.error("Error while getting search results")
            // console.error(e)
            return "error: " + err
        }
      }
}   

module.exports = InstapingController
