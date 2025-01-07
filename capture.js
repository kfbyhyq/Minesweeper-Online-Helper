document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonSave');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/cn/game/') || tab1[0].url.includes('https://minesweeper.online/game/')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        try {
                            var board = [];
                            var mineNum = 0;
    
                            const mineNum100 = document.querySelector("#top_area_mines_100").className;
                            const match100 = mineNum100.match(/top-area-num(\d+)$/);
                            if (match100) {
                                mineNum += parseInt(match100[1].slice(-1))*100;
                            }
                            const mineNum10 = document.querySelector("#top_area_mines_10").className;
                            const match10 = mineNum10.match(/top-area-num(\d+)$/);
                            if (match10) {
                                mineNum += parseInt(match10[1].slice(-1))*10;
                            }
                            const mineNum1 = document.querySelector("#top_area_mines_1").className;
                            const match1 = mineNum1.match(/top-area-num(\d+)$/);
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
                                        const classText = cell.classList.value;
                                        if (classText.includes('d_flag')) {
                                            board[row][col] = 'F';
                                            mineNum++;
                                        } else if (classText.includes('d_type10') || classText.includes('d_type11')) {
                                            board[row][col] = 'F';
                                        } else if (classText.includes('d_closed') || classText.includes('d_pressed')) {
                                            board[row][col] = 'H';
                                        } else if (classText.includes('d_type12')) {
                                            board[row][col] = 'H';
                                            mineNum++;
                                        } else {
                                            let numType = classText.match(/type(\d+)/)[1];
                                            if (numType) {
                                                board[row][col] = numType;
                                            } else {
                                                board[row][col] = 'H';
                                            }
                                        }
                                    }
                                    }
                            }
                            console.log(board);
                            console.log(mineNum);
                            const currentDate = new Date();
                            const year = currentDate.getFullYear();
                            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                            const day = String(currentDate.getDate()).padStart(2, '0');
                            const hours = String(currentDate.getHours()).padStart(2, '0');
                            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
                            const name = 'board-' + `${year}${month}${day}${hours}${minutes}${seconds}` + '.mine';
                            saveAsMine(board, mineNum, name);
                            chrome.runtime.sendMessage({ action: 'captured', capturedFlag: 1 });
                        } catch (e) {
                            console.log(e);
                            window.alert('未找到游戏');
                        }
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
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'captured') {
        document.getElementById('buttonSave').style.backgroundColor = '#4caf50';
    }
});