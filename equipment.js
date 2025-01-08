document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonEquip');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url == 'https://minesweeper.online/cn/equipment' || tab1[0].url == 'https://minesweeper.online/equipment') {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var equipStats = [
                            ['经验', '金币', '竞技场门票', '每日任务', '赛季任务', '任务等级', '竞技场币', '活跃度', '活动物品'],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉'],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0]
                        ]
                        var bonusIndex = [0, 1, '', 2, '', '', '', '', '', '', '', 
                                          3, 4, 5, '', '', '', '', 6, '', 7, 
                                          8, '', '', '', '', '', '', '', '', '', 
                                          10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
                        try {
                            let allStats = document.querySelector("#EquipmentBlock > div:nth-child(1) > div.pull-right > span:nth-child(3) > img");
                            hoverBox(allStats);      // 鼠标悬浮展开宝石数量
                            let list = document.querySelector("body > div.popover.fade.bottom.in > div.popover-content > div > div");

                            for (const item of list.children) {
                                const classText = item.classList.value;
                                if (classText.includes('bonus-')) {
                                    var bonusType = classText.match(/(\d+)/g)[0];
                                    var value = item.textContent.match(/[:：](.*)/)[1];
                                    equipStats[1 + 2 * (bonusIndex[bonusType] / 10 | 0)][bonusIndex[bonusType] % 10] = value;
                                }
                            }
                            console.log(equipStats);
                            chrome.runtime.sendMessage({ action: 'sendEquipStats', equipStats: equipStats });
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
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'sendEquipStats') {
        let equipStats = request.equipStats;
        console.log('收到装备加成：', equipStats);
        chrome.storage.local.set({ equipStats: equipStats });
        /* 按日期保存 */
        chrome.storage.local.get(['equipStatsMap'], function(result) {
            const equipStats = result.equipStatsMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            equipStats[newDate] = equipStats;
        
            // 保存更新后的数据
            chrome.storage.local.set({ equipStatsMap: equipStats });
        });

        document.getElementById('buttonEquip').style.backgroundColor = '#4caf50';
    }
});