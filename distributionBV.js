document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonDistributionBV');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url == 'https://minesweeper.online/cn/my-games' || tab1[0].url == 'https://minesweeper.online/my-games') {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        try {
                            var BVDistribution = [['Index', 'Time', 'NF', '3BV', '3BV/s', 'Eff', 'Date', 'Id', 'Link', 'Complete']];
                            var maxI = 10; // 一页最多十条
                            const dateFormatChs = /(\d{4})年\s+(\d{1,2})月\s+(\d{1,2})日,\s+(\d{2}):(\d{2})/; // 匹配 "2025年 1月 1日, 00:00"
                            const dateFormatEn = /(\d{1,2})\s+(\w+)\s+(\d{4}),\s+(\d{2}):(\d{2})/; // 匹配 "1 January 2025, 00:00"
                            const todayChs = /今天,\s+(\d{2}):(\d{2})/i; // 匹配 "今天, 01:01"
                            const todayEn = /Today,\s+(\d{2}):(\d{2})/i; // 匹配 "Today, 01:01"
                            
                            var pageNum = 1; // 录入页码
                            var t0 = 50;
                            var t1 = 10;
                            var level = 0;
                            const beg = document.querySelector("#level_select_1");
                            const int = document.querySelector("#level_select_2");
                            const exp = document.querySelector("#level_select_3");
                            if (beg.classList.contains('active')) {
                                level = 1;
                            } else if (int.classList.contains('active')) {
                                level = 2;
                            } else if (exp.classList.contains('active')) {
                                level = 3;
                            }
                            BVInterval = setInterval(() => {
                                const pageActive = document.querySelector("#stat_pagination > li.page.active");
                                if (pageActive) { // 有翻页标记，多页
                                    if (pageActive.textContent == pageNum) { // 当前页码等于录入页码
                                        const firstInd = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(1)").textContent;
                                        if (+firstInd == pageNum * 10 - 9) { // 确认页码正确，防延迟
                                            for (let i = 1; i <= maxI; i++) {
                                                const ind = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(1)`).textContent;
                                                if (ind > 0) {
                                                    if (!BVDistribution[ind]) {
                                                        BVDistribution[ind] = ['', '', '', '', '', '', '', ''];
                                                        BVDistribution[ind][0] = ind;
                                                        BVDistribution[ind][1] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2)`).textContent;
                                                        let nf = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(3)`).textContent;
                                                        let icon = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td.text-center > span > i`);
                                                        if (nf.includes('NF')) {
                                                            BVDistribution[ind][2] = 1;
                                                        } else {
                                                            BVDistribution[ind][2] = 0;
                                                        }
                                                        let bv = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(4)`).textContent;
                                                        if (bv.includes(' / ')) {
                                                            BVDistribution[ind][3] = bv.match(/ \/ (\d+)/)[1];
                                                            BVDistribution[ind][9] = 0;
                                                        } else {
                                                            BVDistribution[ind][3] = bv;
                                                            if (icon && icon.classList.contains('fa-rotate-right')) {
                                                                BVDistribution[ind][9] = 0;
                                                            } else {
                                                                BVDistribution[ind][9] = 1;
                                                            }
                                                        }
                                                        BVDistribution[ind][4] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(5)`).textContent;
                                                        BVDistribution[ind][5] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(6)`).textContent;
                                                        const date = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(7)`).textContent;
                                                        let match; // 统一日期格式
                                                        const currentDate = new Date();
                                                        const year = currentDate.getFullYear();
                                                        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                                                        const day = String(currentDate.getDate()).padStart(2, '0');
                                                        let formattedToday = `${year}/${month}/${day}`;
                                                        if ((match = date.match(dateFormatEn))) {
                                                            const [, day, month, year, hours, minutes] = match;
                                                            const monthMap = {
                                                                January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                                                                July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
                                                            };
                                                            const monthNumber = monthMap[month];
                                                            BVDistribution[ind][6] =  `${year}/${String(monthNumber + 1).padStart(2, '0')}/${String(day).padStart(2, '0')} ${hours}:${minutes}`;
                                                        } else if ((match = date.match(dateFormatChs))) {
                                                            const [, year, month, day, hours, minutes] = match;
                                                            BVDistribution[ind][6] = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${hours}:${minutes}`;
                                                        } else if ((match = date.match(todayEn))) {
                                                            const [, hours, minutes] = match;
                                                            BVDistribution[ind][6] = `${formattedToday} ${hours}:${minutes}`;
                                                        } else if ((match = date.match(todayChs))) {
                                                            const [, hours, minutes] = match;
                                                            BVDistribution[ind][6] = `${formattedToday} ${hours}:${minutes}`;
                                                        } else { // 中英文匹配失败用原文
                                                            BVDistribution[ind][6] = date;
                                                        }
                                                        BVDistribution[ind][7] = document.querySelector(`#stat_table_body > tr:nth-child(${i})`).id.match(/row_(\d+)/)[1];
                                                        BVDistribution[ind][8] = 'https://minesweeper.online/cn/game/' + BVDistribution[ind][7];
                                                    }
                                                } else { // 已不足十条，为最后一页
                                                    break;
                                                }
                                            }
                                            pageNum++;
                                            const pageLastDisabled = document.querySelector("#stat_pagination > li.last.disabled");
                                            if (pageLastDisabled) { // 没有下一页说明到达最后一页
                                                clearInterval(BVInterval);
                                                setTimeout(() => {
                                                    console.log(BVDistribution);
                                                    chrome.runtime.sendMessage({ action: 'sendBVDistribution', BVDistribution: BVDistribution, level: level });
                                                    saveAsCsv(BVDistribution, 'BVDistribution.csv');
                                                }, t1);
                                            } else { // 否则翻页
                                                setTimeout(() => {
                                                    const pageNext = document.querySelector("#stat_pagination > li.next");
                                                    pageNext.click();
                                                }, t1);
                                            }
                                        }
                                    } else if (pageActive.textContent < pageNum) { // 页码落后于录入页码就翻页
                                        setTimeout(() => {
                                            const pageNext = document.querySelector("#stat_pagination > li.next");
                                            pageNext.click();
                                        }, t1);
                                    } else if (pageActive.textContent > pageNum) { // 页码领先于录入页面就回到第一页
                                        setTimeout(() => {
                                            const pageFirst = document.querySelector("#stat_pagination > li.first");
                                            pageFirst.click();
                                        }, t1);
                                    }
                                } else { // 无页码，只有一页
                                    for (let i = 1; i <= maxI; i++) {
                                        const ind = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(1)`).textContent;
                                        if (ind > 0) {
                                            if (!BVDistribution[ind]) {
                                                BVDistribution[ind] = ['', '', '', '', '', '', '', ''];
                                                BVDistribution[ind][0] = ind;
                                                BVDistribution[ind][1] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2)`).textContent;
                                                let nf = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(3)`).textContent;
                                                let icon = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td.text-center > span > i`);
                                                if (nf.includes('NF')) {
                                                    BVDistribution[ind][2] = 1;
                                                } else {
                                                    BVDistribution[ind][2] = 0;
                                                }
                                                let bv = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(4)`).textContent;
                                                if (bv.includes(' / ')) {
                                                    BVDistribution[ind][3] = bv.match(/ \/ (\d+)/)[1];
                                                    BVDistribution[ind][9] = 0;
                                                } else {
                                                    BVDistribution[ind][3] = bv;
                                                    if (icon && icon.classList.contains('fa-rotate-right')) {
                                                        BVDistribution[ind][9] = 0;
                                                    } else {
                                                        BVDistribution[ind][9] = 1;
                                                    }
                                                }
                                                BVDistribution[ind][4] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(5)`).textContent;
                                                BVDistribution[ind][5] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(6)`).textContent;
                                                const date = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(7)`).textContent;
                                                let match;
                                                const currentDate = new Date();
                                                const year = currentDate.getFullYear();
                                                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                                                const day = String(currentDate.getDate()).padStart(2, '0');
                                                let formattedToday = `${year}/${month}/${day}`;
                                                if ((match = date.match(dateFormatEn))) {
                                                    const [, day, month, year, hours, minutes] = match;
                                                    const monthMap = {
                                                        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                                                        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
                                                    };
                                                    const monthNumber = monthMap[month];
                                                    BVDistribution[ind][6] =  `${year}/${String(monthNumber + 1).padStart(2, '0')}/${String(day).padStart(2, '0')} ${hours}:${minutes}`;
                                                } else if ((match = date.match(dateFormatChs))) {
                                                    const [, year, month, day, hours, minutes] = match;
                                                    BVDistribution[ind][6] = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${hours}:${minutes}`;
                                                } else if ((match = date.match(todayEn))) {
                                                    const [, hours, minutes] = match;
                                                    BVDistribution[ind][6] = `${formattedToday} ${hours}:${minutes}`;
                                                } else if ((match = date.match(todayChs))) {
                                                    const [, hours, minutes] = match;
                                                    BVDistribution[ind][6] = `${formattedToday} ${hours}:${minutes}`;
                                                } else {
                                                    BVDistribution[ind][6] = date;
                                                }
                                                BVDistribution[ind][7] = document.querySelector(`#stat_table_body > tr:nth-child(${i})`).id.match(/row_(\d+)/)[1];
                                                BVDistribution[ind][8] = 'https://minesweeper.online/cn/game/' + BVDistribution[ind][7];
                                            }
                                        } else {
                                            break;
                                        }
                                    }
                                    clearInterval(BVInterval);
                                    setTimeout(() => {
                                        console.log(BVDistribution);
                                        chrome.runtime.sendMessage({ action: 'sendBVDistribution', BVDistribution: BVDistribution, level: level });
                                        saveAsCsv(BVDistribution, 'BVDistribution.csv');
                                    }, t1);
                                }
                            }, t0);
                        } catch (e) {
                            console.log(e);
                            window.alert('错误页面');
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
    if (request.action === 'sendBVDistribution') {
        let BVDistribution = request.BVDistribution;
        let level = request.level;
        console.log('收到3BV分布：', BVDistribution);   // 在控制台打出结果
        document.getElementById('buttonDistributionBV').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        if (level) { // 不考虑自定义
            chrome.storage.local.get(['BVMap', 'pbOfBV'], function(result) {
                const BVMap = result.BVMap || {};
                const pbOfBV = result.pbOfBV || {};
                // const BVMap = {};
                // const pbOfBV = {};
                if (!BVMap[level]) {
                    BVMap[level] = {};
                }
                if (!pbOfBV[level]) {
                    pbOfBV[level] = {};
                }
                for (let i = 1; i < BVDistribution.length; i++) {
                    if (BVDistribution[i][9]) {
                        const id = BVDistribution[i][7];
                        const bv = BVDistribution[i][3];
                        if (!BVMap[level][id]) {
                            BVMap[level][id] = BVDistribution[i].slice(1);
                            if (pbOfBV[level][bv]) {
                                pbOfBV[level][bv][0]++;
                                if (+BVDistribution[i][1] < +pbOfBV[level][bv][1]) {
                                    pbOfBV[level][bv][1] = BVDistribution[i][1];
                                    pbOfBV[level][bv][2] = id;
                                }
                                if (+BVDistribution[i][4] > +pbOfBV[level][bv][3]) {
                                    pbOfBV[level][bv][3] = BVDistribution[i][4];
                                    pbOfBV[level][bv][4] = id;
                                }
                                if (+(BVDistribution[i][5].replace('%','')) > +(pbOfBV[level][bv][5].replace('%',''))) {
                                    pbOfBV[level][bv][5] = BVDistribution[i][5];
                                    pbOfBV[level][bv][6] = id;
                                }
                            } else {
                                pbOfBV[level][bv] = [1, BVDistribution[i][1], id, BVDistribution[i][4], id, BVDistribution[i][5], id];
                            }
                        }
                    }
                }
                console.log(BVMap);
                console.log(pbOfBV);
                chrome.storage.local.set({ BVMap: BVMap });
                chrome.storage.local.set({ pbOfBV: pbOfBV });
            });
        }
    }
});
