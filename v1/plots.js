google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(onLoadCallback);

function onLoadCallback() {
    // Assuming newData is the updated data array
    // var newData = [
    //     ['Copper\nCu\n29', Math.random() * 20, 'color: #b87333', (Math.random() * 20).toFixed(2) + ' g/cm³'],
    //     ['Silver\nAg\n47', Math.random() * 20, 'color: silver', (Math.random() * 20).toFixed(2) + ' g/cm³'],
    //     ['Gold\nAu\n79', Math.random() * 20, 'color: gold', (Math.random() * 20).toFixed(2) + ' g/cm³'],
    //     ['Platinum\nPt\n78', Math.random() * 20, 'color: #e5e4e2', (Math.random() * 20).toFixed(2) + ' g/cm³']
    // ];

    // data.removeRows(0, 4);
    // data.addRows(newData);
    // chart.draw(data, options);
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Element');
    data.addColumn('number', 'Density');
    data.addColumn({type: 'string', role: 'style'});
    data.addColumn({type: 'string', role: 'annotation'});

    data.addRows([
        ['Copper\nCu\n29', 8.94, 'color: #b87333', '8.94 g/cm³'],
        ['Silver\nAg\n47', 10.49, 'color: silver', '10.49 g/cm³'],
        ['Gold\nAu\n79', 19.30, 'color: gold', '19.30 g/cm³'],
        ['Platinum\nPt\n78', 21.45, 'color: #e5e4e2', '21.45 g/cm³']
    ]);

    var options = {
        title: "Density of Precious Metals, in g/cm³",
        width: 800,
        height: 400,
        bar: {groupWidth: "75%"},
        legend: { position: "none" },
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Element'
        },
        vAxis: {
            title: 'Density (g/cm³)'
        },
        annotations: {
            alwaysOutside: true
        },
        animation: {
            duration: 100,
            easing: 'out',
        },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById(idTotalPlot));
    chart.draw(data, options);
}

// Update plots at a regular interval.
// setInterval(updateChartData, 1000);