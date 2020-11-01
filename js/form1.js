function removeContact(ev) {
  ev.currentTarget.parentElement.parentElement.remove();
}

function addLoadingStatus(ev) {
  ev.currentTarget.disabled = true;
  ev.currentTarget.children[0].classList.remove("d-none");
}

function setMinDate(minDate) {
  document.querySelectorAll('.data-contacto').forEach(function (item) {
    item.min = minDate;
  })
}

function setMaxDate(maxDate) {
  document.querySelectorAll('.data-contacto').forEach(function (item) {
    item.max = maxDate;
  })
}

function disableContactDates() {
  document.querySelectorAll('.data-contacto').forEach(function (item) {
    item.disabled = true;
  })
}

function enableContactDates() {
  document.querySelectorAll('.data-contacto').forEach(function (item) {
    item.disabled = false;
  })
}

var testDate;
var symptomsDate;
var earliestDate;

var twoDayInMilliseconds = 24 * 60 * 60 * 1000 * 2;

function calculateEearliestDate(d) {
  var twoDaysAgoInMs = new Date(d) - twoDayInMilliseconds;
  const twoDaysAgo = parseData(new Date(twoDaysAgoInMs));
  return twoDaysAgo;
}

function parseData(d) { // returns yyyy-mm-dd
  return d.toISOString().match(/.*(?=T)/)[0];
}

function getMinAndMaxDate() {
  var today = parseData(new Date);
  if (!testDate && !symptomsDate) return {};
  if (!testDate) return { max: today, min: calculateEearliestDate(symptomsDate) };
  if (!symptomsDate) return { max: today, min: calculateEearliestDate(testDate) };
  var date1 = new Date(testDate);
  var date2 = new Date(symptomsDate);
  if (date1 < date2) return { max: today, min: calculateEearliestDate(testDate) };
  return { max: today, min: calculateEearliestDate(symptomsDate) };
}

document.getElementById('datateste').addEventListener('input', (ev) => {
  testDate = ev.currentTarget.value;
  if (!testDate && !symptomsDate) {
    disableContactDates();
    return;
  }
  enableContactDates();
  var dates = getMinAndMaxDate();
  setMinDate(dates.min);
  setMaxDate(dates.max);
})

document.getElementById('datasintomas').addEventListener('input', (ev) => {
  symptomsDate = ev.currentTarget.value;
  if (!testDate && !symptomsDate) {
    disableContactDates();
    return;
  }
  enableContactDates();
  var dates = getMinAndMaxDate();
  setMinDate(dates.min);
  setMaxDate(dates.max);
})

function submitForm(ev) {
  ev.preventDefault();
  addLoadingStatus(ev);
  var arrayData = $('#formulario-caso-positivo').serializeArray();
  var contactos = [];

  console.log(arrayData);

  var payload = {};
  // primeiros 5 ou 6 sao sempre do paciente
  // remove os primeiros do arrayData
  var patient;
  if (document.getElementById("sympt").checked) {
    patient = arrayData.splice(0, 6);
  } else {
    patient = arrayData.splice(0, 5);
  }
  console.log(patient)
  patient.forEach(item => {
    // adicionar cada uns dos fields referentes ao paciente
    payload[item.name] = item.value;
  });

  // Obter hash do endereço e adicionar ao payload
  payload.casehash = window.location.hash.replace(/^#/, '');

  // arrayData apenas contem contactos
  for (var i = 0; i < arrayData.length; i = i + 4) {
    console.log(arrayData[i + 3].value)
    if (arrayData[i].value && arrayData[i + 1].value && arrayData[i + 3].value) {
      // apenas processa info se tiver nome e contacto telefonico
      var contact = {
        nome: arrayData[i].value,
        tel: arrayData[i + 1].value,
        email: arrayData[i + 2].value,
        datacontacto: arrayData[i + 3].value
      }
      contactos.push(contact);
    }
  }

  payload.contactos = contactos;

  // para testar, abrir a consola no browser e descomentar as 2 linhas abaixo
  // console.log(payload);
  // return;

  //var jsonData = JSON.stringify(toJsonSer);
  var url = 'https://prod-102.westeurope.logic.azure.com:443/workflows/31557671fa2c4004add7324f7a490b63/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dhft2BDXsnOeKjVmZysjTfH14tsKdXDq9zrSKPHz8PY';

  //console.log(JSON.stringify(toJsonSer));

  var rqt = $.ajax({
    url: url,
    type: "POST",
    crossDomain: true,
    data: JSON.stringify(payload),
    dataType: "json",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  rqt.done(function (response) {
    // dar feedback ao utente
    window.location.href = '../responses/sucesso.html';
  });

  rqt.fail(function (xhr, status) {
    var button = document.getElementById('enviarform');
    button.disabled = false;
    button.children[0].classList.add("d-none");
    alert(xhr.responseJSON.message);
  });

}

$(document).ready(function () {
  $('#adicionar-contacto').click(function () {
    if (testDate || symptomsDate) {
      enableContactDates();
    }
    $('#cena-para-add .rastreio-de-contactos-row').first().clone().appendTo('#rastreio-de-contactos-items');
    var dates = getMinAndMaxDate();
    setMinDate(dates.min);
    setMaxDate(dates.max);
  });

  document.getElementById("sympt").addEventListener('click', function (ev) {
    if (ev.currentTarget.checked) {
      ev.currentTarget.parentElement.children.namedItem("datasintomas").type = "date";
      return;
    }
    ev.currentTarget.parentElement.children.namedItem("datasintomas").type = "hidden";
  })
});
