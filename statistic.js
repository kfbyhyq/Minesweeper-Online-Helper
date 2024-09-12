document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('button5').addEventListener('click', function () {
        const button = document.getElementById('button5');
        button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    if (window.location.href === 'https://minesweeper.online/cn/statistics') {
                        window.alert('错误页面');
                        return;
                    }
                    var statistics = [
                        ['总局数', '胜局数', '总耗时', '完成的任务', '完成的竞技场', '已解决3BV', '经验', '金币', '宝石', '竞技场门票', '活跃度', '活动物品', '竞技场币'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ];
                    try {
                        var totalGames = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(1)");
                        statistics[1][0] = totalGames.textContent.replace(/ /g, "");
                        var totalWins = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(3)");
                        statistics[1][1] = totalWins.textContent.replace(/ /g, "");
                        var totalTime = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(5)");
                        statistics[1][2] = totalTime.textContent.replace(/ /g, "");
                        var quests = document.querySelector("#aggregate > div > div:nth-child(1) > span:nth-child(7)");
                        statistics[1][3] = quests.textContent.replace(/ /g, "");
                        var arenas = document.querySelector("#aggregate > div > div:nth-child(1) > span:nth-child(9)");
                        statistics[1][4] = arenas.textContent.replace(/ /g, "");
                        var bv = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(11)");
                        statistics[1][5] = bv.textContent.replace(/ /g, "");
                        var experience = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(1)");
                        statistics[1][6] = experience.textContent.replace(/ /g, "");
                        var minecoins = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(3)");
                        statistics[1][7] = minecoins.textContent.replace(/ /g, "");
                        var gems = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(5) > span > span");
                        statistics[1][8] = gems.textContent.replace(/ /g, "");
                        var tickets = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(7)");
                        statistics[1][9] = tickets.textContent.replace(/ /g, "");
                        var activity = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(9)");
                        statistics[1][10] = activity.textContent.replace(/ /g, "");
                        var eventPoints = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(11)");
                        statistics[1][11] = eventPoints.textContent.replace(/ /g, "");
                        var arenaCoins = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(13) > span > span");
                        statistics[1][12] = arenaCoins.textContent.replace(/ /g, "");
                        
                        console.log(statistics);
                        chrome.runtime.sendMessage({ action: 'sendStatistics', statistics: statistics });

                        // saveAsCsv(statistics, '游戏数据.csv');
                    } catch (e) {
                        window.alert('错误页面');
                        // console.error('错误页面', e);
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
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'sendStatistics') {
        let statistics = request.statistics;
        console.log('收到游戏数据：', statistics);
        chrome.storage.local.set({ statistics: statistics });
        /* 按日期保存 */
        chrome.storage.local.get(['statisticsMap'], function(result) {
            const stMap = result.statisticsMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const newDate = currentDate.getFullYear() + String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
            // 更新数据
            stMap[newDate] = statistics;
        
            // 保存更新后的数据
            chrome.storage.local.set({ statisticsMap: stMap });
        });

        document.getElementById('button5').style.backgroundColor = '#4caf50';
    } 
});