import FCFS from './FCFS.js';
import Chart from './chart.min.js';
import SJF from './SJF.js';
import SRTF from './SRTF.js';
import RR from './RR.js';
let backgroundColor = [
    'rgba(255,99,132,0.8)',
    'rgba(54,162,235,0.8)'
]
let button = document.getElementById("save");
let name = document.getElementById("name");
let time = document.getElementById("time");
let processingTime = document.getElementById("processing-time");
let tBody = document.getElementById("t-body");
let data = [];
let Processchart = document.getElementById('chart').getContext('2d');
let buttonFCFS = document.getElementById("FCFS");
let buttonSJS = document.getElementById("SJF");
let buttonSRTF = document.getElementById("SRTF");
let buttonRR = document.getElementById("RR");

buttonFCFS.onclick = () => {
    if (data.length == 0) {
        alert("Cola vacia");
    } else {
        sort();
            clearResultsTable();
            simulateFCFSStepByStep();
    }
}

// Simulación instantánea para FCFS
function simulateFCFSStepByStep() {
    // Copia profunda de los datos para no modificar el original
    let simData = JSON.parse(JSON.stringify(data));
    let fcfs = new FCFS(simData, backgroundColor);
    let queue = [];
    let performance = null;
    let time = Number(simData[0].time);
    let lastEntrie = Number(simData[simData.length - 1].time);

    while (true) {
        // Llegada de procesos
        simData.forEach((element, index) => {
            if (time == Number(element.time) && !element._arrived) {
                element.id = index;
                element.entries = 0;
                element.timeSpent = 0;
                element.waitTime = 0;
                element._arrived = true;
                queue.push(element);
            }
        });
        // Si no hay proceso en ejecución, tomar de la cola
        if (performance == null && queue.length != 0) {
            performance = queue.shift();
            performance.entries += 1;
            if (performance.entries == 1) performance.startTime = time;
        }
        // Avanzar tiempo
        time++;
        if (performance != null) {
            // Aumentar tiempo de espera de los procesos en cola
            queue.forEach(element => {
                element.waitTime += 1;
            });
            performance.timeSpent += 1;
            if (performance.timeSpent == Number(performance.processingTime)) {
                performance.CompletionTime = time;
                simData[performance.id] = performance;
                performance = null;
            }
        }
        // Verificar fin de simulación
        if (performance == null && queue.length == 0 && time > lastEntrie) {
            break;
        }
    }
    // Copiar resultados a data global
    for (let i = 0; i < data.length; i++) {
        Object.assign(data[i], simData[i]);
    }
    createTable(data);
    mychart.data = fcfs.exportChart.call({data: simData, backgroundColor});
    mychart.update();
}
buttonSJS.onclick = () => {
    if (data.length == 0) {
        alert("Cola vacia");
    } else {
        sort();
            clearResultsTable();
            simulateSJFStepByStep();
    }
}
buttonSRTF.onclick = () => {
    if (data.length == 0) {
        alert("Cola vacia");
    } else {
        sort();
            clearResultsTable();
            simulateSRTFStepByStep();
    }
}
buttonRR.onclick = () => {
    let quantum = prompt("Digita el valor del quatum");
    if (!isNaN(quantum) && quantum != "") {
        quantum = Math.round(quantum);
        if (data.length == 0) {
            alert("Cola vacia");
        } else {
            sort();
                clearResultsTable();
                simulateRRStepByStep(quantum);
        }
    } else {
        alert("Digite un valor numérico");
    }
}
// Simulación instantánea para SJF
function simulateSJFStepByStep() {
    let simData = JSON.parse(JSON.stringify(data));
    let sjf = new SJF(simData, backgroundColor);
    let queue = [];
    let performance = null;
    let time = Number(simData[0].time);
    let lastEntrie = Number(simData[simData.length - 1].time);

    while (true) {
        // Llegada de procesos
        simData.forEach((element, index) => {
            if (time == Number(element.time) && !element._arrived) {
                element.id = index;
                element.entries = 0;
                element.timeSpent = 0;
                element.waitTime = 0;
                element._arrived = true;
                queue.push(element);
            }
        });
        // Ordenar la cola por menor tiempo de procesamiento
        queue.sort((a, b) => Number(a.processingTime) - Number(b.processingTime));
        if (performance == null && queue.length != 0) {
            performance = queue.shift();
            performance.entries += 1;
            if (performance.entries == 1) performance.startTime = time;
        }
        time++;
        if (performance != null) {
            queue.forEach(element => {
                element.waitTime += 1;
            });
            performance.timeSpent += 1;
            if (performance.timeSpent == Number(performance.processingTime)) {
                performance.CompletionTime = time;
                simData[performance.id] = performance;
                performance = null;
            }
        }
        if (performance == null && queue.length == 0 && time > lastEntrie) {
            break;
        }
    }
    for (let i = 0; i < data.length; i++) {
        Object.assign(data[i], simData[i]);
    }
    createTable(data);
    mychart.data = sjf.exportChart.call({data: simData, backgroundColor});
    mychart.update();
}

// Simulación instantánea para SRTF
function simulateSRTFStepByStep() {
    let simData = JSON.parse(JSON.stringify(data));
    let srtf = new SRTF(simData, backgroundColor);
    let queue = [];
    let performance = null;
    let time = Number(simData[0].time);
    let lastEntrie = Number(simData[simData.length - 1].time);

    while (true) {
        // Llegada de procesos
        simData.forEach((element, index) => {
            if (time == Number(element.time) && !element._arrived) {
                element.id = index;
                element.entries = 0;
                element.timeSpent = 0;
                element.waitTime = 0;
                element._arrived = true;
                queue.push(element);
            }
        });
        // Ordenar la cola por menor tiempo restante
        queue.sort((a, b) => (Number(a.processingTime) - (a.timeSpent || 0)) - (Number(b.processingTime) - (b.timeSpent || 0)));
        if (performance == null && queue.length != 0) {
            performance = queue.shift();
            performance.entries += 1;
            if (performance.entries == 1) performance.startTime = time;
        } else if (performance && queue.length > 0) {
            // Expropiación si hay uno con menor tiempo restante
            let perfRem = Number(performance.processingTime) - (performance.timeSpent || 0);
            let queueRem = Number(queue[0].processingTime) - (queue[0].timeSpent || 0);
            if (queueRem < perfRem) {
                queue.push(performance);
                performance = queue.shift();
                performance.entries += 1;
                if (performance.entries == 1) performance.startTime = time;
            }
        }
        time++;
        if (performance != null) {
            queue.forEach(element => {
                element.waitTime += 1;
            });
            performance.timeSpent = (performance.timeSpent || 0) + 1;
            if (performance.timeSpent == Number(performance.processingTime)) {
                performance.CompletionTime = time;
                simData[performance.id] = performance;
                performance = null;
            }
        }
        if (performance == null && queue.length == 0 && time > lastEntrie) {
            break;
        }
    }
    for (let i = 0; i < data.length; i++) {
        Object.assign(data[i], simData[i]);
    }
    createTable(data);
    mychart.data = srtf.exportChart.call({data: simData, backgroundColor});
    mychart.update();
}

// Simulación instantánea para RR
function simulateRRStepByStep(quantum) {
    let simData = JSON.parse(JSON.stringify(data));
    let rr = new RR(simData, quantum, backgroundColor);
    let queue = [];
    let performance = null;
    let time = Number(simData[0].time);
    let lastEntrie = Number(simData[simData.length - 1].time);
    let runningTime = 0;

    while (true) {
        // Llegada de procesos
        simData.forEach((element, index) => {
            if (time == Number(element.time) && !element._arrived) {
                element.id = index;
                element.entries = 0;
                element.timeSpent = 0;
                element.waitTime = 0;
                element.runningTime = 0;
                element._arrived = true;
                queue.push(element);
            }
        });
        if (performance == null && queue.length != 0) {
            performance = queue.shift();
            performance.entries += 1;
            runningTime = 0;
            if (performance.entries == 1) performance.startTime = time;
        }
        time++;
        if (performance != null) {
            queue.forEach(element => {
                element.waitTime += 1;
            });
            performance.timeSpent += 1;
            runningTime += 1;
            if (performance.timeSpent == Number(performance.processingTime)) {
                performance.CompletionTime = time;
                simData[performance.id] = performance;
                performance = null;
                runningTime = 0;
            } else if (runningTime == quantum) {
                // Quantum agotado, pasa al final de la cola
                queue.push(performance);
                performance = null;
                runningTime = 0;
            }
        }
        if (performance == null && queue.length == 0 && time > lastEntrie) {
            break;
        }
    }
    for (let i = 0; i < data.length; i++) {
        Object.assign(data[i], simData[i]);
    }
    createTable(data);
    mychart.data = rr.exportChart.call({data: simData, backgroundColor});
    mychart.update();
}
button.onclick = () => {
    if (validateFields()) {
        data[data.length] = {
            name: name.value,
            time: time.value,
            processingTime: processingTime.value
        }
        sort();
        paintTable();
        updatePreviewChart();
        clear();
    } else {
        alert("Completar los campos");
    }
}
// Muestra un gráfico de los procesos agregados (sin simular)
function updatePreviewChart() {
    if (data.length === 0) {
        mychart.data = { labels: [], datasets: [] };
        mychart.update();
        return;
    }
    // Simula un Gantt simple: cada proceso inicia en su tiempo de llegada y dura su processingTime
    let labels = data.map(p => p.name);
    let dat = data.map(p => [Number(p.time), Number(p.time) + Number(p.processingTime)]);
    mychart.data = {
        labels: labels,
        datasets: [{
            data: dat,
            backgroundColor: backgroundColor,
            borderWidth: 2,
            borderRadius: 2,
            borderSkipped: false
        }]
    };
    mychart.update();
}

function paintTable() {
    tBody.innerHTML = "";
    data.forEach(element => {
        tBody.innerHTML += '<tr><td>' + element.name + '</td><td>' + element.time + '</td><td>' + element.processingTime + '</td></tr>';
    })
}

function sort() {
    data.sort(function(a, b) {
        if (Number(a.time) > Number(b.time)) {
            return 1;
        }
        if (Number(a.time) < Number(b.time)) {
            return -1;
        }
        return 0;
    });
}

function clear() {
    name.value = "";
    time.value = "";
    processingTime.value = "";
}

function validateFields() {
    return name.value != "" && time.value != "" && processingTime.value != "";
}

function createTable(data) {
    let thead = "<thead><tr><th>Nombre</th><th>Tiempo de llegada</th><th>Duración</th><th>Tiempo de comienzo</th><th>Tiempo de Fin</th><th>Tiempo de retorno</th><th>Tiempo de espera</th></tr></thead>";
    let tBody = "<tbody>";
    data.forEach(element => {
        const safe = v => (v === undefined || v === null || isNaN(v)) ? '-' : v;
        const start = safe(element.startTime);
        const end = safe(element.CompletionTime);
        const wait = safe(element.waitTime);
        const ret = (element.CompletionTime !== undefined && element.time !== undefined && !isNaN(element.CompletionTime - element.time)) ? (element.CompletionTime - element.time) : '-';
        tBody += `<tr><td>${safe(element.name)}</td><td>${safe(element.time)}</td><td>${safe(element.processingTime)}</td><td>${start}</td><td>${end}</td><td>${ret}</td><td>${wait}</td></tr>`;
    });
    document.getElementById("summaryTable").innerHTML = thead + tBody;
}

// Limpia la tabla de resultados antes de simular
function clearResultsTable() {
    let thead = "<thead><tr><th>Nombre</th><th>Tiempo de llegada</th><th>Duración</th><th>Tiempo de comienzo</th><th>Tiempo de Fin</th><th>Tiempo de retorno</th><th>Tiempo de espera</th></tr></thead>";
    let tBody = "<tbody>";
    for (let i = 0; i < data.length; i++) {
        tBody += `<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`;
    }
    document.getElementById("summaryTable").innerHTML = thead + tBody;
}

let mychart = new Chart(Processchart, {
    type: 'bar',
    data: {

    },
    options: {
        indexAxis: 'y',
        layout: {
            padding: 0
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Linea de ejecución',
            }
        },
        responsive: true,
        scales: {
            y: {
                stacked: true,
                // barThickness: 5,
            },
            // x: {
            //     barThickness: 5
            // },
            // yAxes: [{

            //     // categorySpacing: 0,
            //     // barPercentage: 0.5
            //     //
            // }],
            // xAxes: [{
            //         barThickness: 5,
            //     }]
            // x: {
            //     stacked: true,
            // },

        },
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
    }
});
