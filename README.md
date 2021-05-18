#
    require('request') precisa ser instaldo o pacote dele npm i request
    require('cheerio') precisa ser instaldo o pacote dele npm i cheerio  
    require('fs') fs ja e do proprio node
    require('puppeteer') precisa ser instaldo o pacote dele npm i pupperteer

    ou npm install request cheerio pupperteer 
    -----------------------------------------------------------------------------------------------------------------
    Variavel que contem a URL das Proxies Gratuitas
    url = 'https://free-proxy-list.net';
    -----------------------------------------------------------------------------------------------------------------
    Fazendo Requisicao na Url, e contem uma funcao de callback que contem tres paramentros
    err: Erro, res: resposta e html: DOM.
    request(url, function(err, res, html) {
    -----------------------------------------------------------------------------------------------------------------    
    Aqui so para especificar que esta iniciando    
    console.log('[X] ------> INICIANDO <------ [X]')
    -----------------------------------------------------------------------------------------------------------------
    Verificar se a algum error e se o status da resposta é 200
    if(!err && res.statusCode === 200) {
    -----------------------------------------------------------------------------------------------------------------
        // Carregar o contente da DOM
        var $ = cheerio.load(html);
    -----------------------------------------------------------------------------------------------------------------
        // Variavel para armazenar as proxies
        var elite_proxy = [];
    -----------------------------------------------------------------------------------------------------------------
        // Verificar onde esta a tabela
        $('#proxylisttable tbody tr').each(function() {
    -----------------------------------------------------------------------------------------------------------------
            // No meu caso , essa td me retorna um string de anonimato da proxy: elite proxy ou anonimato
            var verificarEliteProxy = $(this).find('td').eq(4).text();
    -----------------------------------------------------------------------------------------------------------------       
            // So pego as proxies sem anonimato
            if(verificarEliteProxy === 'elite proxy') {
                var ipAddress = $(this).find('td').eq(0).text().trim();
                var portaIp = $(this).find('td').eq(1).text().trim();
                elite_proxy.push({ip:ipAddress,porta:portaIp})
            }
        })
    -----------------------------------------------------------------------------------------------------------------
        // Pega uma proxy randomicamente ou aleatoria para inserirmos na --proxy-server do nosso browser
        const randomProxy = elite_proxy[Math.floor(Math.random() * elite_proxy.length)];
    -----------------------------------------------------------------------------------------------------------------    
        (async () => {
            // Aqui eu crio meu browser do um argumento para ele no meu caso proxy-server, e deixo o headless como false
            // para ter uma melhor visualizacao 
            const browser = await puppeteer.launch(
                {
                    //Headless TRUE nao mostra o browser por padrao vem true
                    headless: false, 
                    //depois pegar as proxies com um varrendo as proxies do array de proxies e ir verificando se o status ok 200
                    args: [`--proxy-server=${randomProxy.ip}:${randomProxy.porta}`]
                });
    -----------------------------------------------------------------------------------------------------------------
            // Criando uma nova Pagina
            const page = await browser.newPage();
    -----------------------------------------------------------------------------------------------------------------
            // Indo para o site myip
            await page.goto('https://www.myip.com');
    -----------------------------------------------------------------------------------------------------------------
            // Aqui tira uma screenshot
            await page.screenshot({ path: 'example.png' });
    -----------------------------------------------------------------------------------------------------------------
            // Fecha o Browser
            await browser.close();
        })();
    -----------------------------------------------------------------------------------------------------------------
        Salvar as proxies em um arquivo JSON se quiser no caso
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
#