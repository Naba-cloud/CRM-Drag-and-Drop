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
          notes: value.notes ? value.notes : [],
        });
      });
    });
};

(() => {
  fetchedData();
})();

const handleTogglePariority = (id, key) => {
  console.log(key);
  document.getElementById(id).classList.toggle("active");
  const index = obj[key].findIndex((value) => value.id === id.split("-")[1]);
  obj[key][index].status = obj[key][index].status === "low" ? "high" : "low";
};

const handleRender = () => {
  const render = document.getElementById("render");
  render.innerHTML = "";
  let html = "";

  Object.keys(obj).forEach((key) => {
    html += `<div class="column">
    <h1 class="board-name text-center">${key}</h1>`;
    obj[key].forEach((value, index) => {
      html += `<div class="board-card">
        <div class="top-info">
            <h4 class="user-name">${value.first_name}</h4>
            <h4 class="user-job">${value.job}</h4>
            <h4 class="user-updated">Updated: ${value.lastUpdated}</h4>
            <p class="note">${value.notes}</p>
            <div class="actions">
            <i
                class="fa fa-fire fire-icon active"
                id="card-${value.id}"
                aria-hidden="true"
                onclick="handleTogglePariority('card-${value.id}', '${value.status}')"
            ></i>
            <i class="fas fa-sticky-note note-icon mx-2"></i>
            </div>
            <div class="follow-btn-section mt-3">
            <button class="btn btn-primary w-100">Follow</button>
            </div>
        </div>
        </div>`;
    });
    html += `</div>`;
  });
  render.innerHTML = html;
};

handleRender();
