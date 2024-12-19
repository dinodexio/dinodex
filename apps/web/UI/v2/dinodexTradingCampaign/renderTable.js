const dataLeaderBoard = [
    {
        id: 1,
        rank: 1,
        change_rank: 1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: 12,
        pnl_24h: 111.251,
    },
    {
        id: 2,
        rank: 2,
        change_rank: -1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: -6,
        pnl_24h: 111.251,
    },
    {
        id: 3,
        rank: 3,
        change_rank: 4,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: 3,
        pnl_24h: 111.251,
    },
    {
        id: 4,
        rank: 4,
        change_rank: -1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: 2,
        pnl_24h: 111.251,
    },
    {
        id: 5,
        rank: 5,
        change_rank: -1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: -7,
        pnl_24h: 111.251,
    },
    {
        id: 6,
        rank: 6,
        change_rank: null,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: 4,
        pnl_24h: 111.251,
    },
    {
        id: 7,
        rank: 7,
        change_rank: 1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: -1,
        pnl_24h: 111.251,
    },
    {
        id: 8,
        rank: 8,
        change_rank: 1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: 9,
        pnl_24h: 111.251,
    },
    {
        id: 9,
        rank: 9,
        change_rank: 1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: 6,
        pnl_24h: 111.251,
    },
    {
        id: 10,
        rank: 10,
        change_rank: 1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: -24,
        pnl_24h: 111.251,
    },
    {
        id: 11,
        rank: 11,
        change_rank: 1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: 11,
        pnl_24h: 111.251,
    },
    {
        id: 12,
        rank: 12,
        change_rank: 1,
        address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
        total_vol: 111.251,
        vol_24h: 111.251,
        change_24h: -12,
        pnl_24h: 111.251,
    },
];

function fetchDataLeaderBoard() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dataLeaderBoard);
        }, 0); // Giả lập độ trễ 1 giây
    });
}

function generateRandomAddress() {
    const prefix = "B62";
    const generatePart = (length) =>
        Array.from({ length }, () =>
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
                Math.floor(Math.random() * 62),
            ),
        ).join("");

    const start = generatePart(3); // 3 random characters after the prefix
    const end = generatePart(6); // 6 random characters for the suffix

    return `${prefix}${start}...${end}`;
}

function randomDescendingValues(length, max) {
    const values = Array.from({ length }, () => Math.random() * max);

    return values.sort((a, b) => b - a);
}

let columnTableLeaderBoard = [
    {
        id: 1,
        title: "Wallet Address",
        key: "wallet-address",
        width: 250,
        render: (data, cell) => {
            cell.querySelector(".wallet-content").innerHTML = `
            ${data.rank === 1 || data.rank === 2 || data.rank === 3 ? `<img src=${data.rank === 1 ? "../assets/images/campaign/rank-1.svg" : data.rank === 2 ? "../assets/images/campaign/rank-2.svg" : "../assets/images/campaign/rank-3.svg"} alt="${data.rank}" class="rank-${data.rank}-img"/>` : `<span class="rank-user">${data.rank}</span>`}
                <div class="change-rank">
                        <img src="${data.change_rank < 0 ? `../assets/images/campaign/sort-down.svg` : `../assets/images/campaign/sort-up.svg`}" alt="change-rank" />
                    <span class="text-change-rank ${data.change_rank < 0 ? "red-text" : "green-text"}">
                        ${data.change_rank > 0 ? `+${data.change_rank}` : data.change_rank < 0 ? `${data.change_rank}` : 0}
                    </span>
                </div>
                <span class="address-wallet">${generateRandomAddress()}</span>
            `;
        },
    },
    {
        id: 2,
        title: `Total Volume`,
        key: "total-volume",
        width: 135,
        render: (data, cell) => {
            if (!window.randomizedTotalVol) {
                const randomDescendingValues = (length, max) => {
                    const values = Array.from({ length }, () => Math.random() * max);
                    return values.sort((a, b) => b - a);
                };

                const maxVolume = 10000;
                window.randomizedTotalVol = randomDescendingValues(
                    dataLeaderBoard.length,
                    maxVolume,
                );

                dataLeaderBoard.forEach((item, index) => {
                    item.total_vol = window.randomizedTotalVol[index];
                });
            }

            cell.querySelector(".total-vol .text-total-vol").textContent =
                data.total_vol.toFixed(3);
            const $changeVol = cell.querySelector(".total-vol .change-vol");
            $changeVol.textContent = `${data.change_24h < 0 ? data.change_24h : `+${data.change_24h}`}%`;
            const classChangeVol = $changeVol.classList;
            classChangeVol.add(data.change_24h < 0 ? "red-text" : "green-text");
        },
    },
    {
        id: 3,
        title: `PnL%`,
        key: "pnl",
        width: 135,
        render: (data, cell) => {
            if (!window.randomized24hPnl) {

                const randomDescendingValues = (length, max) => {
                    const values = Array.from({ length }, () => Math.random() * max);
                    return values.sort((a, b) => b - a);
                };

                const maxVolume = 500;
                window.randomized24hPnl = randomDescendingValues(
                    dataLeaderBoard.length,
                    maxVolume,
                );

                dataLeaderBoard.forEach((item, index) => {
                    item.pnl_24h = window.randomized24hPnl[index];
                });
            }
            cell.querySelector(".total-vol .text-total-vol").textContent =
                data.pnl_24h.toFixed(3);
            const $changeVol = cell.querySelector(".total-vol .change-vol");
            $changeVol.textContent = `${data.change_24h < 0 ? data.change_24h : `+${data.change_24h}`}%`;
            const classChangeVol = $changeVol.classList;
            classChangeVol.add(data.change_24h < 0 ? "red-text" : "green-text");
        },
    },
];

function renderTable(col, data) {
    const tableHead = document.querySelector("#dataTable thead");
    const tableBody = document.querySelector("#dataTable tbody");

    const templateHeader = document.getElementById("template-header");
    const headerTable = templateHeader.content.cloneNode(true);
    const cellHeader = headerTable.querySelectorAll("th");
    // create columns
    col.forEach((column, index) => {
        let th = cellHeader[index];
        th.classList.add(column.key);
        th.querySelector(".text-header .header-table-total-vol span").textContent =
            column.title;
        th.querySelector(".text-header").classList.add(`text-header-${column.key}`);
        if (column.width) {
            th.style.minWidth = `${column.width}px`;
        }
    });
    tableHead.appendChild(headerTable);

    // create rows
    data?.forEach((record) => {
        const template = document.getElementById("template-row");
        const rowTable = template.content.cloneNode(true);
        // const row = document.createElement('tr');
        let td = rowTable.querySelectorAll("td");
        rowTable.querySelector("tr").className = "table-tr";
        col.forEach((column, index) => {
            const cell = td[index];
            column.render(record, cell);
            cell.className = `table-td table-td-${column.key}`;
        });
        tableBody.appendChild(rowTable);
    });
}
function renderTableBasedOnMenuToken() {
    const tableWrapper = document.getElementById("tableWrapper");
    let isDown = false;
    let startX;
    let scrollLeft;

    tableWrapper.addEventListener("mousedown", (e) => {
        isDown = true;
        tableWrapper.classList.add("grabbing");
        startX = e.pageX - tableWrapper.offsetLeft;
        scrollLeft = tableWrapper.scrollLeft;
    });

    tableWrapper.addEventListener("mouseleave", () => {
        isDown = false;
        tableWrapper.classList.remove("grabbing");
    });

    tableWrapper.addEventListener("mouseup", () => {
        isDown = false;
        tableWrapper.classList.remove("grabbing");
    });

    tableWrapper.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - tableWrapper.offsetLeft;
        const walk = (x - startX) * 1; // Điều chỉnh tốc độ kéo nếu cần
        tableWrapper.scrollLeft = scrollLeft - walk;
    });
}

fetchDataLeaderBoard().then((data) => {
    // Gọi hàm renderTable với dữ liệu đã lấy
    renderTable(columnTableLeaderBoard, data);
});
