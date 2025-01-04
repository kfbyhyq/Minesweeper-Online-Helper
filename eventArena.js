/* 页面显示 */
function displayEventArena() {
    let values = [0, 0, 0, 0, 0, 0, 0, 0]; // 初始化值
    let reward = [10, 25, 50, 100, 150, 200, 300, 400];
    chrome.storage.local.get(['eaPriceMap'], function(result) { // 从存储中读出总数据
        const eapMap = result.eaPriceMap || {}; // 确保存在数据，防止为 undefined
        // chrome.storage.local.set({ eaPriceMap: eapMap }); // 改数据用，正常情况勿启用
        console.log('历史活动竞技场门票价格:', eapMap);
        const dates = Object.keys(eapMap);
        if (dates.length > 0) {
            dates.sort((a, b) => Number(b) - Number(a));
            /* 显示最新数据 */
            values = eapMap[dates[0]];
            for (let i = 0; i < 8; i++) {
                document.getElementById(`value${i}`).innerText = values[i];
                document.getElementById(`eaRate${i}`).innerText = (values[i]/reward[i]).toFixed(2);
            }
            /* 显示每日数据 */
            var eapDaily = [['日期', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']];
            for (let i = 0; i < dates.length; i++) {
                var row = eapMap[dates[i]]
                row.unshift([dates[i].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")]);
                eapDaily.push(row);
            }
            displayMatrix(eapDaily, 'tableEa');    // 显示表格
        } else {
            const elements = document.querySelectorAll('.eaSet');
            // 将每个元素设置为不可见
            elements.forEach(element => {
                element.style.display = 'none';
            });
            document.getElementById('noEap').style.display = "block";
            document.getElementById('noEapDaily').style.display = "block";
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    displayEventArena();
});

function editText(index) {
    const div = document.querySelector(`.editable[data-index='${index}']`);
    const input = document.getElementById(`input${index}`);

    // 将显示的内容替换为输入框
    div.classList.add('hidden');
    // input.value = values[index]; // 将当前值设置为输入框的默认值
    input.classList.remove('hidden');

    // 聚焦到输入框
    input.focus();

    // 监听输入框的Enter/Escape键事件
    input.onkeydown = function(event) {
        if (event.key === 'Enter') {
            saveValue(index);
        } else if (event.key === 'Escape') {
            cancelEdit(index);
        }
    };
}

function saveValue(index) {
    const input = document.getElementById(`input${index}`);
    var priceInput = Number(input.value.trim());
    if (!isNaN(priceInput)) {
        chrome.storage.local.get(['eaPriceMap'], function(result) { // 从存储中读出总数据
            const eapMap = result.eaPriceMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const date = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            if (!eapMap[date]) { // 如果当前日期无条目，先新建
                eapMap[date] = new Array(8).fill(0);
            }
            eapMap[date][index] = priceInput; // 更新对应位置的数据
            chrome.storage.local.set({ eaPriceMap: eapMap }); // 保存更新后的数据
            console.log(eapMap);
        });
        values[index] = priceInput;
        // document.getElementById(`value${index}`).innerText = priceInput; // 更新显示的值
        // document.getElementById(`eaRate${index}`).innerText = (values[index]/reward[index]).toFixed(2);
        displayEventArena();
    }

    // 隐藏输入框并显示文本
    input.classList.add('hidden');
    document.querySelector(`.editable[data-index='${index}']`).classList.remove('hidden');
}

function cancelEdit(index) {
    const input = document.getElementById(`input${index}`);
    const valueSpan = document.querySelector(`.editable[data-index='${index}']`);

    // 隐藏输入框并显示文本
    input.classList.add('hidden');
    valueSpan.classList.remove('hidden');
}

// 初始化点击事件
document.querySelectorAll('.editable').forEach((div, index) => {
    div.onclick = function() {
        editText(index);
    };
});

// 保存按钮点击事件
document.getElementById("updateEa2").onclick = function() {
    chrome.storage.local.get(['eaPriceMap'], function(result) { // 从存储中读出总数据
        var count = 0;
        document.querySelectorAll('.editable').forEach((span, index) => {
            const input = document.getElementById(`input${index}`);
            if (!input.classList.contains('hidden')) { // 确保当前编辑的输入框也是保存状态
                count++;
                var priceInput = Number(input.value.trim());
                if (!isNaN(priceInput)) {
                    values[index] = priceInput;
                    document.getElementById(`value${index}`).innerText = priceInput; // 更新显示的值
                    document.getElementById(`eaRate${index}`).innerText = (values[index]/reward[index]).toFixed(2);
                }
                // 隐藏输入框并显示文本
                input.classList.add('hidden');
                document.querySelector(`.editable[data-index='${index}']`).classList.remove('hidden');
            }
        });
        if (count > 0) {
            const eapMap = result.eaPriceMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const date = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            eapMap[date] = values;
            chrome.storage.local.set({ eaPriceMap: eapMap }); // 保存更新后的数据
            console.log('保存条目：', date, values);
            setTimeout(() => {
                displayEventArena();
            }, 100);
        }
    });
};

/* 接收网页传回的数据 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var LMax = 8;       // 最大等级
    if (request.action === 'sendEventArenaPrice') {
        console.log('收到活动门票价格：', request.eaPrice);
        let eaPrice = request.eaPrice;
        chrome.storage.local.get(['eaPriceMap'], function(result) { // 从存储中读出总数据
            const eapMap = result.eaPriceMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const date = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            if (!eapMap[date]) { // 如果当前日期无条目，先新建
                eapMap[date] = new Array(8).fill(0);
            }
            for (let i = 0; i < LMax; i++) {
                if (eaPrice[1][i]) {
                    eapMap[date][i] = eaPrice[1][i];
                }
            }
            chrome.storage.local.set({ eaPriceMap: eapMap }); // 保存更新后的数据
        });
        document.getElementById('flagEa').textContent = 1;   // 设置成功标记
        // document.getElementById('buttonEa').style.backgroundColor = '#4caf50';
        setTimeout(() => {
            displayEventArena();
        }, 100);
    }
});

/* 自动刷新 */
document.getElementById('updateEa1').addEventListener('click', function () {
    document.getElementById('flagEa').textContent = 0;
    chrome.tabs.create({ url: 'https://minesweeper.online/cn/marketplace', active: false }, function (tab0) {
        const ti0 = tab0.id;
        recur(ti0);

        function recur(tabId) {
            var t0 = 10000;
            var t1 = 1000;
            setTimeout(() => {
                extract(tabId);
            }, t0);
            // setTimeout(() => {
            //     chrome.tabs.remove(tabId, function() {});
            // }, 3 * t0);
            var flag;
            var count = 1;
            var countMax = 60;
            checkInterval = setInterval(() => {
                flag = document.getElementById('flagEa').textContent;
                if (flag == 1 || count == countMax) {
                    clearInterval(checkInterval);
                    chrome.tabs.remove(tabId, function() {});
                } else {
                    count++;
                }
            }, t1);

            // var maxI = 10;
            // var t0 = 10000;
            // setTimeout(() => {
            //     extract(tabId);
            //     const flag = document.getElementById('flagEa').textContent;
            //     if (flag == 1 || i > maxI) {
            //         chrome.tabs.remove(tabId, function() {});
            //     } else {
            //         recur(tabId, i + 1);
            //     }
            // }, i * t0);
        }

        function extract(tabId) {
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var eaPrice = [
                        ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                        [0, 0, 0, 0, 0, 0, 0, 0]
                    ];
                    var t0 = 100;        // 等待间隔
                    var levelMax = 8;       // 最大等级
                    try {
                        function selectEventTicket(level) { // 选择市场中的单个门票条目
                            setTimeout(() => {
                                let levelMenu = document.querySelector(`#market_search_filters_left > span:nth-child(5) > ul > li:nth-child(${level + 2}) > a`);
                                levelMenu.click(); // 选择门票等级
                            }, t0 * 1);
                        }
                        function queryTicket() { // 查询当前页面最低价是否存在
                            let price = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                            let name = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(2) > span");
                            if (price && name) {
                                let queryResult = [name.textContent, price.textContent.replace(/ /g, "")];    // 删去可能的空格 1 200 -> 1200
                                return queryResult;
                            } else {
                                return null;
                            }
                        }
                        function queryProgress(level) { // 递归查询函数
                            selectEventTicket(level);
                            var count = 1;
                            var countMax = 40;
                            setTimeout(() => {
                                checkInterval = setInterval(() => { // 循环调用queryTicket查找是否有数据
                                    let queryResult = queryTicket();
                                    if (queryResult) {
                                        console.log('找到：L', level + 1, queryResult);
                                        clearInterval(checkInterval); // 查询成功后停止循环
                                        eaPrice[1][level] = queryResult[1];
                                        if (level == levelMax - 1) { // 已到达最后一张
                                            console.log(eaPrice);
                                            chrome.runtime.sendMessage({ action: 'sendEventArenaPrice', eaPrice: eaPrice });
                                        } else {
                                            queryProgress(level + 1); // 其他情况递归进入下一张票
                                        }
                                    } else if (count == countMax) {
                                        console.log('暂无L', level + 1, '票价');
                                        clearInterval(checkInterval); // 查询超时，停止循环
                                        eaPrice[1][level] = '无';
                                        if (level == levelMax - 1) { // 已到达最后一张
                                            console.log(eaPrice);
                                            chrome.runtime.sendMessage({ action: 'sendEventArenaPrice', eaPrice: eaPrice });
                                        } else {
                                            queryProgress(level + 1); // 其他情况递归进入下一张票
                                        }
                                    } else {
                                        count++;
                                        console.log('未找到：L', level + 1);
                                    }
                                }, t0);
                            }, t0 * 2);
                        }
                        let choice1 = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(4) > a");
                        choice1.click(); // 选择竞技场门票分类
                        setTimeout(() => {
                            let choice2 = document.querySelector("#market_search_filters_left > span:nth-child(4) > ul > li:nth-child(12) > a");
                            choice2.click(); // 选择活动竞技场
                        }, t0 * 20);
                        setTimeout(() => {
                            queryProgress(0);
                        }, t0 * 40);

                        // for (let L = 1; L <= LMax; L++) {
                        //     const ticket = document.querySelector(`#arena_content > table:nth-child(3) > tbody > tr:nth-child(${L}) > td.text-nowrap > span.help`);
                        //     if (!ticket) {
                        //         break;
                        //     }
                        //     setTimeout(() => {
                        //         hoverBox(ticket);
                        //     }, (L - 1) * t1);
                        //     setTimeout(() => {
                        //         for (let i = 0; i < LMax; i++) {
                        //             if (ticket.textContent == eaPrice[0][i]) {
                        //                 const price = document.querySelector(`#arena_content > table:nth-child(3) > tbody > tr:nth-child(${L}) > td.text-nowrap > div > div.popover-content > div > div:nth-child(6) > span`)
                        //                 eaPrice[1][i] = +price.textContent.replace(/ /g, "");
                        //             }
                        //         }
                        //     }, (L - 1) * t1 + 3 * t1);
                        // }
                        // setTimeout(() => {
                        //     console.log(eaPrice);
                        //     chrome.runtime.sendMessage({ action: 'sendEventArenaPrice', eaPrice: eaPrice });
                        // }, (LMax + 3) * t1);
                    } catch (e) {
                        console.error('错误页面', e);
                    }

                    /* 模拟鼠标悬浮在button */
                    function hoverBox(button) {
                        let event = new MouseEvent("mouseover", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: button.getBoundingClientRect().left + button.offsetWidth / 2,
                            clientY: button.getBoundingClientRect().top + button.offsetHeight / 2
                        });
                        button.dispatchEvent(event);
                    }
                }
            });
        }
    });
});
