

const ctx = document.getElementById('myChart');

var comodosSalvos = JSON.parse(localStorage.getItem('comodos')) ;
map = new Map(JSON.parse(localStorage.getItem('comodos')));

const xlabel = [];
const yData2hz = [];
const yData5hz = [];

const yDataInterferencia =[];

const yDataVelocidade2hz = []
const yDataVelocidade5hz = []
var comodosSalvos = localStorage.getItem('comodos');
console.log(comodosSalvos);
if (comodosSalvos) {
    var comodos = JSON.parse(comodosSalvos);
    comodos.forEach(function (comodo) {
        console.log(comodo.local);
        xlabel.push(comodo.local);
        yData2hz.push(comodo.nivel2);
        yData5hz.push(comodo.nivel5);
        yDataInterferencia.push(comodo.interferencia);
        yDataVelocidade2hz.push(comodo.velocidade2);
        yDataVelocidade5hz.push(comodo.velocidade5);

    });
}
addGrafico('myChart','line','Graficos local sinal 2,4 hz',yData2hz);
addGrafico('myChart2', 'line','Graficos local sinal 5 hz',yData5hz);
addGrafico('myChartInterferencia-1', 'bar','Graficos local interferencia',yDataInterferencia);

addGrafico('myChartVelocidade-1', 'bar','Graficos local velocidade 2hz',yDataVelocidade2hz);
addGrafico('myChartVelocidade-2', 'bar','Graficos local velocidade 5hz',yDataVelocidade5hz);

function addGrafico(nome, typeChart, nomeGrafico, yData){
    var ctx = document.getElementById(nome);
    new Chart(ctx, {
        type: typeChart,
        data: {
          labels: xlabel,
          datasets: [{
            label: nomeGrafico,
            data:yData,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}



