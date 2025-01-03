document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('buttonEa');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url == 'https://minesweeper.online/cn/arena' || tab1[0].url == 'https://minesweeper.online/arena') {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var eaPrice = [
                            ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                            [0, 0, 0, 0, 0, 0, 0, 0]
                        ];
                        var t1 = 500;        // 等待间隔
                        var LMax = 8;       // 最大等级
                        try {
                            for (let L = 1; L <= LMax; L++) {
                                const ticket = document.querySelector(`#arena_content > table:nth-child(3) > tbody > tr:nth-child(${L}) > td.text-nowrap > span.help`);
                                if (!ticket) {
                                    break;
                                }
                                setTimeout(() => {
                                    hoverBox(ticket);
                                }, (L - 1) * t1);
                                setTimeout(() => {
                                    for (let i = 0; i < LMax; i++) {
                                        if (ticket.textContent == eaPrice[0][i]) {
                                            const price = document.querySelector(`#arena_content > table:nth-child(3) > tbody > tr:nth-child(${L}) > td.text-nowrap > div > div.popover-content > div > div:nth-child(6) > span`)
                                            eaPrice[1][i] = +price.textContent.replace(/ /g, "");
                                        }
                                    }
                                }, (L - 1) * t1 + 3 * t1);
                            }
                            setTimeout(() => {
                                console.log(eaPrice);
                                chrome.runtime.sendMessage({ action: 'sendEventArenaPrice', eaPrice: eaPrice });
                                // saveAsCsv(eaPrice, '活动门票价格.csv');
                            }, (LMax + 3) * t1);
                        } catch (error) {
                            console.log(error);
                            window.alert('错误页面');
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
    
                        function saveAsCsv(dataMap, filename) {
                            const csv = dataMap.map(row => row.join(',')).join('\n');
                            const blob = new Blob([csv], { type: 'text/csv', encoding: 'UTF-8' });
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
    var LMax = 8;       // 最大等级
    if (request.action === 'sendEventArenaPrice') {
        let eaPrice = request.eaPrice;
        console.log('收到活动门票价格：', eaPrice);
        chrome.storage.local.get(['eaPriceMap'], function(result) { // 从存储中读出总数据
            const eapMap = result.eaPriceMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const date = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            if (!eapMap[date]) { // 如果当前日期无条目，先新建
                eapMap[date] = new Array(8).fill(0);
            }
            for (let i = 0; i < LMax; i++) {
                if (eaPrice[1][i] > 0) {
                    eapMap[date][i] = eaPrice[1][i];
                }
            }
            chrome.storage.local.set({ eaPriceMap: eapMap }); // 保存更新后的数据
        });
        document.getElementById('buttonEa').style.backgroundColor = '#4caf50';
    } 
});

document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    if ((currentDate.getUTCMonth() + 1) % 4 != 1) {
        document.getElementById("event1").style.display = 'none';
    }
});