
var modal = document.getElementById("modalForm");

var btn = document.getElementById("btnModal");

var span = document.getElementsByClassName("close")[0];

btnModal.onclick = function () {
    modal.style.display = "flex";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
