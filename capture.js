document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('buttonSave').addEventListener('click', function () {
        const button = document.getElementById('buttonSave');
        button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var board = [];
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
                                } else if (cell.classList.contains('hd_closed')) {
                                    board[row][col] = 'H';
                                } else {
                                    board[row][col] = cell.classList.item(cell.classList.length - 1).slice(-1);
                                }
                              }
                            }
                    }
                    console.log(board);
                    saveAsMine(board, 'board.mine');

                    function saveAsMine(board, filename) {
                        let text = '30x16x99\n';
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
