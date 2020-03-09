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
        // const spawn = require("child_process").spawn;
        const getUserScript = spawn('py',["./app/Python/search_user.py", query])

        getUserScript.stdout.on('data', (data) => {
            console.log(data.toString('utf8'))
        })
        getUserScript.stderr.on('data', (data) => {
        console.log(`error:${data}`);
        })
        getUserScript.on('close', () => {
        console.log("Closed");
        })

        console.log("done")
        return null
      }
}   

module.exports = InstapingController
