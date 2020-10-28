function removeContact(ev) {
  ev.currentTarget.parentElement.parentElement.remove();
}

function addLoadingStatus(ev) {
  ev.currentTarget.disabled = true;
  ev.currentTarget.children[0].classList.remove("d-none");
}

function submitForm(ev) {
  ev.preventDefault();
  addLoadingStatus(ev);
  var arrayData = $('#formulario-caso-positivo').serializeArray();
  var contactos = [];
  var payload = {};
  // primeiros 3 sao sempre do paciente
  // remove os primeiros do arrayData
  // TODO rever porque vai ser necessário adicionar campos ao formulário
  var patient = arrayData.splice(0, 3);
  patient.forEach(item => {
    // adicionar cada uns dos fields referentes ao paciente
    payload[item.name] = item.value;
  });

  // Obter hash do endereço e adicionar ao payload
  payload.casehash = window.location.hash.replace(/^#/, '');
  
  // arrayData apenas contem contactos
  for (var i = 0; i < arrayData.length; i = i + 3) {
    if (arrayData[i].value && arrayData[i + 1].value) {
      // apenas processa info se tiver nome e contacto telefonico
      var contact = {
        nome: arrayData[i].value,
        tel: arrayData[i + 1].value,
        email: arrayData[i + 2].value,
      }
      contactos.push(contact);
    }
  }

  payload.contactos = contactos;

  // para testar, abrir a consola no browser e descomentar as 2 linhas abaixo
  //console.log(payload);
  //return;

  //var jsonData = JSON.stringify(toJsonSer);
  var url = 'https://prod-102.westeurope.logic.azure.com:443/workflows/31557671fa2c4004add7324f7a490b63/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dhft2BDXsnOeKjVmZysjTfH14tsKdXDq9zrSKPHz8PY';

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
    $('#cena-para-add .rastreio-de-contactos-row').first().clone().appendTo('#rastreio-de-contactos-items');
  });
});
