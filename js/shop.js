let currentShippingCost = 0;
let isDeliveryAllowed = true;

const knownDistances = {
  "pindamonhangaba": 3,
  "pinda": 3,
  "centro": 2,
  "taubate": 20,
  "roseira": 15,
  "tremembe": 12,
  "guaratingueta": 35,
  "aparecida": 30,
  "sao jose dos campos": 45,
  "sjc": 45,
  "campos do jordao": 48
};

function handleShippingCalculation() {
  const address = document.getElementById('shipping-address').value.trim().toLowerCase();
  const distanceInputValue = parseFloat(document.getElementById('shipping-distance').value);
  const alertBox = document.getElementById('shipping-alert');

  let distance = distanceInputValue;

  if (isNaN(distance) || distance <= 0) {
    for (const key in knownDistances) {
      if (address.includes(key)) {
        distance = knownDistances[key];
        document.getElementById('shipping-distance').value = distance;
        break;
      }
    }
  }

  if (isNaN(distance) || distance <= 0) {
    alertBox.className = "shipping-info-alert error";
    alertBox.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Informe o endereço e a distância em KM a partir do Centro de Pindamonhangaba.";
    currentShippingCost = 0;
    isDeliveryAllowed = false;
    updateCartUI();
    return;
  }

  if (distance > 100) {
    isDeliveryAllowed = false;
    currentShippingCost = 0;
    alertBox.className = "shipping-info-alert error";
    alertBox.innerHTML = `<i class="fa-solid fa-ban"></i> A distância de <strong>${distance} km</strong> excede o limite máximo de 100 km a partir de Pindamonhangaba (Centro). <strong>Não é possível efetuar a entrega via motoboy.</strong>`;
  } else {
    isDeliveryAllowed = true;
    currentShippingCost = distance * 4;
    alertBox.className = "shipping-info-alert success";
    alertBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> Entrega disponível!<br>Distância: <strong>${distance} km</strong> | Frete: <strong>R$ ${currentShippingCost.toFixed(2).replace('.', ',')}</strong> (R$ 4,00/km)`;
  }

  updateCartUI();
}