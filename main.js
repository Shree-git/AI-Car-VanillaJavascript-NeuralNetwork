const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");

carCanvas.width = 200;
networkCanvas.width = 300;

const N = 100;
const cars = [];

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)];

for (let i = 0; i < N; i++) {
  cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
}
let bestCar = null;

// if (localStorage.getItem("bestCar")) {
//   bestCar = JSON.parse(localStorage.getItem("bestCar"));
// }
animate();

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.1;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, cars[0].brain);

  if (bestCar.brain != JSON.parse(localStorage.getItem("bestCar"))) {
    console.log(bestCar);
    saveBestCar(bestCar.brain);
  }

  requestAnimationFrame(animate);
}

function saveBestCar(bestCarBrain) {
  localStorage.setItem("bestCar", JSON.stringify(bestCarBrain));
}

function deleteBestCar() {
  localStorage.setItem("bestCar", null);
}
