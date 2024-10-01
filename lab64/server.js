const http = require('http'); // Módulo para criar o servidor HTTP
const fs = require('fs').promises; // Módulo para manipulação de arquivos com Promises
const path = require('path'); // Módulo para trabalhar com caminhos de arquivos

const PORT = 3000; // Porta do servidor

// Função para lidar com requisições
const requestHandler = async (req, res) => {
    try {
        // Página inicial
        if (req.method === 'GET' && req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Bem-vindo</title>
                </head>
                <body>
                    <h1>Bem-vindo ao Servidor!</h1>
                    <p>Você está acessando um servidor dedicado ao upload de arquivos.</p>
                    <a href="/sobre">Informações</a><br>
                    <a href="/upload">Carregar Arquivo</a>
                </body>
                </html>
            `);
        } 
        // Rota Sobre
        else if (req.method === 'GET' && req.url === '/sobre') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Informações do Projeto</title>
                </head>
                <body>
                    <h1>Sobre Este Projeto</h1>
                    <p>Aqui você encontrará detalhes sobre como este servidor funciona.</p>
                    <a href="/">Retornar à Página Inicial</a>
                </body>
                </html>
            `);
        } 
        // Rota para enviar arquivo (formulário)
        else if (req.method === 'GET' && req.url === '/upload') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Carregar um Arquivo</title>
                </head>
                <body>
                    <h1>Carregar um Arquivo</h1>
                    <form action="/upload" method="POST" enctype="multipart/form-data">
                        <input type="file" name="file" required />
                        <button type="submit">Enviar Arquivo</button>
                    </form>
                    <a href="/">Retornar à Página Inicial</a>
                </body>
                </html>
            `);
        } 
        // Rota de upload de arquivos (POST)
        else if (req.method === 'POST' && req.url === '/upload') {
            let body = '';

            // Coletar dados da requisição
            req.on('data', chunk => {
                body += chunk.toString(); // Adiciona dados recebidos
            });

            req.on('end', async () => {
                const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
                const parts = body.split('--' + boundary).slice(1, -1);

                for (let part of parts) {
                    const contentDisposition = part.match(/Content-Disposition: form-data; name="([^"]+)"; filename="([^"]+)"/);
                    if (contentDisposition) {
                        const filename = contentDisposition[2];
                        const fileData = part.split('\r\n\r\n')[1].slice(0, -4); // Remove delimitadores

                        const uploadsDir = path.join(__dirname, 'uploads');
                        // Verifica se a pasta existe, se não, cria
                        if (!await fs.stat(uploadsDir).catch(() => false)) {
                            await fs.mkdir(uploadsDir);
                        }

                        await fs.writeFile(path.join(uploadsDir, filename), fileData, 'binary'); // Salva o arquivo

                        // Resposta de sucesso
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(`
                            <!DOCTYPE html>
                            <html lang="pt-BR">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Upload Completo</title>
                            </head>
                            <body>
                                <h1>Upload Realizado com Sucesso!</h1>
                                <p>Você enviou o arquivo: ${filename}</p>
                                <a href="/">Retornar à Página Inicial</a>
                            </body>
                            </html>
                        `);
                        return;
                    }
                }
                // Se nenhum arquivo foi encontrado
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Erro no Upload</title>
                    </head>
                    <body>
                        <h1>Ocorreu um Erro!</h1>
                        <p>Nenhum arquivo encontrado para upload.</p>
                        <a href="/upload">Tente Novamente</a>
                    </body>
                    </html>
                `);
            });
        } 
        // Rota 404 para páginas não encontradas
        else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Página Não Encontrada</h1>');
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Erro no Servidor</h1>');
    }
};

// Criação do servidor
const server = http.createServer(requestHandler);

// Iniciando o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
