const obj = {};

const handleAddNewColumn = (colName) => {
  console.log(colName);
  obj[colName] = [];
  handleRender();
};
const handleAddNewProperty = (property) => {
  obj[property.status] = [property, ...obj[property.status]];
  handleRender();
};

const handleAddNewNote = (id, key) => {
  const note = document.getElementById(`text-${key}-${obj[key][id].id}`).value;
  console.log(id);
  obj[key][id].notes.unshift(note);
  handleRender();
};

const handleDeleteProperty = (id, key) => {
  console.log(id, key);

  const index = obj[key].findIndex((value) => value.id === id);
  obj[key].splice(index, 1);

  handleRender();
};

const fetchedData = () => {
  fetch(
    "https://erp.manaknightdigital.com/v1/api/sale/customer/list/0?per_page_sort=1000"
  )
    .then((res) => res.json())
    .then((res) => {
      res.item.forEach((value) => {
        if (!Object.keys(obj).includes(value.status)) {
          handleAddNewColumn(value.status);
        }
      });

      res.item.forEach((value) => {
        handleAddNewProperty({
          id: value.id,
          first_name: value.first_name,
          job: value.job ? value.job : "No Job",
          lastUpdated: value.contact_date,
          status: value.status,
          notes: value.notes !== undefined ? value.notes : [],
        });
      });
    });
};

(() => {
  fetchedData();
})();

// dragging
let draggableCard = null;

function dragStart(e, element) {
  draggableCard = element;
  console.log("dragStart");
}

function dragEnd() {
  draggableCard = null;
  console.log("dragEnd");
}
function dragOver(e) {
  e.preventDefault();
  console.log("dragOver");
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave(e) {
  console.log("dragLeave");
  e.preventDefault();
}

function dragDrop(e, element) {
  e.preventDefault();
  console.log(e, "here");
  console.log(element);

  element.append(draggableCard);

  // place the elemnt
  const id = draggableCard.id.split("-")[1];
  const key = draggableCard.id.split("-")[0].split("_").join(" ");
  // find the object with the id and change the status
  const oldObj = obj[key].find((value) => value.id === id);
  console.log(oldObj);

  //   const index = obj[key].findIndex((value) => value.id === id);
  const newKey = element.children[0].innerText;
  oldObj.status = newKey;
  console.log(oldObj);
  obj[newKey].push(oldObj);

  // remove the old object
  const index = obj[key].findIndex((value) => value.id === id);
  obj[key].splice(index, 1);
  handleRender();
}

const handleTogglePariority = (id, key) => {
  console.log(key);
  document.getElementById(id).classList.toggle("active");
  const index = obj[key].findIndex((value) => value.id === id.split("-")[1]);
  obj[key][index].status = obj[key][index].status === "low" ? "high" : "low";
};

const handleShowNotes = (id) => {
  handleHideNotes();
  handleHideMenu();

  const notes = document.getElementById(`note-${id}`);
  notes.style.display = "block";
};

const handleHideNotes = () => {
  document.querySelectorAll(".add-new-notes-container").forEach((value) => {
    value.style.display = "none";
  });
};

const handleShowMenu = (id, key) => {
  handleHideNotes();

  handleHideMenu();
  const menu = document.getElementById(`menu-${key}-${id}`);
  menu.style.display = "block";
};

const handleHideMenu = () => {
  document.querySelectorAll(".menu-container").forEach((value) => {
    value.style.display = "none";
  });
};

const handleRender = () => {
  const render = document.getElementById("render");
  render.innerHTML = "";
  let html = "";

  Object.keys(obj).forEach((key) => {
    html += `<div class="column" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondragenter="dragEnter(event)" ondrop="dragDrop(event,this)">
    <h1 class="board-name text-center">${key}</h1>`;
    obj[key].forEach((value, index) => {
      html += `<div class="board-card" id="${value.status
        .split(" ")
        .join("_")}-${
        value.id
      }" draggable="true" ondragstart="dragStart(event,this)" ondragend=dragEnd()>
        <div class="top-info">
            <h4 class="user-name">${value.first_name}</h4>
            <h4 class="user-job">${value.job}</h4>
            <h4 class="user-updated">Updated: ${value.lastUpdated}</h4>
            <p class="note">${value.notes.slice(0, 1)}</p>
            <div class="actions">
      
            <i
                class="fa fa-fire fire-icon"
                id="card-${value.id}"
                aria-hidden="true"
                onclick="handleTogglePariority('card-${value.id}', '${
        value.status
      }')"
            ></i>
            <i class="fas fa-sticky-note note-icon mx-2" onclick="handleShowNotes('${
              value.id
            }')"></i>
            <div class="notes-section">
            <div class="add-new-notes-container shadow" id="note-${value.id}" >
              <div class="add-notes-box">
                <div class="form-group">
                <i class="far fa-times-circle note-close" onclick="handleHideNotes()"></i>
                  <label for="">Enter Notes</label>
                  <input
                    type="text"
                    class="form-control"
                    name=""
                    id="text-${value.status}-${value.id}"
                    aria-describedby="helpId"
                    placeholder=""
                  />
                </div>
                <button
                  class="add-new-notes-btn btn btn-primary btn-block"
                  onclick="handleAddNewNote('${index}', '${value.status}')"
                >
                  Add
                </button>
              </div>
              
              <div class="previous-notes">
              `;
      obj[key][index].notes.forEach((value) => {
        html += `<p class="individual-note">
                  ${value}
                    </p>`;
      });
      html += `</div>
     
    

    </div>
   
      </div>
      <div class="menu" >
      <i class="fas fa-ellipsis-v menu-icon" onclick="handleShowMenu('${value.id}','${value.status}')"></i>
      <div class="menu-container shadow" id="menu-${value.status}-${value.id}">
        <div class="menu-item d-flex align-items-center">
          <p class="m-0">Edit</p>
        </div>
        <div class="menu-item" onclick="handleDeleteProperty('${value.id}','${value.status}')">
          <p class="m-0">Delete</p>
        </div>
      </div>
    </div>
      </div>
      <div class="follow-btn-section mt-3">

      <div class="form-group">
      <label for="">Next Followup</label>
      <input
        type="date"
        class="form-control"
        name=""
        id=""
        aria-describedby="helpId"
        placeholder=""
      />
    </div>
      </div>
  </div>
  </div>`;
    });
    html += `</div>`;
  });
  render.innerHTML = html;
};

window.onclick = (event) => {
  if (!event.target.matches(".menu-icon")) {
    handleHideMenu();
  }
};
