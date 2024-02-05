document.addEventListener('DOMContentLoaded', function () {
    loadRaffleTickets();
});

function registerRaffleTicket() {
    const name = document.getElementById('name').value;
    const ticketNumber = parseInt(document.getElementById('ticketNumber').value);
    const totalAmount = parseFloat(document.getElementById('totalAmount').value);

    if (!name || isNaN(ticketNumber) || isNaN(totalAmount)) {
        alert('Por favor, insira dados válidos.');
        return;
    }

    const raffleTicket = {
        name: name,
        ticketNumber: ticketNumber,
        totalAmount: totalAmount
    };

    saveRaffleTicket(raffleTicket);
    loadRaffleTickets();
    calculateTotalRegisteredMoney();
}

function saveRaffleTicket(raffleTicket) {
    let raffleTickets = JSON.parse(localStorage.getItem('raffleTickets')) || [];
    raffleTickets.push(raffleTicket);
    localStorage.setItem('raffleTickets', JSON.stringify(raffleTickets));
}

function loadRaffleTickets() {
    const raffleTicketList = document.getElementById('raffleTicketList');
    raffleTicketList.innerHTML = '';

    const raffleTickets = JSON.parse(localStorage.getItem('raffleTickets')) || [];

    raffleTickets.forEach((raffleTicket, index) => {
        const li = document.createElement('li');
        li.textContent = `${raffleTicket.name} - Bilhete #${raffleTicket.ticketNumber} - R$${raffleTicket.totalAmount.toFixed(2)}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.onclick = function () {
            removeRaffleTicket(index);
            loadRaffleTickets();
            calculateTotalRegisteredMoney();
        };

        const renameButton = document.createElement('button');
        renameButton.textContent = 'Renomear';
        renameButton.onclick = function () {
            const newName = prompt('Novo nome:');
            if (newName !== null) {
                raffleTicket.name = newName;
                saveRaffleTicketAtIndex(index, raffleTicket);
                loadRaffleTickets();
                calculateTotalRegisteredMoney();
            }
        };

        li.appendChild(removeButton);
        li.appendChild(renameButton);

        raffleTicketList.appendChild(li);
    });

    calculateTotalRegisteredMoney();
}

function removeRaffleTicket(index) {
    let raffleTickets = JSON.parse(localStorage.getItem('raffleTickets')) || [];
    raffleTickets.splice(index, 1);
    localStorage.setItem('raffleTickets', JSON.stringify(raffleTickets));
}

function saveRaffleTicketAtIndex(index, raffleTicket) {
    let raffleTickets = JSON.parse(localStorage.getItem('raffleTickets')) || [];
    raffleTickets[index] = raffleTicket;
    localStorage.setItem('raffleTickets', JSON.stringify(raffleTickets));
}

function calculateTotalRegisteredMoney() {
    const raffleTickets = JSON.parse(localStorage.getItem('raffleTickets')) || [];
    const totalRegisteredMoney = raffleTickets.reduce((sum, raffleTicket) => sum + raffleTicket.totalAmount, 0);
    document.getElementById('totalRegisteredMoney').textContent = totalRegisteredMoney.toFixed(2);
}

function manageHistory() {
    const raffleTickets = JSON.parse(localStorage.getItem('raffleTickets')) || [];
    if (raffleTickets.length === 0) {
        alert('Histórico vazio.');
        return;
    }

    const action = prompt('Digite "remover" para limpar o histórico ou "cancelar" para sair:');
    if (action !== null) {
        if (action.toLowerCase() === 'remover') {
            localStorage.removeItem('raffleTickets');
            loadRaffleTickets();
            calculateTotalRegisteredMoney();
        } else {
            alert('Ação inválida.');
        }
    }
}

function exportRaffleTickets() {
    const raffleTickets = JSON.parse(localStorage.getItem('raffleTickets')) || [];
    const jsonContent = JSON.stringify(raffleTickets, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'raffle_tickets.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importRaffleTickets() {
    const input = document.getElementById('importFile');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const content = event.target.result;
            const importedTickets = JSON.parse(content);

            if (Array.isArray(importedTickets)) {
                localStorage.setItem('raffleTickets', JSON.stringify(importedTickets));
                loadRaffleTickets();
                calculateTotalRegisteredMoney();
                alert('List imported successfully!');
            } else {
                alert('Invalid file format.');
            }
        };

        reader.readAsText(file);
    }
}
