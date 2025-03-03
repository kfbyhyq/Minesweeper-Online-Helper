document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('button1');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/') && tab1[0].url.includes('marketplace')) {
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
                            [0, 0, 0, 0],
                            ['完美T', '完美R', '完美S', '完美A', '完美O', '完美Q', '完美E', '完美G', '完美J', '完美D'],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        ];
                        var chsGemName = ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'];
                        var enGemName = [
                            ['Topaz', 'Ruby', 'Sapphire', 'Amethyst', 'Onyx', 'Aquamarine', 'Emerald', 'Garnet', 'Jade', 'Diamond'],
                            ['topaz', 'ruby', 'sapphire', 'amethyst', 'onyx', 'aquamarine', 'emerald', 'garnet', 'jade', 'diamond']
                        ];
                        var t0 = 100;
                        var tm = 10;
                        try {
                            let category0 = document.querySelector("#category_dropdown");
                            if (category0.textContent == '分类：全部' || category0.textContent == 'Category: Best offers') {
                                queryGems();
                            } else {
                                let cateAll = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(1) > a");
                                cateAll.click();
                                cateAllQuery = setInterval(() => {
                                    let testItem = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)")
                                    if (testItem) {
                                        clearInterval(cateAllQuery);
                                        queryGems();
                                    }
                                }, t0);
                            }
                            // saveAsCsv(priceMap, '宝石实时价格.csv');
                        } catch (e) {
                            console.log(e);
                            window.alert('错误页面');
                        }
                        // 查询宝石场币碎片
                        function queryGems() {
                            for (let t = 0; t < tm; t++) {
                                priceMap[1][t] = document.querySelector(`#stat_table_body > tr:nth-child(${t + 1}) > td:nth-child(3)`).textContent;
                                priceMap[3][t] = document.querySelector(`#stat_table_body > tr:nth-child(${t + 11}) > td:nth-child(3)`).textContent;
                            }
                            for (let i = 0; i < 4; i++) {
                                priceMap[5][i] = document.querySelector(`#stat_table_body > tr:nth-last-child(${4 - i}) > td:nth-child(3)`).textContent.replace(/ /g, "");
                            }
                            setTimeout(() => {
                                let liParts = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(6) > a");
                                liParts.click();
                                let liPerParts = document.querySelector("#market_search_filters_left > span:nth-child(4) > ul > li:nth-child(5) > a");
                                liPerParts.click();
                                queryPerPartsProgress(0);
                            }, t0);
                        }
                        // 递归查询完美碎片
                        function queryPerPartsProgress(type) {
                            let liType = document.querySelector(`#market_search_filters_left > span:nth-child(5) > ul > li:nth-child(${type + 2}) > a`);
                            liType.click();
                            perPartsTypeQuery = setInterval(() => {
                                let itemName = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(2) > span > span");
                                if (itemName && (itemName.textContent.includes(chsGemName[type]) || itemName.textContent.includes(enGemName[1][type]))) {
                                    clearInterval(perPartsTypeQuery);
                                    let itemPrice = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                                    priceMap[7][type] = itemPrice.textContent.replace(/ /g, "");
                                    if (type < tm - 1) { // 查找下一个
                                        queryPerPartsProgress(type + 1);
                                    } else { // type == 9 为最后一个，输出结果
                                        console.log(priceMap);
                                        chrome.runtime.sendMessage({ action: 'sendGemsPrice', gemsPrice: priceMap });
                                    }
                                }
                            }, t0);
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