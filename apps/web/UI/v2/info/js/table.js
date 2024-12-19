export function renderTable(col, data) {

    const tableHead = document.querySelector("#dataTable thead tr");
    const tableBody = document.querySelector("#dataTable tbody");
  
    // create columns
    col.forEach((column) => {
      const th = document.createElement("th");
      th.innerHTML = `
              <div class="headerCell ${column.headerClass ? column.headerClass : ""}">
               ${
                 column.hasInfo
                   ? ` <div class="iconInfo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="10"
              viewBox="0 0 4 10"
              fill="currentColor"
            >
              <path
                d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                fill="currentColor"
              />
            </svg>
          </div>`
                   : ""
               }   ${column.title}
              </div>
          `;
      if (column.width) {
        th.style.width = `${column.width}px`;
      }
      if (tableHead) {
        tableHead.appendChild(th);
      } else {
        console.error("tableHead not found");
      }
    });
  
    // create rows
    data?.forEach((record) => {
      const tr = document.createElement("tr");
      tr.classList.add("tableRow");
      col.forEach((column) => {
        const td = document.createElement("td");
        td.classList.add("tableTd");
        // Add class from colClassname if present
        if (column.colClassname) {
          td.classList.add(column.colClassname);
        }
  
        // Check if column has a render function
        if (column.render) {
          td.innerHTML = column.render(record[column.dataIndex], record);
        } else {
          td.textContent = record[column.dataIndex];
        }
  
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const tableWrapper = document.querySelector('.tableWrapper');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    tableWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        tableWrapper.classList.add('grabbing');
        startX = e.pageX - tableWrapper.offsetLeft;
        scrollLeft = tableWrapper.scrollLeft;
    });

    tableWrapper.addEventListener('mouseleave', () => {
        isDown = false;
        tableWrapper.classList.remove('grabbing');
    });

    tableWrapper.addEventListener('mouseup', () => {
        isDown = false;
        tableWrapper.classList.remove('grabbing');
    });

    tableWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - tableWrapper.offsetLeft;
        const walk = (x - startX) * 1; // Điều chỉnh tốc độ kéo nếu cần
        tableWrapper.scrollLeft = scrollLeft - walk;
    });
});

  