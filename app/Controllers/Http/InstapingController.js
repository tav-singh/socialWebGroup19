'use strict'
const spawn = require('await-spawn')
const bayes = require('classificator')
const fs = require('fs').promises;


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
            var path = require('path');
            var appDir = path.dirname(require.main.filename);
            var username = params.username

            console.log("loading classifier")
            var savedClassifier = require(appDir + '/public/classifier_amazon_xs.json');

            console.log("getting feed")
            const result = await spawn('py',["./app/Python/get_feed_web.py", params.user_id])

            console.log("getting tokenizer")
            const resTokenizer = await spawn('py',["./app/Python/nlp.py", appDir + "\\public\\feed.json"])
            let tokened = JSON.parse(resTokenizer.toString('utf8'))

            console.log("classifying")
            let classifier = bayes.fromJson(savedClassifier)

            let classResults = []
            await fs.writeFile(appDir + '/public/analysis/' + username + '_result.json', JSON.stringify(classResults), 'utf8')

            let post_count = 0
            let cat_count = {}
            for (let token of tokened) {
                let tempArr = []
                let com_count = 0
                for (let comment of token.comments) {
                    let clas = classifier.categorize(comment);

                    tempArr.push({
                        text: comment,
                        category: clas.predictedCategory
                    })

                    if (cat_count[clas.predictedCategory])
                        cat_count[clas.predictedCategory] = cat_count[clas.predictedCategory] + 1
                    else 
                        cat_count[clas.predictedCategory] = 1

                    process.stdout.write("Classifying " + (com_count + 1) + " out of " + token.comments.length + " | " + (post_count + 1) + "/" + tokened.length + " \r");
                    com_count++
                }
                post_count++
                classResults.push(tempArr)
                await fs.writeFile(appDir + '/public/analysis/' + username + '_result.json', JSON.stringify(classResults), 'utf8')
                await fs.writeFile(appDir + '/public/analysis/' + username + '_count.json', JSON.stringify(cat_count), 'utf8')
            }
            
            // let temp = []
            // let tempj = {}
            // for (let posts of classResults) {
            //     for (let item of posts) {
            //         if (item.category == "Clothing, Shoes & Jewelry") {
            //             if (!temp.includes(item.text)) {
            //                 temp.push(item.text)
            //                 tempj[item.text] = 1
            //             } else {
            //                 tempj[item.text] = tempj[item.text] + 1
            //             }
            //         }
            //     }
            // }

            // await fs.writeFile(appDir + '/public/analysis/temp.json', JSON.stringify(tempj), 'utf8')
            // await fs.writeFile(appDir + '/public/analysis/temp_arr.json', JSON.stringify(temp), 'utf8')

            let retval = {
                query: params.user_id,
                // data: tokened
                data: cat_count,
                // data: JSON.parse(result.toString('utf8'))
            }
            return view.render("sandbox_analysis", retval)
        } catch (e) {
            console.log(e)
            let err = e.stderr.toString()
            console.log(err)
            console.error("Error while getting search results")
            // console.error(e)
            return "error: " + err
        }
      }
}   

module.exports = InstapingController
