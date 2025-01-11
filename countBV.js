document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonCountBV');
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
                            var countBoard = [];
                            var ops = 0;
                            var rows;
                            var cols;
    
                            countBV();
                            const area = document.querySelector("#AreaBlock");
                            // 配置观察选项:
                            const config = { attributes: true, childList: true, subtree: true };
                            // 创建一个观察器实例并传入回调函数
                            const callback = function(mutationsList, observer) {
                                countBV();
                            };
                            const observer = new MutationObserver(callback);
                            // 以上述配置开始观察目标节点
                            observer.observe(area, config);
                        } catch (e) {
                            console.log(e);
                            window.alert('未找到游戏');
                        }

                        function countBV() {
                            mineNum = 0;
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
                                            board[row][col] = -1;
                                            mineNum++;
                                        } else if (classText.includes('d_type10') || classText.includes('d_type11')) {
                                            board[row][col] = -1;
                                        } else if (classText.includes('d_closed') || classText.includes('d_pressed')) {
                                            board[row][col] = -1;
                                        } else if (classText.includes('d_type12')) {
                                            board[row][col] = -1;
                                            mineNum++;
                                        } else {
                                            let numType = classText.match(/type(\d+)/)[1];
                                            if (numType) {
                                                board[row][col] = numType;
                                            } else {
                                                board[row][col] = -1;
                                            }
                                        }
                                    }
                                    }
                            }
                            // console.log('当前版面：', board);
                            // console.log('总雷数：', mineNum);
                            /* 计算 */
                            rows = board.length;
                            cols = board[0].length;
                            // var countBoard = [];
                            ops = 0;
                            for (let i = 0; i < rows; i++) {
                                countBoard[i] = [];
                                for (let j = 0; j < cols; j++) {
                                    countBoard[i][j] = 0; // 未处理的格子标记为0
                                }
                            }
                            for (let i = 0; i < rows; i++) {
                                for (let j = 0; j < cols; j++) {
                                    judgeCell(i, j, 0);
                                }
                            }
                            // console.log('3BV划分：', countBoard);
                            var BVNow = ops;
                            var closeNum = 0;
                            for (let i = 0; i < rows; i++) {
                                for (let j = 0; j < cols; j++) {
                                    if (countBoard[i][j] == -1) {
                                        BVNow++;
                                    }
                                    if (board[i][j] == -1) {
                                        closeNum++;
                                    }
                                }
                            }
                            var BVPred = Math.round(BVNow / (1 - (closeNum - mineNum) / (rows * cols - mineNum)));
                            console.log('已完成3BV上限：', BVNow, ' 总3BV估计：', BVPred);
                            chrome.runtime.sendMessage({ action: 'count3BVResult', BVNow: BVNow, BVPred: BVPred });

                        }
                        function judgeCell(i, j, recur) {
                            if (board[i][j] < 0) { // 未打开的格子不管
                                return;
                            }
                            if (board[i][j] == 0) { // 是空
                                if (countBoard[i][j] == 0) { // 未处理过的空使用新编号
                                    ops++;
                                    countBoard[i][j] = ops;
                                } else if (!recur) { // 处理过的空，递归进入的需要处理，顶层进入的不重复处理
                                    return;
                                }
                                for (let ii = Math.max(i - 1, 0); ii <= Math.min(i + 1, rows - 1); ii++) {
                                    for (let jj = Math.max(j - 1, 0); jj <= Math.min(j + 1, cols - 1); jj++) {
                                        if (i != ii || j != jj) {
                                            childCell(ii, jj, countBoard[i][j]);
                                        }
                                    }
                                }
                            } else if (countBoard[i][j] == 0) { // 未处理过的非空先标记为-1
                                countBoard[i][j] = -1;
                            }
                        }
                        function childCell(i, j, opn) {
                            if (board[i][j] == 0) {
                                if (countBoard[i][j] == 0) { // 如果是未处理过的空，使用同一编号标记，递归
                                    countBoard[i][j] = opn;
                                    judgeCell(i, j, 1);
                                } // 如果是处理过的空，是来路，不用处理
                            } else if (board[i][j] > 0) { // 不是空，使用同一编号标记
                                countBoard[i][j] = opn;
                            }
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
    if (request.action === 'count3BVResult') {
        document.getElementById('countBVResult').innerHTML = '已完成3BV上限：' + request.BVNow + '<br>总3BV估计：' + request.BVPred;
        document.getElementById('countBVResult').style.display = 'block';
        document.getElementById('buttonCountBV').style.backgroundColor = '#4caf50';
    }
});

/* 初始化 */
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['advancedMode'], function(result) {
        if (!result.advancedMode) {
            document.getElementById('advMode').innerHTML = '';
        }
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     var advancedMode = 1;
//     chrome.storage.local.set({ advancedMode: advancedMode });
// });
