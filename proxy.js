var request = require('request'), 
    cheerio = require('cheerio'),
    fs = require('fs'),
    puppeteer = require('puppeteer');

var url = 'https://free-proxy-list.net';

request(url, function(err, res, html) {

console.log('[X] ------> INICIANDO <------ [X]')

if(!err && res.statusCode === 200) {

    var $ = cheerio.load(html);
    var elite_proxy = [];

    $('#proxylisttable tbody tr').each(function() {
        var verificarEliteProxy = $(this).find('td').eq(4).text();
        if(verificarEliteProxy === 'elite proxy') {
            var ipAddress = $(this).find('td').eq(0).text().trim();
            var portaIp = $(this).find('td').eq(1).text().trim();
            elite_proxy.push({ip:ipAddress,porta:portaIp})
        }
    })
    
    const randomProxy = elite_proxy[Math.floor(Math.random() * elite_proxy.length)];
    
    (async () => {
        const browser = await puppeteer.launch(
            {
                //Headless TRUE nao mostra o browser por padrao vem true
                headless: false, 
                //depois pegar as proxies com um varrendo as proxies do array de proxies e ir verificando se o status ok 200
                args: [`--proxy-server=${randomProxy.ip}:${randomProxy.porta}`]
            });
        const page = await browser.newPage();
        await page.goto('https://www.myip.com');
        await page.screenshot({ path: 'example.png' });
        await browser.close();
    })();

    ///////////// Salvar as proxies em um arquivo JSON se quiser no caso
    fs.writeFile('proxy.json', JSON.stringify(elite_proxy, null, 4), function(err) {
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