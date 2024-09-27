const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Dados do grafo (cidades e distâncias em km)
const cidades = [
    { nome: 'RSL', x: 400, y:400},
    { nome: 'LON', x: 450, y:350},
    { nome: 'AGR', x: 350, y:430},
    { nome: 'TCO', x: 300, y:460},
    { nome: 'BTO', x: 205, y:500},
    { nome: 'PDR', x: 150, y:430},
    { nome: 'LAU', x: 340, y:400},
    { nome: 'IBR', x: 470, y:250},
    { nome: 'PGT', x: 420, y:230},
    { nome: 'AGD', x: 250, y:530},
    { nome: 'AUR', x: 410, y:460},
    { nome: 'ATL', x: 300, y:540},
    { nome: 'ITU', x: 440, y:530},
    { nome: 'VRA', x: 620, y:530},
    { nome: 'PNR', x: 600, y:440},
    { nome: 'IMB', x: 570, y:590},
    { nome: 'MDC', x: 30, y:350},
    { nome: 'TAI', x: 130, y:300},
    { nome: 'DEM', x: 350, y:170},
    { nome: 'JBT', x: 410, y:150}
];

//Matriz de custo
const distancias = [
    [0,25.6,31.9,79.64,0,0,39.9,0,121.88,0,28,0,0,0,0,0,0,0,0,0],
    [25.6,0,0,0,0,0,0,35,0,0,0,0,0,0,87.9,0,0,0,0,0],
    [31.9,0,0,23.6,0,71.94,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [79.64,0,23.6,0,43.2,54.9,0,0,0,14.1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,43.2,0,38.28,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,71.94,54.9,38.28,0,0,0,0,0,0,0,0,0,0,0,37.4,38.8,0,0],
    [39.9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,35,0,0,0,0,0,0,25.2,0,0,0,0,0,0,0,0,0,0,0],
    [121.88,0,0,0,0,0,0,25.2,0,0,0,0,0,0,0,0,0,0,33.4,32.4],
    [0,0,0,14.1,0,0,0,0,0,0,0,12.2,0,0,0,0,0,0,0,0],
    [28,0,0,0,0,0,0,0,0,0,0,0,39.9,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,12.2,0,0,43.6,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,39.9,43.6,0,63.2,0,76.5,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,63.2,,42,39.6,0,0,0,0],
    [0,87.9,0,0,0,0,0,0,0,0,0,0,0,42,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,76.5,39.6,0,0,0,0,0,0],
    [0,0,0,0,0,37.4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,38.8,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,33.4,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,32.4,0,0,0,0,0,0,0,0,0,0,0]
];

// Função para desenhar o grafo
function drawGraph() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha os nós (círculos)
    cidades.forEach(cidade => {
        ctx.beginPath();
        ctx.arc(cidade.x, cidade.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.font = '12px Arial';
        ctx.fillText(cidade.nome, cidade.x - 15, cidade.y + 20);
    });

    // Desenha as arestas (linhas)
    for (let i = 0; i < cidades.length; i++) {
        for (let j = i + 1; j < cidades.length; j++) {
            if (distancias[i][j] !== 0) {
                ctx.beginPath();
                ctx.moveTo(cidades[i].x, cidades[i].y);
                ctx.lineTo(cidades[j].x, cidades[j].y);
                ctx.stroke();
            }
        }
    }
}

// Algoritmo de Dijkstra
function dijkstra(start, end) {
    const numNodes = cidades.length;
    const visited = new Array(numNodes).fill(false);
    const distance = new Array(numNodes).fill(Infinity);
    const previous = new Array(numNodes).fill(null);    

    distance[start] = 0;

    for (let i = 0; i < numNodes - 1; i++) {
        // Encontrar o nó não visitado com menor distância
        let minDistance = Infinity;
        let minIndex = -1;
        for (let v = 0; v < numNodes; v++) {
            if (!visited[v] && distance[v] <= minDistance) {
                minDistance = distance[v];
                minIndex = v;
            }
        }

        visited[minIndex] = true;

        // Atualizar as distâncias dos vizinhos
        for (let v = 0; v < numNodes; v++) {
            if (!visited[v] && distancias[minIndex][v] !== 0 && distance[minIndex] !== Infinity &&
                distance[minIndex] + distancias[minIndex][v] < distance[v]) {
                distance[v] = distance[minIndex] + distancias[minIndex][v];
                previous[v] = minIndex;
            }
        }
    }

    // Construir o caminho mais curto
    const path = [];
    let current = end;
    path.push(current);
    while (previous[current] !== null) {
        path.push(previous[current]);
        current = previous[current];
    }
    path.reverse();


    return path;
}

// Função para encontrar o menor caminho e destacá-lo no grafo
function findShortestPath() {
    const origemNome = document.getElementById('origem').value;
    const destinoNome = document.getElementById('destino').value;    
    // Encontrar os índices das cidades pelo nome
    const origemIndex = cidades.findIndex(cidade => cidade.nome === origemNome);
    const destinoIndex = cidades.findIndex(cidade => cidade.nome === destinoNome);
    // Chamar o algoritmo de Dijkstra com os índices
    const caminho = dijkstra(origemIndex, destinoIndex);
    
    if(origemNome == destinoNome){
        alert('Os valores de origem e destino devem ser diferentes!');
        return;
    }

    ctx.strokeStyle = 'Black';
    drawGraph();

    // Desenha o caminho
    ctx.strokeStyle = 'Blue';
    ctx.lineWidth = 2;
    for (let i = 0; i < caminho.length - 1; i++) {
        const cidadeA = cidades[caminho[i]];
        const cidadeB = cidades[caminho[i + 1]];
        ctx.beginPath();
        ctx.moveTo(cidadeA.x, cidadeA.y);
        ctx.lineTo(cidadeB.x, cidadeB.y);
        ctx.stroke();
    }
    ctx.lineWidth = 1;

    let custoTotal = 0;
    for (let i = 0; i < caminho.length - 1; i++) {
        const cidadeA = caminho[i];
        const cidadeB = caminho[i + 1];
        custoTotal += distancias[cidadeA][cidadeB];
    }

    // Exibir o custo total no HTML
    custoTotal = Math.round(custoTotal);
    const custoElement = document.getElementById('custoTotal'); 
    custoElement.innerHTML = 'Custo total:'+ custoTotal;
}

drawGraph();