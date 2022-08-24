// importing other stuff, utility functions for:
// working with supabase:
import { checkAuth, 
    signOutUser, 
    createListItem, 
    readList, 
    boughtItem, 
    deleteList } from './fetch-utils.js';
// pure rendering (data --> DOM):

/*  "boiler plate" auth code */
// checking if we have a user! (will redirect to auth if not):
checkAuth();
// can optionally return the user:
// const user = checkAuth();

// sign out link:
const signOutLink = document.getElementById('sign-out-link');
signOutLink.addEventListener('click', signOutUser);
/* end "boiler plate auth code" */

// grab needed DOM elements on page:
const listEl = document.getElementById('list');
const formEl = document.getElementById('list-add');
const deleteBtn = document.getElementById('delete');
// const countInput = document.getElementById('count-input');
// const itemInput = document.getElementById('item-input');
// const submitInputs = document.getElementById('submit');
// local state:
let currentList = [];
displayList();

// display functions:

function renderList(list, literallyAnyFunction) {
    const div = document.createElement('div');
    const count = document.createElement('span');
    const name = document.createElement('span');
    
    list.bought ? div.classList.add('bought') : div.classList.remove('bought');
    list.bought ? div.classList.remove('list-item') : div.classList.add('list-item');
    div.classList.add('list-item');
    count.classList.add('count');
    name.classList.add('name');
    count.textContent = list.quantity;
    name.textContent = list.item;
    
    div.append(count, name);

    div.addEventListener('click', async () => {
        await literallyAnyFunction(list);
    });
    return div;
}

async function displayList() {
    listEl.innerHTML = '';
    currentList = await readList();
    
    for (let list of currentList) {
        const listItem = renderList(list, handleComplete);
        // listItem.textContent = list.item;
        listEl.append(listItem);
    }
}

async function handleComplete(item) {
    await boughtItem(item.id);
    currentList = await readList();
    displayList();
}


// events:
formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(formEl);
    const count = data.get('count');
    const name = data.get('item');
    await createListItem(name, count);
    formEl.reset();
    displayList();
});

deleteBtn.addEventListener('click', async () => {
    await deleteList();
    displayList();
});