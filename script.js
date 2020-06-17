const CORONA_TRAFFIC_URL = 'https://knudmoeller.github.io/berlin_corona_cases/data/target/berlin_corona_traffic_light.json';

const COLORS = {
    green: [0, 128, 0],
    yellow: [255, 255, 0],
    red: [255, 0, 0]
}

function getRGBA(color, alpha = 1) {
    return `rgba(${color.join(',')},${alpha})`;
}

const INDICATORS = [
    {
        key: 'basic_reproduction_number',
        canvas: 'chart-reproduction',
        thresholds: [1.1, 1.2],
        title: 'Reproduktionsrate R',
        stepSize: 0.5
    },
    {
        key: 'incidence_new_infections',
        canvas: 'chart-infections',
        thresholds: [20, 30],
        title: 'Neuinfektionen',
        stepSize: 5
    },
    {
        key: 'icu_occupancy_rate',
        canvas: 'chart-icu',
        thresholds: [15, 25],
        title: 'Krankenhausbetten',
        stepSize: 5
    }
]

function render(key, rawData) {
    const config = INDICATORS.find(e => e.key === key);

    var ctx = document.getElementById(config.canvas).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [getDataset(rawData, key)]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            title: {
                text: config.title,
                display: true
            },
            scales: {
                xAxes: [{
                    id: 'x-axis-0',
                    type: 'time',
                    display: true,
                    time: {
                        stepSize: 5
                    }
                }],
                yAxes: [{
                    id: 'y-axis-0',
                    display: true,
                    ticks: {
                        stepSize: config.stepSize,
                        suggestedMin: 0,
                        suggestedMax: config.thresholds[1] * 1.15
                    }
                }]
            },
            annotation: {
                drawTime: 'beforeDatasetsDraw',
                annotations: [{
                    type: 'box',
                    xScaleID: 'x-axis-0',
                    yScaleID: 'y-axis-0',
                    yMin: 0,
                    yMax: config.thresholds[0],
                    backgroundColor: getRGBA(COLORS.green, 0.2),
                    borderWidth: 0,
                }, {
                    type: 'box',
                    xScaleID: 'x-axis-0',
                    yScaleID: 'y-axis-0',
                    yMin: config.thresholds[0],
                    yMax: config.thresholds[1],
                    backgroundColor: getRGBA(COLORS.yellow, 0.2),
                    borderWidth: 0,
                }, {
                    type: 'box',
                    xScaleID: 'x-axis-0',
                    yScaleID: 'y-axis-0',
                    yMin: config.thresholds[1],
                    backgroundColor: getRGBA(COLORS.red, 0.2),
                    borderWidth: 0,
                }]
            }
        }
    });
}

async function getData() {
    return (await fetch(CORONA_TRAFFIC_URL)).json();
}

function getDataset(data, key) {
    return {
        data: data.map(e => ({ x: e.pr_date, y: e.indicators[key].value })),
        pointBackgroundColor: data.map(e => e.indicators[key].color),
    }
}

async function renderDocument() {
    const rawData = await getData();
    rawData.reverse();
    render('basic_reproduction_number', rawData);
    render('incidence_new_infections', rawData);
    render('icu_occupancy_rate', rawData);
}

renderDocument();