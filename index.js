let allItems = [];
let nextId = 1;

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let itemObj = {
    id: nextId,
    itemName: document.getElementById("add-item-input").value,
    isCompleted: false,
  };
  nextId++;
  document.getElementById("add-item-input").value = "";
  allItems.push(itemObj);
  localStorage.setItem("AllItemsList", JSON.stringify(allItems));
  console.warn("added", { allItems });
  handleAllClick();
});

const generateAllItems = (arr) => {
  let returnString = "";
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const isChecked = item.isCompleted ? "checked" : "";
    const itemStyle = item.isCompleted ? "text-decoration: line-through;" : "";
    returnString += `<li class="todo-items">
        <input type="checkbox" class="todo-item-checkbox" data-id="${item.id}" onclick="handleCheckboxClick(event,'all')" ${isChecked} />
        <span style="${itemStyle}">${item.itemName}</span>
      </li>`;
  }
  return returnString;
};

const generateActiveItems = (arr) => {
  let returnString = "";
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].isCompleted) {
      const item = arr[i];
      const isChecked = item.isCompleted ? "checked" : "";
      const itemStyle = item.isCompleted
        ? "text-decoration: line-through;"
        : "";
      returnString += `<li class="todo-items">
        <input type="checkbox" class="todo-item-checkbox" data-id="${item.id}" onclick="handleCheckboxClick(event,'active')" ${isChecked} />
        <span style="${itemStyle}">${item.itemName}</span>
      </li>`;
    }
  }
  return returnString;
};

const generateCompletedItems = (arr) => {
  let returnString = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isCompleted) {
      const item = arr[i];
      returnString += `<li class="todo-items">
        <div class="todo-items-completed">
          <span style="text-decoration: line-through;">${item.itemName}</span>
          <i class="ri-delete-bin-6-line" data-id="${item.id}" onclick="handleDeleteItemClick(event)"></i>
        </div>
      </li>`;
    }
  }
  returnString += `<div class="delete-all-super-container">
  <div class="delete-all-container">
    <button class="delete-all" id="delete-all">
      <i class="ri-delete-bin-6-line"></i> delete all
    </button>
  </div>
</div>`;
  return returnString;
};

const displayAllItems = (arr) => {
  document.querySelector("item-list").innerHTML = `
<ul class="todo-item-list">
${generateAllItems(arr)}
</ul>`;
};

const displayActiveItems = (arr) => {
  document.querySelector("item-list").innerHTML = `
<ul class="todo-item-list">
${generateActiveItems(arr)}
</ul>`;
};

const displayCompletedItems = (arr) => {
  document.querySelector("item-list").innerHTML = `
    <div style="display:flex;justify-content:center;">
      <ul class="todo-item-list" style="top:184px;position:absolute;">
        ${generateCompletedItems(arr)}
      </ul>
    </div>`;
};

function handleAllClick() {
  console.log("All clicked");
  displayAllItems(allItems);
  document.getElementById("todo-form").classList.remove("hidden");
}

function handleActiveClick() {
  console.log("Active clicked");
  displayActiveItems(allItems);
  document.getElementById("todo-form").classList.remove("hidden");
}

function handleCompletedClick() {
  console.log("Completed clicked");
  displayCompletedItems(allItems);
  document.getElementById("todo-form").classList.add("hidden");
}

document
  .getElementById("menu-item-all")
  .addEventListener("click", handleAllClick);
document
  .getElementById("menu-item-active")
  .addEventListener("click", handleActiveClick);
document
  .getElementById("menu-item-completed")
  .addEventListener("click", handleCompletedClick);

function handleCheckboxClick(event, calledFrom) {
  const checkbox = event.target;
  const itemId = checkbox.getAttribute("data-id");
  const item = allItems.find((item) => item.id == itemId);

  if (item) {
    item.isCompleted = !item.isCompleted;
    localStorage.setItem("AllItemsList", JSON.stringify(allItems));
    console.log(
      `Checkbox with ID ${itemId} clicked. New isCompleted value: ${item.isCompleted}`
    );
    if (calledFrom === "all") {
      handleAllClick();
    } else if (calledFrom === "active") {
      handleActiveClick();
    }
  }
}

function handleDeleteItemClick(event) {
  const icon = event.target;
  const itemId = icon.getAttribute("data-id");

  const itemIndex = allItems.findIndex((item) => item.id == itemId);
  if (itemIndex !== -1) {
    allItems.splice(itemIndex, 1);
    localStorage.setItem("AllItemsList", JSON.stringify(allItems));
    console.log(`Deleted item with ID ${itemId}`);
    handleCompletedClick();
  }
}

document.querySelectorAll(".ri-delete-bin-6-line").forEach((icon) => {
  icon.addEventListener("click", handleDeleteItemClick);
});

// Add an event listener to the document for the click event and delegate it
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-all")) {
    handleDeleteAllClick();
  }
});

function handleDeleteAllClick() {
  allItems = allItems.filter((item) => !item.isCompleted);
  console.log("delete-all function triggered");
  localStorage.setItem("AllItemsList", JSON.stringify(allItems));
  displayCompletedItems(allItems);
}
