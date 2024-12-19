import { client } from 'chain'
await client.start()

const getHistoryToken = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
            {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
              query loadHistoryToken {
                historyTokens(where: {
                tokenId: {contains: "${tokenId}"}, 
                createAt: ${filterTime ? `{gt: "${filterTime}"}` : `{}`}},
                orderBy: {createAt: desc}
                take: 1
                ) {
                  createAt
                  price
                  id
                }
              }
            `
                }),
            },
        );
        const data = await response.json();
    } catch {
    }
}
getHistoryToken()

document.addEventListener('DOMContentLoaded', () => {
    const filterItems = document.querySelectorAll('.item-filter-leader-board');
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            // Bỏ active cho tất cả các item
            filterItems.forEach(i => i.classList.remove('active-item-filter-leader-board'));
            // Đánh dấu item được chọn là active
            item.classList.add('active-item-filter-leader-board');
        });
    });
});

