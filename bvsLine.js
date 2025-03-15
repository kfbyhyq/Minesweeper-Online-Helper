document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonBvsLine');
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
    
                            var bvMap = {};
                            var clickNum = 0;
                            var bvsData = []; // 存每一秒的bvs

                            var bvResult = countBV();
                            bvMap[bvResult.join('')] = 1;
                            let chartEleNew = document.createElement('canvas'); // 创建折线图区域
                            chartEleNew.id = 'displayChart';
                            chartEleNew.style.width = '800px';
                            chartEleNew.style.height = '400px';
                            game.insertAdjacentElement('afterend', chartEleNew);

                            const area = document.querySelector("#AreaBlock");
                            // 配置观察选项:
                            const config = { attributes: true, childList: true, subtree: true };
                            // 创建一个观察器实例并传入回调函数
                            const callback = function(mutationsList, observer) {
                                bvResult = countBV();
                                if (bvResult[0] == 0) {
                                    bvMap = {};
                                }
                                bvMap[bvResult.join('')] = 1;
                                clickNum = Object.keys(bvMap).length - 1;
                                let chart = document.querySelector("#displayChart");
                                if (bvResult[0] == 0) {
                                    bvsData = [];
                                    const ctx = chart.getContext('2d');
                                    ctx.fillStyle = 'rgb(255,255,255)';
                                    ctx.fillRect(0, 0, chart.width, chart.height);
                                } else {
                                    var timeNum = 0;
                                    const timeNum100 = document.querySelector("#top_area_time_100").className;
                                    const match100 = timeNum100.match(/top-area-num(\d+)$/);
                                    if (match100) {
                                        timeNum += parseInt(match100[1].slice(-1))*100;
                                    }
                                    const timeNum10 = document.querySelector("#top_area_time_10").className;
                                    const match10 = timeNum10.match(/top-area-num(\d+)$/);
                                    if (match10) {
                                        timeNum += parseInt(match10[1].slice(-1))*10;
                                    }
                                    const timeNum1 = document.querySelector("#top_area_time_1").className;
                                    const match1 = timeNum1.match(/top-area-num(\d+)$/);
                                    if (match1) {
                                        timeNum += parseInt(match1[1].slice(-1));
                                    }
                                    if (timeNum > 0 && !bvsData[timeNum - 1]) {
                                        if (timeNum > bvsData.length) {
                                            for (let i = bvsData.length; i < timeNum - 1; i++) {
                                                bvsData[i] = bvsData[i - 1];
                                            }
                                        }
                                        bvsData[timeNum - 1] = bvResult[0];
                                    }
                                    if (bvsData.length > 0) {
                                        var data = [
                                            Array.from({ length: bvsData.length }, (_, t) => t + 1),
                                            bvsData.map((bv, t) => bv / (t + 1))
                                        ];
                                        console.log(data);
                                        drawLineChart(chart, data);
                                    }
                                }
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
                                        if (classText.includes('_flag')) {
                                            board[row][col] = -2;
                                            mineNum++;
                                        } else if (classText.includes('_type10') || classText.includes('_type11')) {
                                            board[row][col] = -1;
                                        } else if (classText.includes('_closed') || classText.includes('_pressed')) {
                                            board[row][col] = -1;
                                        } else if (classText.includes('_type12')) {
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
                            var opCellNum = 0;
                            var flagNum = 0;
                            for (let i = 0; i < rows; i++) {
                                for (let j = 0; j < cols; j++) {
                                    if (countBoard[i][j] == -1) {
                                        BVNow++;
                                    } else if (countBoard[i][j] > 0) {
                                        opCellNum++;
                                    }
                                    if (board[i][j] == -1) {
                                        closeNum++;
                                    } else if (board[i][j] == -2) {
                                        closeNum++;
                                        flagNum++;
                                    }
                                }
                            }
                            var BVPred = Math.round(BVNow / (1 - (closeNum - mineNum) / (rows * cols - mineNum)));
                            return [BVNow, BVPred, flagNum];
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
                        function drawLineChart(ele, data) {

                            // 设置 Canvas 的分辨率（与显示尺寸一致）
                            const displayWidth = ele.clientWidth;  // 获取 CSS 设置的宽度
                            const displayHeight = ele.clientHeight; // 获取 CSS 设置的高度
                            ele.width = displayWidth * window.devicePixelRatio;  // 考虑设备像素比
                            ele.height = displayHeight * window.devicePixelRatio;

                            // 设置 Canvas 的 CSS 尺寸（确保与分辨率一致）
                            ele.style.width = `${displayWidth}px`;
                            ele.style.height = `${displayHeight}px`;

                            const ctx = ele.getContext('2d');
                            ctx.fillStyle = 'rgb(255,255,255)';
                            ctx.fillRect(0, 0, ele.width, ele.height);

                            // 数据
                            const dataX = data[0];
                            const dataY = data[1];

                            // 画布尺寸
                            const width = ele.width;
                            const height = ele.height;
                            const padding = 40; // 边距

                            // 计算比例
                            const maxValue = Math.max(...dataY);
                            const xScale = (width - padding * 2) / (dataY.length - 1);
                            const yScale = (height - padding * 2) / maxValue;
                            
                            ctx.font = '16px Arial';
                            ctx.fillStyle = 'rgb(0, 0, 0)';
                            // 绘制折线
                            var strideSetting = 40;
                            var stride = Math.floor((dataX.length / strideSetting)) + 1; // 步幅
                            ctx.beginPath();
                            ctx.moveTo(padding, height - padding - dataY[0] * yScale); // 起点
                            dataY.forEach((value, index) => {
                                const x = padding + index * xScale;
                                const y = height - padding - value * yScale;
                                ctx.lineTo(x, y); // 画线
                                if (dataX[index] % stride == 0) {
                                    ctx.fillText(dataX[index], x, height - padding + 15); // 标签
                                    ctx.fillText(value.toFixed(2), x - 10, y - 10); // 数据点值
                                }
                            });
                            ctx.strokeStyle = 'rgb(0, 76, 255)';
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // 绘制坐标轴
                            ctx.beginPath();
                            ctx.moveTo(padding, height - padding); // X 轴
                            ctx.lineTo(width - padding, height - padding);
                            ctx.moveTo(padding, height - padding); // Y 轴
                            ctx.lineTo(padding, padding);
                            ctx.strokeStyle = 'rgb(24, 24, 24)';
                            ctx.lineWidth = 2; // 坐标轴线条宽度
                            ctx.stroke();
                            ctx.fillText('秒', width - padding / 2, height - padding * 0.2);
                            ctx.fillText('3BV/秒', padding * 0.3, padding * 0.4);
                        }
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});

