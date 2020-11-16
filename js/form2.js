var formElement = document.getElementById('formularioUtente');

function toggleContent(event, element) {
    if (!event || !element) {
        console.warn("please provide event and element to hide or display")
        return;
    }
    var htmlEl = document.getElementById(element);
    if (event.target.checked) {
        htmlEl.hidden = false;
        return;
    }
    htmlEl.hidden = true;
}

function submitForm(event) {
    event.preventDefault();
    addLoadingStatus(event);
    var data = {};
    var form = new FormData(formElement);
    for (var key of form.keys()) {
        data[key] = form.get(key);
    }
    submitData(data);
}

function submitData(data) {
    data.guid = window.location.hash.replace(/^#/, '');
    console.log(data);
    return;
    var url = config.form2.url;
    var rqt = $.ajax({
        url: url,
        type: "POST",
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    rqt.done(function () {
        window.location.href = '../responses/sucesso.html';
    });

    rqt.fail(function (xhr) {
        var button = document.getElementById('enviarform');
        button.disabled = false;
        button.children[0].classList.add("d-none");
        alert(xhr.responseJSON.message);
    });
}