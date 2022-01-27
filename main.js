'use strict';

let api_key = 'ff5b777d-752c-472d-8e32-50c047b11312';
let mainUrl = new URL('http://exam-2022-1-api.std-900.ist.mospolytech.ru');

let db;
let filteredDb;

async function getListCafe() {
    let url = new URL('/api/restaurants', mainUrl);
    url.searchParams.set('api_key', api_key);

    let response = await fetch(url);

    let json = await response.json();
    
    if (json.error) {
        showAlert(json.error);
    }
    else {
      return json;
    }

}
function loader(json) {
    db =sortByRating(json);
    filteredDb = db;
    renderCafeElement(db, 1);
    getFilterElement(db);
    pagination();

}
function sortByRating(json) {
    db = json.sort(function (elem1, elem2) {
        return elem2.rate-elem1.rate;
    })
    return db;
}

function renderCafeElement(cafeList, page=1) {

    let tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    
    for (let i = page * 20 - 20; i < page * 20; i++) {
    
        if (cafeList.length <= i) continue;
        let newCafeElement = document.getElementById('row-template').cloneNode(true);
        newCafeElement.querySelector('.cafe-name').innerHTML = cafeList[i].name;
        newCafeElement.querySelector('.cafe-type').innerHTML = cafeList[i].typeObject;
        newCafeElement.querySelector('.cafe-address').innerHTML = cafeList[i].address;
        newCafeElement.classList.remove('d-none');
        let btn = newCafeElement.querySelector('#btn-choice');
        btn.onclick = choiceBtnHandler; 
        btn.href = '#menu';

        tableBody.append(newCafeElement);

    }
}

function getFilterElement(db) {

    let admAreaList = new Set();
    let districtList = new Set();
    let typeObjectList = new Set();
    let socialPrivilegesList = new Set();

    for (let elem of db) {
        admAreaList.add(elem.admArea);
        districtList.add(elem.district);
        typeObjectList.add(elem.typeObject);
        socialPrivilegesList.add(elem.socialPrivileges);
    }

    renderFilterElement(admAreaList, '#admArea');
    renderFilterElement(districtList, '#district');
    renderFilterElement(typeObjectList, '#type');
    renderFilterElement(socialPrivilegesList, '#social');

}

function renderFilterElement(list, type) {
    let folder = document.querySelector(type);
    for (let unit of list) {
        if (unit == '') continue;
        let newOption = document.createElement('option');
        newOption.innerHTML = unit;
        folder.append(newOption);
    }
}

function choiceBtnHandler(event) {
    console.log('Hello')
}

function pagination() {
    document.querySelector("#last-pagination").dataset.page = Math.ceil(filteredDb.length / 20);
    let buttons = document.querySelectorAll(".page-link");

    for (let i = 1; i <= 3; i++) {
        if (buttons[i].classList.contains('d-none')) {
            buttons[i].classList.remove('d-none');
        }
        buttons[i].innerHTML = i;
        buttons[i].dataset.page = i;
        if (i > Math.ceil(filteredDb.length / 20)) {
            buttons[i].classList.add('d-none');
        }
    }


}
function pageBtnHandler(event) {
    if (filteredDb.length == 0) return;

    let page = event.target.dataset.page

    if (page) {
        renderCafeElement(filteredDb, page);
    }
    let buttons = document.querySelectorAll(".page-link");
    
    let maxPage = Math.ceil(filteredDb.length / 20)
    

    buttons[4].dataset.page = maxPage;

    if (page == 1) {
        for (let i = 1; i <= 3; i++) {
            buttons[i].innerHTML = i;
            buttons[i].dataset.page = i;

        }
    }
    else if (page == maxPage) {
        buttons[1].innerHTML = page - 2;
        buttons[1].dataset.page = page - 2;
        buttons[2].innerHTML = page - 1;
        buttons[2].dataset.page = page - 1;
        buttons[3].innerHTML = page;
        buttons[3].dataset.page = page;
    }
    else {
        buttons[1].innerHTML = page - 1;
        buttons[1].dataset.page = page - 1;
        buttons[2].innerHTML = page;
        buttons[2].dataset.page = page;
        buttons[3].innerHTML = page - (-1);
        buttons[3].dataset.page = page - (-1);
    }
}

function findBtnHandler(event) {
    filteredDb = []
    let form = event.target.closest('form');
    console.log('find');
    for (let i of db) {
        if ((form.elements['admArea'].value == 'Не задано' || 
            form.elements['admArea'].value == i.admArea) &&
            (form.elements['district'].value == 'Не задано' || 
            form.elements['district'].value == i.district) && 
            (form.elements['type'].value == 'Не задано' || 
            form.elements['type'].value == i.typeObject) &&
            (form.elements['social'].value == 'Не задано' || 
            form.elements['social'].value == i.socialPrivileges)) {
                filteredDb.push(i);
            }
    }
    pagination();
    renderCafeElement(filteredDb, 1);
    
}

function getCafeByAddress(address){
    return db.filter(
        function(db) {
            return db.address == address
        }
    );
}

function choiceBtnHandler(event) {
    let address = event.target.closest('tr').querySelector('.cafe-address');

    console.log(address);

    let cafe = getCafeByAddress(address.innerHTML);
    document.querySelector(`#set-1`).innerHTML = cafe[0].set_1;
    document.querySelector(`#set-2`).innerHTML = cafe[0].set_2;
    document.querySelector(`#set-3`).innerHTML = cafe[0].set_3;
    document.querySelector(`#set-4`).innerHTML = cafe[0].set_4;
    document.querySelector(`#set-5`).innerHTML = cafe[0].set_5;
    document.querySelector(`#set-6`).innerHTML = cafe[0].set_6;
    document.querySelector(`#set-7`).innerHTML = cafe[0].set_7;
    document.querySelector(`#set-8`).innerHTML = cafe[0].set_8;
    document.querySelector(`#set-9`).innerHTML = cafe[0].set_9;
    document.querySelector(`#set-10`).innerHTML = cafe[0].set_10;

}

function showAlert(msg, category='alert-danger') {
    let alertsContainer = document.querySelector('.alerts');
    let newAlertElement = document.getElementById('alerts-template').cloneNode(true);
    if (msg == undefined) {
        return;
    }
    newAlertElement.querySelector('.msg').innerHTML = msg;
    newAlertElement.classList.add(category);
    newAlertElement.classList.remove('d-none');
    alertsContainer.append(newAlertElement);
}
window.onload = function () {
    getListCafe()
        .then(loader)
        .catch(showAlert)
    

    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('#btn-find').onclick = findBtnHandler;
    document.querySelector('#btn-choice').onclick = choiceBtnHandler;
}