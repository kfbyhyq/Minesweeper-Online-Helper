document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('buttonSave').addEventListener('click', function () {
        const button = document.getElementById('buttonSave');
        button.style.backgroundColor = '#4caf50';
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var board = [];
                    var mineNum = 0;

                    const mineNum100 = document.querySelector("#top_area_mines_100").className;
                    const match100 = mineNum100.match(/hd_top-area-num(\d+)$/);
                    if (match100) {
                        mineNum += parseInt(match100[1].slice(-1))*100;
                    }
                    const mineNum10 = document.querySelector("#top_area_mines_10").className;
                    const match10 = mineNum10.match(/hd_top-area-num(\d+)$/);
                    if (match10) {
                        mineNum += parseInt(match10[1].slice(-1))*10;
                    }
                    const mineNum1 = document.querySelector("#top_area_mines_1").className;
                    const match1 = mineNum1.match(/hd_top-area-num(\d+)$/);
                    if (match1) {
                        mineNum += parseInt(match1[1].slice(-1));
                    }

                    const area = document.querySelector("#AreaBlock");
                    if (area) {
                        for (const cell of area.children) {
                            if (cell.classList.contains('cell')) {
                                const id = cell.id;
                                const nums = id.match(/(\d+)/g);
                                const row = parseInt(nums[1]);
                                const col = parseInt(nums[0]);
                                if (!board[row]) {
                                    board[row] = [];
                                }
                                if (cell.classList.contains('hd_flag')) {
                                    board[row][col] = 'F';
                                    mineNum++;
                                } else if (cell.classList.contains('hd_closed')) {
                                    board[row][col] = 'H';
                                } else {
                                    board[row][col] = cell.classList.item(cell.classList.length - 1).slice(-1);
                                }
                              }
                            }
                    }
                    console.log(board);
                    console.log(mineNum);
                    saveAsMine(board, mineNum, 'board.mine');

                    function saveAsMine(board, mineNum, filename) {
                        let text = board[0].length + 'x' + board.length + 'x' + mineNum + '\n';
                        for (let i = 0; i < board.length; i++) {
                            for (let j = 0; j < board[i].length; j++) {
                                text += board[i][j];
                            }
                            text += '\n';
                        }
                        const blob = new Blob([text], { type: 'text/plain', encoding: 'UTF-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                        }, 0);
                    }
                }
            });
        });
    });
});
