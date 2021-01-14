document.addEventListener("DOMContentLoaded", function(event){
    const alertListagem = document.querySelector('#alertListagem');
    alertListagem.style.display = 'none';
    
    const alertCadastro = document.querySelector('#alertCadastro');
    alertCadastro.style.display = 'none';

    const divListagem = document.getElementById("divListagem");

    const divCadastro = document.getElementById("divCadastro");
    divCadastro.style.display = "none";

    loadDatabase()
    .then(clientes => updateTable(clientes))
    .catch(error => alert(`Ocorreu um erro ao carregar os clientes: ${error}`));
    
    document.getElementById("btnListar").onclick = (evt) => {
        divListagem.style.display = "block";
        divCadastro.style.display = "none";
    }
    document.getElementById("btnCadastrar").onclick = (evt) => {
        divListagem.style.display = "none";
        divCadastro.style.display = "block";
    }

    const frmCadastro = document.getElementById("frmCadastro");
    frmCadastro.onsubmit = (evt) => {
        evt.preventDefault();

        if(!document.querySelector('input[name="nome"]').value){
            exibirMensagem('#alertCadastro', '<strong>Erro!</strong> Nome é obrigatório!');
            return false;
        }
        var data = new FormData(frmCadastro) ;
        updateDatabase(data)
            .then(result => {
                const cliente = result;
                
                exibirMensagem('#alertListagem', `<strong>Sucesso!</strong> Cliente ${cliente.nome} cadastrado com sucesso!`);
                updateTable(cliente);
            })
            .catch(error => alert(`Ocorreu um erro:${error}`));       
        
    }
}); // End of DOMContentLoaded

function exibirMensagem(selector, html){
    let alertListagem = document.querySelector(selector);
    alertListagem.innerHTML = html;
    alertListagem.style.display = 'block';
    setTimeout(() => alertListagem.style.display = 'none', 2000);
}

function updateTable(clientes){
    let linha ="";
    if(!Array.isArray(clientes)) clientes = [clientes]; // if the clientes is a string "rodrigo", then it will change it to ["rodrigo"]. It becomes an array

    for (const cliente of clientes) {
        linha += `<tr><td>${cliente.nome}</td><td>${cliente.idade}</td><td>${cliente.uf}
        </td><td><input type="button" value="X" data-id="${cliente.id}" class="btn btn-danger"/></td></tr>`;
    } 

    const tbody = document.querySelector('table > tbody');
    if (tbody.querySelectorAll('tr > td').length === 1) {
        tbody.innerHTML = "";
    }
    console.log(linha);
    tbody.innerHTML += linha;
    divListagem.style.display = "block";
    divCadastro.style.display = "none";

    frmCadastro.reset();

    const buttons = document.querySelectorAll("input[value='X']");
    for(let btn of buttons){            
        if(btn.onclick !== null) continue;    //if button alredy have an event        
        btn.onclick = (evt) => {
            if(confirm("Tem certeza que deseja excluir este cliente?")){
                deleteDatabase(btn.getAttribute('data-id'))
                    .then(result => {
                        exibirMensagem('#alertListagem', 'Cliente excluido com sucesso!');
                        btn.closest('tr').remove();
                    })
                    .catch(error => alert(`Ocorreu um erro ao excluir o cliente:${error}`))

                
            }
        }
    }
} // End of updateTable

const webApiDomain = 'http://localhost:3000'
async function updateDatabase(data){
    const json = {};
    for(let item of data)
        json[item[0]] = item[1];

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch(`${webApiDomain}/clientes`, {
                            headers,
                            method: 'POST',
                            body: JSON.stringify(json)
                        });
    return await response.json();    
}

async function loadDatabase(){
    const response = await fetch(`${webApiDomain}/clientes`);
    return await response.json();
}
async function deleteDatabase(id){
    const response = await fetch(`${webApiDomain}/clientes/${id}`,{
        method:'DELETE'
    });
    return await response.json();
}