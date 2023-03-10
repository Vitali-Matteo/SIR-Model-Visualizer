let chart = null;
let skipEvery = 2;
computeAndGraph(3);

let inputs = document.getElementsByClassName("inputs");
for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", eventHandler);
}

function eventHandler(event) {
    let R0 = (Number(document.getElementById("xi").value) / Number(document.getElementById("eta").value)).toFixed(2);

    if (event.target.id == "eta") {
        document.getElementById("etaTesto").innerHTML = event.target.value;
    }
    if (event.target.id == "xi") {
        document.getElementById("xiTesto").innerHTML = event.target.value;
    }
    document.getElementById("R0Testo").innerHTML = "R<sub>0</sub>: " + R0;

    computeAndGraph(R0);
}

function computeAndGraph(R0) {
    let eta = Number(document.getElementById("eta").value);
    let xi = Number(document.getElementById("xi").value);
    let I0 = Number(document.getElementById("I0").value);
    let N = Number(document.getElementById("N").value);
    let delT = Number(document.getElementById("delT").value);
    let maxTime = Number(document.getElementById("maxTime").value);

    if (delT == 0) return;

    let I_ar = [];
    let S_ar = [];
    let R_ar = [];
    let t_ar = [];

    let I = I0;
    let S = N;
    let R = 0;

    let counter = 0;
    for (let t = 0; t <= maxTime; t += delT) {
        let delS = -xi * S * I / N * delT;
        let delI = xi * S * I / N * delT - eta * I * delT;
        let delR = eta * I * delT;
        S += delS;
        I += delI;
        R += delR;
        if (counter % skipEvery == 0) {
            I_ar.push(I);
            S_ar.push(S);
            R_ar.push(R);
            t_ar.push(Number(t.toFixed(2)));
        }
        counter++;
    }

    drawChart(
        {
            t: t_ar,
            I: I_ar,
            S: S_ar,
            R: R_ar
        }, N, R0);

}


function drawChart(output, y0, R0) {
    var ctx = document.getElementById('chart').getContext('2d');
    if (chart != undefined) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: output.t,
            datasets: [{
                label: 'Infetti',
                data: output.I,
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1,
                fill: false,
                pointRadius: 1
            },
            {
                label: 'Suscettibili',
                data: output.S,
                borderColor: ['rgba(99, 255, 132, 1)'],
                borderWidth: 1,
                fill: false,
                pointRadius: 1
            },
            {
                label: 'Ricoverati',
                data: output.R,
                borderColor: ['rgba(99, 132, 255, 1)'],
                borderWidth: 1,
                fill: false,
                pointRadius: 1
            }]
        },
        options: {
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: y0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Popolazione'
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 30
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Tempo (giorni)'
                    }

                }]
            },
            title: {
                display: true,
            },
            maintainAspectRatio: false,
            responsive: false
        }
    });
}