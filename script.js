const CORONA_TRAFFIC_URL = 'https://knudmoeller.github.io/berlin_corona_cases/data/target/berlin_corona_traffic_light.json';

function render(canvasId, datasets) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    display: false
                }],
                yAxes: [{
                    display: false
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
    render('chart-reproduction', [getDataset(rawData, 'basic_reproduction_number')]);
    render('chart-infections', [getDataset(rawData, 'incidence_new_infections')]);
    render('chart-icu', [getDataset(rawData, 'icu_occupancy_rate')]);
}

renderDocument();