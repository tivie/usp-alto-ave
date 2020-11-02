function submitForm(ev) {
  var form = $('#formulario-contacto');
  if (!form[0].checkValidity()) {
    return false;
  }
  ev.preventDefault();
  addLoadingStatus(ev);

  var payload = {};
  var arrayData = form.serializeArray();
  payload.guid = window.location.hash.replace(/^#/, '');
  
  arrayData.forEach(item => {
    payload[item.name] = item.value;
  });

  var url = config.form1.url;

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
