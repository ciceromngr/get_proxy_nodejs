var request = require('request'), 
    cheerio = require('cheerio'),
    fs = require('fs'),
    puppeteer = require('puppeteer');

var url = 'https://free-proxy-list.net';

request(url, function(err, res, html) {

console.log('[X] ------> INICIANDO <------ [X]')

if(!err && res.statusCode === 200) {

    var $ = cheerio.load(html);
    var result = {};

    var ip = [];
    var p = [];

    $('#proxylisttable tbody tr').each(function() {
        var ipAddress = $(this).find('td').eq(0).text().trim();
        var porta = $(this).find('td').eq(1).text().trim();
        ip.push(ipAddress);
        p.push(porta);
    })
    
    // Os Resultados sao sequanciais o indice é igual ip[0] contem a porta p[0]
    result.ipAddress = ip;
    result.porta = p;

    (async () => {
        const browser = await puppeteer.launch(
            {
                headless: false, 
                //depois pegar as proxies com um varrendo as proxies do array de proxies e ir verificando se o status ok 200
                args: ['--proxy-server=103.89.152.190:8080']
            });
        const page = await browser.newPage();
        await page.goto('https://www.myip.com');
        await page.screenshot({ path: 'example.png' });
        await browser.close();
    })();

    ///////////// Salvar as proxies em um arquivo JSON se quiser no caso
    fs.writeFile('proxy.json', JSON.stringify(result, null, 4), function(err) {
        if(!err) {
            console.log('Arquivo JSON Escrito com sucesso');
        } else {
            console.log(`Erro ${err}`);
        }
    })

    } else {
        console.log("Error na requisicao" + err)
    }
})