document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('button1');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url == 'https://minesweeper.online/cn/marketplace' || tab1[0].url == 'https://minesweeper.online/marketplace') {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var priceMap = [
                            // ['Topaz', 'Ruby', 'Sapphire', 'Amethyst', 'Onyx', 'Aquamarine', 'Emerald', 'Garnet', 'Jade', 'Diamond'],
                            ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            // ['Gold coins', 'Copper coins', 'Silver coins', 'Nickel coins', 'Steel coins', 'Iron coins', 'Palladium coins', 'Titanium coins', 'Zinc coins', 'Platinum coins'],
                            ['金竞技场币', '铜竞技场币', '银竞技场币', '镍竞技场币', '钢竞技场币', '铁竞技场币', '钯竞技场币', '钛竞技场币', '锌竞技场币', '铂竞技场币'],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            // ['Rare parts', 'Unique parts', 'Legendary parts', 'Perfect parts'],
                            ['稀有碎片', '史诗碎片', '传说碎片', '完美碎片'],
                            [0, 0, 0, 0]
                        ];
                        try {
                            var Topaz = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                            priceMap[1][0] = Topaz.textContent;
                            var Ruby = document.querySelector("#stat_table_body > tr:nth-child(2) > td:nth-child(3)");
                            priceMap[1][1] = Ruby.textContent;
                            var Sapphire = document.querySelector("#stat_table_body > tr:nth-child(3) > td:nth-child(3)");
                            priceMap[1][2] = Sapphire.textContent;
                            var Amethyst = document.querySelector("#stat_table_body > tr:nth-child(4) > td:nth-child(3)");
                            priceMap[1][3] = Amethyst.textContent;
                            var Onyx = document.querySelector("#stat_table_body > tr:nth-child(5) > td:nth-child(3)");
                            priceMap[1][4] = Onyx.textContent;
                            var Aquamarine = document.querySelector("#stat_table_body > tr:nth-child(6) > td:nth-child(3)");
                            priceMap[1][5] = Aquamarine.textContent;
                            var Emerald = document.querySelector("#stat_table_body > tr:nth-child(7) > td:nth-child(3)");
                            priceMap[1][6] = Emerald.textContent;
                            var Garnet = document.querySelector("#stat_table_body > tr:nth-child(8) > td:nth-child(3)");
                            priceMap[1][7] = Garnet.textContent;
                            var Jade = document.querySelector("#stat_table_body > tr:nth-child(9) > td:nth-child(3)");
                            priceMap[1][8] = Jade.textContent;
                            var Diamond = document.querySelector("#stat_table_body > tr:nth-child(10) > td:nth-child(3)");
                            priceMap[1][9] = Diamond.textContent;
    
                            var Gold = document.querySelector("#stat_table_body > tr:nth-child(11) > td:nth-child(3)");
                            priceMap[3][0] = Gold.textContent;
                            var Copper = document.querySelector("#stat_table_body > tr:nth-child(12) > td:nth-child(3)");
                            priceMap[3][1] = Copper.textContent;
                            var Silver = document.querySelector("#stat_table_body > tr:nth-child(13) > td:nth-child(3)");
                            priceMap[3][2] = Silver.textContent;
                            var Nickel = document.querySelector("#stat_table_body > tr:nth-child(14) > td:nth-child(3)");
                            priceMap[3][3] = Nickel.textContent;
                            var Steel = document.querySelector("#stat_table_body > tr:nth-child(15) > td:nth-child(3)");
                            priceMap[3][4] = Steel.textContent;
                            var Iron = document.querySelector("#stat_table_body > tr:nth-child(16) > td:nth-child(3)");
                            priceMap[3][5] = Iron.textContent;
                            var Palladium = document.querySelector("#stat_table_body > tr:nth-child(17) > td:nth-child(3)");
                            priceMap[3][6] = Palladium.textContent;
                            var Titanium = document.querySelector("#stat_table_body > tr:nth-child(18) > td:nth-child(3)");
                            priceMap[3][7] = Titanium.textContent;
                            var Zinc = document.querySelector("#stat_table_body > tr:nth-child(19) > td:nth-child(3)");
                            priceMap[3][8] = Zinc.textContent;
                            var Platinum = document.querySelector("#stat_table_body > tr:nth-child(20) > td:nth-child(3)");
                            priceMap[3][9] = Platinum.textContent;
    
                            var Rare = document.querySelector("#stat_table_body > tr:nth-last-child(4) > td:nth-child(3)");
                            priceMap[5][0] = Rare.textContent.replace(/ /g, "");
                            var Unique = document.querySelector("#stat_table_body > tr:nth-last-child(3) > td:nth-child(3)");
                            priceMap[5][1] = Unique.textContent.replace(/ /g, "");
                            var Legendary = document.querySelector("#stat_table_body > tr:nth-last-child(2) > td:nth-child(3)");
                            priceMap[5][2] = Legendary.textContent.replace(/ /g, "");
                            var Perfect = document.querySelector("#stat_table_body > tr:nth-last-child(1) > td:nth-child(3)");
                            priceMap[5][3] = Perfect.textContent.replace(/ /g, "");
    
                            console.log(priceMap);
                            chrome.runtime.sendMessage({ action: 'sendGemsPrice', gemsPrice: priceMap });
    
                            // saveAsCsv(priceMap, '宝石实时价格.csv');
                        } catch (e) {
                            console.log(e);
                            window.alert('错误页面');
                        }
                        // function saveAsCsv(dataMap, filename) {
                        //     const csv = dataMap.map(row => row.join(',')).join('\n');
                        //     const blob = new Blob([csv], { type: 'text/csv', encoding: 'UTF-8' });
                        //     const url = URL.createObjectURL(blob);
                        //     const a = document.createElement('a');
                        //     a.style.display = 'none';
                        //     a.href = url;
                        //     a.download = filename;
                        //     document.body.appendChild(a);
                        //     a.click();
                        //     setTimeout(() => {
                        //         document.body.removeChild(a);
                        //         window.URL.revokeObjectURL(url);
                        //     }, 0);
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'sendGemsPrice') {
        let gemsPrice = request.gemsPrice;
        console.log('收到价格：', gemsPrice);   // 在控制台打出结果
        chrome.storage.local.set({ gemsPrice: gemsPrice });     // 保存数据
        /* 按日期保存 */
        chrome.storage.local.get(['gemsPriceMap'], function(result) {
            const gpMap = result.gemsPriceMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            gpMap[newDate] = gemsPrice;
        
            // 保存更新后的数据
            chrome.storage.local.set({ gemsPriceMap: gpMap });
        });

        document.getElementById('button1').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('button0');
    button.style.backgroundColor = '#a8dfff';
    button.style.cursor = 'pointer'; // 鼠标指针样式
    button.addEventListener('click', function() {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') }); // 打开主页
    });
});