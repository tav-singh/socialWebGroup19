

(async () => {
    const spawn = require('await-spawn')
    var fs = require('fs');
    try {
        // const result = await spawn('py',["./get_feed_web.py", 1518284433])
    
        // let temp = result.toString('utf8')

        let result = await spawn('py',["./nlp.py", "./test_fs.json"])

        console.log(result.toString('utf8'))
    } catch (e) {
        console.log(e.stderr.toString())
        let err = e.stderr.toString()
        console.error("Error while getting search results")
    }
})();
