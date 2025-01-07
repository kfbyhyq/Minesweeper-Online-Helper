document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonEquip');
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
                        try {
                            var equipmentInfo = [['装备名称', '系列', '质量', '售价', '页码', '序号']];
                            var itemNum = 1;
                            var pageNum = 1;
                            var tm = 10;
                            var typeList = ['T', 'R', 'S', 'A', 'O', 'Q', 'E', 'G', 'J', 'D'];
                            var t0 = 200;
                            var t1 = 10;
                            const category0 = document.querySelector("#category_dropdown");
                            if (category0.textContent == '分类：装备' || category0.textContent == 'Category: Equipment') {
                                checkInterval = setInterval(() => {
                                    const pageActive = document.querySelector("#stat_pagination > li.page.active");
                                    if (pageActive) {
                                        if (pageActive.textContent == pageNum) {
                                            for (let i = 1; i <= 10; i++) {
                                                const item = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > a > span`);
                                                if (item) {
                                                    equipmentInfo[itemNum] = ['', '', '', '', pageNum, itemNum];
                                                    equipmentInfo[itemNum][0] = item.textContent;
                                                    var serie = 0;
                                                    for (let t = 0; t < tm; t++) {
                                                        if (item.textContent.match(/-(.)(?=[^-]*$)/)[1] == typeList[t]) {
                                                            serie = t;
                                                            break;
                                                        }
                                                    }
                                                    equipmentInfo[itemNum][1] = serie;
                                                    equipmentInfo[itemNum][2] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > span`).textContent.replace(/\u00A0/g, "");;
                                                    equipmentInfo[itemNum][3] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(3)`).textContent.replace(/ /g, "");
                                                    itemNum++;
                                                } else {
                                                    break;
                                                }
                                            }
                                            pageNum++;
                                            const pageLastDisabled = document.querySelector("#stat_pagination > li.last.disabled");
                                            if (pageLastDisabled) {
                                                clearInterval(checkInterval);
                                                console.log(equipmentInfo);
                                                chrome.runtime.sendMessage({ action: 'sendEquipmentInfo', equipmentInfo: equipmentInfo });
                                            } else {
                                                setTimeout(() => {
                                                    const pageNext = document.querySelector("#stat_pagination > li.next");
                                                    pageNext.click();
                                                }, t1);
                                            }
                                        } else if (pageActive.textContent < pageNum) {
                                            setTimeout(() => {
                                                const pageNext = document.querySelector("#stat_pagination > li.next");
                                                pageNext.click();
                                            }, t1);
                                        } else if (pageActive.textContent > pageNum) {
                                            setTimeout(() => {
                                                const pageFirst = document.querySelector("#stat_pagination > li.first");
                                                pageFirst.click();
                                            }, t1);
                                        }
                                    } else {
                                        for (let i = 1; i <= 10; i++) {
                                            const item = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > a > span`);
                                            if (item) {
                                                equipmentInfo[itemNum] = ['', '', '', '', pageNum, itemNum];
                                                equipmentInfo[itemNum][0] = item.textContent;
                                                equipmentInfo[itemNum][1] = item.textContent.match(/-(.)(?=[^-]*$)/)[1];
                                                equipmentInfo[itemNum][2] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > span`).textContent;
                                                equipmentInfo[itemNum][3] = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(3)`).textContent.replace(/ /g, "");
                                                itemNum++;
                                            } else {
                                                break;
                                            }
                                        }
                                        clearInterval(checkInterval);
                                        console.log(equipmentInfo);
                                        chrome.runtime.sendMessage({ action: 'sendEquipmentInfo', equipmentInfo: equipmentInfo });
                                    }
                                }, t0);
                            } else {
                                window.alert('请选择分类为装备');
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
    var ct = 10; // 普通装备质量下界
    var commonEquipment = [5, 6, 7, 8, 10, 12, 14, 16, 18, 20];
    var rt = 20; // 稀有装备质量下界
    var rareEquipment = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        16, 18, 20, 22, 25, 27, 30, 35, 40, 45];
    var ut = 40; // 史诗装备质量下界
    var uniqueEquipment = [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28, 30, 33, 36, 40];
    var lt = 70; // 传说装备质量下界
    // 0 -> 70%; 1 -> 71%; 以此类推
    var legendEquipment = [5, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 20, 24, 28, 32, 36, 40, 45, 50, 55, 60, 65, 70, 75, 85]; // 传说装备能拆出的完美碎片个数
    var pt = 100;
    if (request.action === 'sendEquipmentInfo') {
        let equipmentInfo = request.equipmentInfo;
        console.log('收到装备出售信息：', equipmentInfo);   // 在控制台打出结果
        document.getElementById('buttonEquip').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功

        chrome.storage.local.get(['perfectValue', 'gemsPrice'], function(result) {
            const perfectValue = result.perfectValue;
            const gemsPrice = result.gemsPrice;
            var equipCheap = [['页码', '序号', '名称', '质量', '售价']]; // 结果表
            var ecn = 0;
            for (let i = 1; i < equipmentInfo.length; i++) {
                var quality = equipmentInfo[i][2].replace(/%/g, ""); // 装备质量 多少个百分点
                if (quality == pt) { // 完美
                    var disPrice = perfectValue[1][equipmentInfo[i][1] + 1]; // 直接用估价比较
                    if (disPrice >= +equipmentInfo[i][3]) {
                        ecn++;
                        equipCheap[ecn] = [equipmentInfo[i][4], (equipmentInfo[i][5] - 1) % 10 + 1, equipmentInfo[i][0], equipmentInfo[i][2], equipmentInfo[i][3]];
                    }
                } else if (quality >= lt && quality < pt) { // 传说
                    var disPrice = legendEquipment[quality - lt] * perfectValue[1][equipmentInfo[i][1] + 1] / 100; // 碎片个数乘以对应碎片估价
                    if (disPrice >= +equipmentInfo[i][3]) {
                        ecn++;
                        equipCheap[ecn] = [equipmentInfo[i][4], (equipmentInfo[i][5] - 1) % 10 + 1, equipmentInfo[i][0], equipmentInfo[i][2], equipmentInfo[i][3]];
                    }
                } else if (quality >= ut && quality < lt) { // 史诗
                    var disPrice = uniqueEquipment[quality - ut] * gemsPrice[5][2];
                    if (disPrice >= +equipmentInfo[i][3]) {
                        ecn++;
                        equipCheap[ecn] = [equipmentInfo[i][4], (equipmentInfo[i][5] - 1) % 10 + 1, equipmentInfo[i][0], equipmentInfo[i][2], equipmentInfo[i][3]];
                    }
                } else if (quality >= rt && quality < ut) { // 稀有
                    var disPrice = rareEquipment[quality - rt] * gemsPrice[5][1];
                    if (disPrice >= +equipmentInfo[i][3]) {
                        ecn++;
                        equipCheap[ecn] = [equipmentInfo[i][4], (equipmentInfo[i][5] - 1) % 10 + 1, equipmentInfo[i][0], equipmentInfo[i][2], equipmentInfo[i][3]];
                    }
                } else if (quality >= ct && quality < rt) { // 普通
                    var disPrice = commonEquipment[quality - ct] * gemsPrice[5][0];
                    if (disPrice >= +equipmentInfo[i][3]) {
                        ecn++;
                        equipCheap[ecn] = [equipmentInfo[i][4], (equipmentInfo[i][5] - 1) % 10 + 1, equipmentInfo[i][0], equipmentInfo[i][2], equipmentInfo[i][3]];
                    }
                }
            }
            if (ecn > 0) { // 有便宜装备就输出
                displayTextMatrix(equipCheap, 'equipCheap');
                document.getElementById('equipCheap').style.display = 'block';
                document.getElementById('mainBody').style.width = '250px';
                chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
                    const tabId = tab1[0].id;
                    chrome.scripting.executeScript({
                        target: { tabId },
                        args: [equipCheap],
                        function: function (equipCheap) {
                            console.log(equipCheap);
                        }
                    });
                })
            } else {
                document.getElementById('noEquipCheap').style.display = 'block';
            }
        });
    }
});

/* 显示纯文本 */
function displayTextMatrix(matrix, tableId, width = 0) {
    
    let rows = matrix.length;
    let cols = matrix[0].length;
    if (width) {
        cols = width;
    }

    const table = document.getElementById(tableId);    // 定位表格
    table.innerHTML = ''; // 清空现有的表格内容

    /* 表格主体 */
    let tbody = table.createTBody();
    for (let i = 0; i < rows; i++) {
        let row = tbody.insertRow();
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell();
            cell.textContent = matrix[i][j].toString();
        }
    }
}