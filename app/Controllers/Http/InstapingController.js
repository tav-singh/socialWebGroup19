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
            // await fs.writeFile(appDir + '/public/analysis/' + username + '_tokenized.json', JSON.stringify(tokened), 'utf8')

            let feed_med = JSON.parse(result.toString('utf8'))
            let post_count = 0
            let cat_count = {}
            let cat_cap_count = {}
            for (let token of tokened) {
                let tempArr = []
                let tempArrCap = []
                let com_count = 0
                let temp_cat_count = {}
                let temp_cat_cap_count = {}

                for (let caption_item of token.caption) {
                    let clas = classifier.categorize(caption_item);

                    tempArrCap.push({
                        text: caption_item,
                        category: clas.predictedCategory
                    })

                    if (cat_cap_count[clas.predictedCategory]) 
                        cat_cap_count[clas.predictedCategory] = cat_cap_count[clas.predictedCategory] + 1
                    else 
                        cat_cap_count[clas.predictedCategory] = 1

                    if (temp_cat_cap_count[clas.predictedCategory]) 
                    temp_cat_cap_count[clas.predictedCategory] = temp_cat_cap_count[clas.predictedCategory] + 1
                    else 
                    temp_cat_cap_count[clas.predictedCategory] = 1
                }

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

                    if (temp_cat_count[clas.predictedCategory]) 
                    temp_cat_count[clas.predictedCategory] = temp_cat_count[clas.predictedCategory] + 1
                    else 
                    temp_cat_count[clas.predictedCategory] = 1

                    process.stdout.write("Classifying " + (com_count + 1) + " out of " + token.comments.length + " | " + (post_count + 1) + "/" + tokened.length + " \r");
                    com_count++
                }

                feed_med.media[post_count].comment_category = temp_cat_count
                feed_med.media[post_count].caption_category = temp_cat_cap_count

                post_count++
                classResults.push(tempArr)
                await fs.writeFile(appDir + '/public/analysis/' + username + '_result.json', JSON.stringify(classResults), 'utf8')
                await fs.writeFile(appDir + '/public/analysis/' + username + '_count.json', JSON.stringify(cat_count), 'utf8')
            }
            
            feed_med.comment_categories = cat_count
            feed_med.caption_categories = cat_cap_count

            let retval = {
                query: params.user_id,
                // data: tokened
                // data: cat_count,
                data: feed_med
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
