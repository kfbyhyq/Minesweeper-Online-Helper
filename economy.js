document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonEco');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/') && tab1[0].url.includes('economy')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var personalEco = [
                            ['总财产', '装备', '金币', '宝石', '功勋点', '活动物品', '竞技场门票', '仓库', '装备碎片', '竞技场币', '代币', '今日增量'],
                            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
                        ];
                        try {
                            let myRank = document.querySelector("#stat_my_rank > a");
                            myRank.click();
                            setTimeout(() => {
                                let myRow = document.querySelector("#stat_table_body > tr.stat-my-row");
                                let value = myRow.querySelector("td:nth-child(3) > span.help.dotted-underline");
                                personalEco[1][0] = value.textContent;
                                hoverBox(value);
                                let dataDisp = myRow.querySelector("td:nth-child(3) > div > div.popover-content");
                                var data = dataDisp.innerHTML.split(/<[^>]*>/g);
                                for (let i = 0; i < data.length; i++) {
                                    for (let j = 1; j <= personalEco[0].length; j++) {
                                        if (data[i].includes(personalEco[0][j] + '：')) {
                                            var match = data[i].match(/：(.*)/);
                                            personalEco[1][j] = match[1];
                                            break;
                                        }
                                    }
                                }
                                let upArrow = document.querySelector("#stat_table_body > tr.stat-my-row > td:nth-child(3) > span.help.price-up > i");
                                hoverBox(upArrow);
                                let growth = document.querySelector("#stat_table_body > tr.stat-my-row > td:nth-child(3) > div > div.tooltip-inner");
                                personalEco[1][11] = growth.textContent;
                                console.log(personalEco);
                                chrome.runtime.sendMessage({ action: 'personalEconomy', personalEco: personalEco });
                            }, 2000);
                            
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
                        } catch (e) {
                            console.log(e);
                            window.alert('错误页面');
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
    if (request.action === 'personalEconomy') {
        let personalEco = request.personalEco;
        console.log('收到财产估值更新：', personalEco);   // 在控制台打出结果
        chrome.storage.local.set({ personalEco: personalEco });     // 保存数据
        /* 按日期保存 */
        chrome.storage.local.get(['personalEcoMap'], function(result) {
            const peMap = result.personalEcoMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            peMap[newDate] = personalEco;
        
            // 保存更新后的数据
            chrome.storage.local.set({ personalEcoMap: peMap });
        });

        document.getElementById('buttonEco').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
    }
});
