document.addEventListener('DOMContentLoaded', function() {

    function getData() {
        const touRates = [0.15, 0.14, 0.13, 0.12, 0.11, 0.10, 0.09, 0.10, 0.11, 0.15, 0.19, 0.25, 0.27, 0.25, 0.21, 0.16, 0.11, 0.09, 0.07, 0.09, 0.11, 0.12, 0.13, 0.14];
        const actualHourlyUsage = [1.0, 1.05, 1.10, 1.05, 1.9, 2.1, 1.85, 1.65, 1.7, 2.3, 2.4, 2.35, 1.5, 1.35, 1.2, 1.75, 2.8, 2.9, 2.2, 1.5, 1.25, 1.2, 1.1, 1.05];
        const scaler = touRates.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / actualHourlyUsage.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const scaledHourlyUsage = actualHourlyUsage.map(rate => rate * scaler);
        
        let maxProduct = 0;
        let minProduct = Infinity;
      
        // Find min and max first
        actualHourlyUsage.map((value, index) => {
            const product = value * touRates[index];
            maxProduct = Math.max(maxProduct, product);
            minProduct = Math.min(minProduct, product);
        });
      
        console.log('min/max products', maxProduct, minProduct);
      
        // Come up a split interval
        const numSplits = 10;
        const splitInterval = (maxProduct - minProduct) / (numSplits - 1);
        
        // Assign colors along the split interval
        const data = actualHourlyUsage.map((value, index) => {
            const product = value * touRates[index]; // kW used * the usage cost

            let color;
            if (product < minProduct + (1 * splitInterval)) color = '#8FD2F9';
            else if (product < minProduct + (2 * splitInterval)) color = '#74c7f8';
            else if (product < minProduct + (3 * splitInterval)) color = '#58bbf6';
            else if (product < minProduct + (4 * splitInterval)) color = '#64b1e4';
            else if (product < minProduct + (5 * splitInterval)) color = '#70a6d2';
            else if (product < minProduct + (6 * splitInterval)) color = '#7c9bc0';
            else if (product < minProduct + (7 * splitInterval)) color = '#8890ae';
            else if (product < minProduct + (8 * splitInterval)) color = '#A07B8A';
            else if (product < minProduct + (9 * splitInterval)) color = '#b76566';
            else color = '#e94f37';

            return { actualHourlyUse: value, scaledHourlyUse: scaledHourlyUsage[index], touRate: touRates[index], truncatedRate: touRates[index].toFixed(2), color: color };
        });
        return data
    }
    
    const hourlyIntervals = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM'];
    const data = getData();
    const totalAnnualEnergyCost = data.reduce((acc, point) => acc + (point.actualHourlyUse * point.touRate * 365), 0);
    console.log(totalAnnualEnergyCost);


    
    /* 
     * Renders the chart (and stores data locally for exporting)
     */
    const dailyEnergyCostAndUse = Highcharts.chart('dailyEnergyCostAndUseContainer', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Annual Energy Usage and Cost Throughout the Day'
        },
        subtitle: {
            text: `Total Annual Energy Cost: $${totalAnnualEnergyCost.toFixed(2)}`
        },
        yAxis: {
            title: {
                text: 'Time of Use Rate'
            },
            labels: {
                enabled: true,
                format: '${value:.2f}'
            }
        },
        xAxis: {
            categories: hourlyIntervals,
            title: {
                text: 'Time of Day'
            },
            labels: {
                rotation: -45
            }
        },
        // tooltip: {
        //     shared: true,
        //     split: true
        // },
        legend: {
            // TODO
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            useHTML: true,
            labelFormatter: function() {
                return `<span style="border-bottom: 1px dashed ${this.color}; padding-bottom: 2px;">${this.name}</span>`;
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                groupPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Your Energy Usage',
            type: 'column',
            // this format enables us to use all the data
            data: data.map(point => ({
                ...point,
                y: Number(point.scaledHourlyUse)
            })),
            dataLabels: {
                enabled: true,
                formatter: function() {
                    // since we are using a scaler to shrink the value of the data, we need to do the math to bring it back to it's original value for display
                    return '$' + (this.point.actualHourlyUse * this.point.touRate * 365).toFixed(2);
                }
            },
            tooltip: {
                pointFormat: 'Average Daily energy use: <b>{point.options.actualHourlyUse} kW</b><br>Time of Use Rate: <b>${point.options.truncatedRate}</b><br>'
            },
            borderRadius: 2,
          }, {
            name: 'Time of Use Rates',
            type: 'spline',
            data: data.map(point => ({
                ...point,
                y: Number(point.touRate)
            })),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                  [0, 'red'],
                  [1, 'blue']
                ]
              },
            dashStyle: 'LongDash',
            marker: {
                enabled: false,
            }
          }
        ],
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        }
    });

    /* 
    * For production to use exporting, along with the appropriate type 
    */
    const filetype = 'image/svg+xml';
    // const filetype = 'image/jpeg',
    // const filetype = 'image/png',

    // dailyEnergyCostAndUse.exportChartLocal({
    //     type: filetype,
    //     filename: 'dailyEnergyCostAndUseChart'
    // }, dailyEnergyCostAndUseOptions);

    /*
     * Now show how generating electricity at peak times would slash the bill
     */
});