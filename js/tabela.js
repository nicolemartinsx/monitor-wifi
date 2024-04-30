var divError = document.getElementById('errorDiv');
var messageError = document.getElementById('errorMessage');
var modal = document.getElementById("modalForm");
var editIndexInput = document.getElementById("editIndex"); // Input para armazenar o índice da linha sendo editada

var btn = document.getElementById("btnModal");
btn.onclick = function () {
    document.getElementById('modal-title').textContent = 'Adicionar cômodo';
    modal.style.display = "flex";
}

var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function adicionarComodo(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    var local = document.getElementById('local').value.toUpperCase();
    var nivel2 = document.getElementById('nivel2').value;
    var nivel5 = document.getElementById('nivel5').value;
    var velocidade2 = document.getElementById('velocidade2').value;
    var velocidade5 = document.getElementById('velocidade5').value;
    var interferencia = document.getElementById('interferencia').value;

    if (local == '' || nivel2 == '' || velocidade2 == '' || interferencia == '') {
        showError('Todos os campos obrigatórios devem ser preenchidos');
        return false;
    }

    if (nivel2 > 0 || (nivel5 > 0 && nivel5 != '')) {
        showError('Por favor, preencha os valores de nível de sinal apenas com valores negativos');
        return false;
    }

    if (velocidade2 < 1 || (velocidade5 < 1 && velocidade5 != '')) {
        showError('Por favor, preencha os valores de velocidade apenas com valores maior que 1');
        return false;
    }

    if (checkRow(local, nivel2, nivel5, velocidade2, velocidade5, interferencia) && !editIndexInput.value) {
        showConfirmationModal('Já existe um cômodo com o mesmo nome e os dados serão substituidos. Deseja confirmar a ação?', function () {
            editRow(local, nivel2, nivel5, velocidade2, velocidade5, interferencia, checkRow(local, nivel2, nivel5, velocidade2, velocidade5, interferencia));
        });
    } else if (editIndexInput.value) {
        var rowIndex = parseInt(editIndexInput.value); // indice da linha a ser editada
        var table = document.getElementById('comodosTable').getElementsByTagName('tbody')[0];
        var rowData = table.rows[rowIndex].cells; // dados da linha a ser editada
        editRow(local, nivel2, nivel5, velocidade2, velocidade5, interferencia, rowData);
    } else {
        var newComodo = {
            local: local,
            nivel2: nivel2,
            nivel5: nivel5,
            velocidade2: velocidade2,
            velocidade5: velocidade5,
            interferencia: interferencia
        };
        addRowToTable(newComodo);

        var comodosSalvos = localStorage.getItem('comodos');
        var comodos = comodosSalvos ? JSON.parse(comodosSalvos) : [];
        comodos.push(newComodo);
        localStorage.setItem('comodos', JSON.stringify(comodos));

        clearValues();
        modal.style.display = "none";
    }
}


function editRow(local, nivel2, nivel5, velocidade2, velocidade5, interferencia, rowData) {

    showConfirmationModal('Deseja salvar as alterações?', function () {
        if (nivel5 == '' || velocidade5 == '') {
            nivel5 = 'N/A';
            velocidade5 = 'N/A';
        }
        rowData[0].innerHTML = local;
        rowData[1].innerHTML = nivel2;
        rowData[2].innerHTML = nivel5;
        rowData[3].innerHTML = velocidade2;
        rowData[4].innerHTML = velocidade5;
        rowData[5].innerHTML = interferencia;

        var comodosSalvos = localStorage.getItem('comodos');
        var comodos = comodosSalvos ? JSON.parse(comodosSalvos) : [];
        var rowIndex = parseInt(editIndexInput.value); // indice da linha a ser editada
        comodos[rowIndex] = {
            local: local,
            nivel2: nivel2,
            nivel5: nivel5,
            velocidade2: velocidade2,
            velocidade5: velocidade5,
            interferencia: interferencia
        };
        localStorage.setItem('comodos', JSON.stringify(comodos));

        clearValues();
        modal.style.display = "none";
        editIndexInput.value = '';
    });
}


// Função para verificar se já existe um cômodo com o mesmo local na tabela
function checkRow(local, nivel2, nivel5, velocidade2, velocidade5, interferencia) {
    var table = document.getElementById('comodosTable').getElementsByTagName('tbody')[0];
    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var rowData = rows[i].getElementsByTagName('td');
        if (rowData.length > 0 && rowData[0].innerHTML === local) {
            return rowData;
        }
    }
    return null;
}

function addRowToTable(comodo) {

    if (comodo.nivel5 == '' || velocidade5 == '') {
        comodo.nivel5 = 'N/A';
        comodo.velocidade5 = 'N/A';
    }
    var table = document.getElementById('comodosTable').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);
    var cell7 = newRow.insertCell(6);
    cell1.innerHTML = comodo.local;
    cell2.innerHTML = comodo.nivel2;
    cell3.innerHTML = comodo.nivel5;
    cell4.innerHTML = comodo.velocidade2;
    cell5.innerHTML = comodo.velocidade5;
    cell6.innerHTML = comodo.interferencia;
    cell7.innerHTML = '<button class="edit-btn"><img src="images/edit.png"></button><button class="delete-btn"><img src="images/trash.png"></button>';

    // Adiciona um evento de clique à imagem de edição
    var editBtn = cell7.querySelector('.edit-btn');
    editBtn.addEventListener('click', function () {
        document.getElementById('modal-title').textContent = 'Editar cômodo';
        var rowIndex = this.parentNode.parentNode.rowIndex;
        rowIndex--; // Decrementa o indice da linha para corresponder ao índice do array
        editIndexInput.value = rowIndex;
        var table = document.getElementById('comodosTable').getElementsByTagName('tbody')[0];
        var rowData = table.rows[rowIndex].cells;
        document.getElementById('local').value = rowData[0].innerHTML;
        document.getElementById('nivel2').value = rowData[1].innerHTML;
        document.getElementById('nivel5').value = rowData[2].innerHTML;
        document.getElementById('velocidade2').value = rowData[3].innerHTML;
        document.getElementById('velocidade5').value = rowData[4].innerHTML;
        document.getElementById('interferencia').value = rowData[5].innerHTML;
        modal.style.display = "flex";
    });

    // Adiciona um evento de clique à imagem de exclusão
    var deleteBtn = cell7.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        var rowToDelete = this.closest('tr');

        showConfirmationModal("Tem certeza de que deseja excluir este cômodo?", function () {
            if (rowToDelete) {
                var rowIndex = rowToDelete.rowIndex - 1; // indice da linha a ser excluída
                rowToDelete.remove();
                var comodosSalvos = localStorage.getItem('comodos');
                var comodos = comodosSalvos ? JSON.parse(comodosSalvos) : [];
                comodos.splice(rowIndex, 1);
                localStorage.setItem('comodos', JSON.stringify(comodos));

                verificarTabelaVazia();
            } else {
                console.log('A linha não existe na tabela.');
            }
        });
    });
}


function clearValues() {
    divError.style.display = 'none';
    verificarTabelaVazia()
    document.getElementById('local').value = '';
    document.getElementById('nivel2').value = '';
    document.getElementById('nivel5').value = '';
    document.getElementById('velocidade2').value = '';
    document.getElementById('velocidade5').value = '';
    document.getElementById('interferencia').value = '';
    editIndexInput.value = ''; // Limpa o índice da linha sendo editada
}

function showError(message) {
    divError.style.display = 'block';
    messageError.innerHTML = message;
}

function verificarTabelaVazia() {
    var table = document.getElementById('comodosTable');
    var tbody = table.getElementsByTagName('tbody')[0];
    var thead = table.getElementsByTagName('thead')[0];
    if (tbody.rows.length === 0) {
        // A tabela está vazia, oculta o cabeçalho e exibe uma mensagem
        thead.style.display = 'none';
        var message = document.createElement('h2');
        message.id = 'emptyMessage';
        message.textContent = 'Comece adicionando o primeiro cômodo.';
        table.parentNode.insertBefore(message, table.nextSibling);
    } else {
        // A tabela não está vazia, mostra o cabeçalho e remove a mensagem
        thead.style.display = 'table-header-group';
        var message = table.parentNode.querySelector('#emptyMessage');
        if (message) {
            message.parentNode.removeChild(message);
        }
    }
}

function showConfirmationModal(message, callbackYes, callbackNo) {
    var confirmationModal = document.getElementById("confirmationModal");
    var confirmationMessage = document.getElementById("confirmationMessage");
    var confirmYes = document.getElementById("confirmYes");
    var confirmNo = document.getElementById("confirmNo");

    confirmationMessage.textContent = message;

    confirmationModal.style.display = "block";

    //SIM
    confirmYes.addEventListener("click", function () {
        if (typeof callbackYes === "function") {
            callbackYes();
        }
        confirmationModal.style.display = "none";
    });

    //NÃO
    confirmNo.addEventListener("click", function () {
        if (typeof callbackNo === "function") {
            callbackNo();
        }
        confirmationModal.style.display = "none";
    });
}

var comodosSalvos = localStorage.getItem('comodos');
if (comodosSalvos) {
    var comodos = JSON.parse(comodosSalvos);
    comodos.forEach(function (comodo) {
        addRowToTable(comodo);
    });
}

clearValues(); // Verifica se a tabela está vazia e exibe a mensagem apropriada
