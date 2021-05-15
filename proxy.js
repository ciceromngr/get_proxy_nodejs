var request = require('request'), 
    cheerio = require('cheerio'),
    fs = require('fs')


var url = 'https://free-proxy-list.net'

request(url, function(err, res, html) {

    console.log('[X] ------> INICIANDO <------ [X]')

    if(!err && res.statusCode === 200) {

        var $ = cheerio.load(html)
        var result = []

        $('#proxylisttable tbody tr').each(function() {
            var ipAddress = $(this).find('td').eq(0).text().trim()
            var porta = $(this).find('td').eq(1).text().trim()

            result.push({
                ipAddress: ipAddress,
                porta: porta
            })
        fs.writeFile('proxy.json', JSON.stringify(result, null, 4), function(err) {
            if(!err) {
                console.log('Arquivo JSON Escrito com sucesso')
            } else {
                console.log(`Erro ${err}`)
            }
        })
        })

    } else {
        console.log("Error na requisicao" + err)
    }
})