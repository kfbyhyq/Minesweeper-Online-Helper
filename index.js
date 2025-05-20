/* 网站主题 */
document.addEventListener('DOMContentLoaded', function() {
    /* 初始化主题 */
    chrome.storage.local.get(['themeMap', 'theme'], function (result) {
        var themeMap = result.themeMap;
        var theme = result.theme;
        if (!themeMap) { // 无主题字典则初始化
            themeMap = defaultThemes;
            chrome.storage.local.set({ themeMap: themeMap });
        }
        const themeSelect = document.getElementById('themeSelect');
        const theme0 = new Option('默认', '默认');
        themeSelect.add(theme0); // 先添加默认选项
        for (let themeName in themeMap) {
            if (themeName != '默认') {
                const theme1 = new Option(themeName, themeName);
                themeSelect.add(theme1); // 依次添加每个选项
            }
        }
        if (!theme) {
            theme = '默认'; // 无当前应用的主题则置为"默认"
            chrome.storage.local.set({ theme: theme });
        }
        themeSelect.value = theme; // 下拉菜单置于当前应用的主题
        document.documentElement.classList.add(theme); // 设置应用的主题
        if (Object.keys(themeMap[theme]).length > 0) { // 字典中有内容说明是自定义的主题
            for (const [key, value] of Object.entries(themeMap[theme])) {
                if (key != 'themeName' && key != 'introduce') {
                    document.documentElement.style.setProperty(`--${key}`, value[0]);
                }
            }
        }
    });
    /* 选择主题 */
    document.getElementById('themeSelect').addEventListener('change', function() {
        var newTheme = document.getElementById('themeSelect').value;
        chrome.storage.local.get(['themeMap', 'theme'], function (result) {
            var themeMap = result.themeMap || {};
            var theme = result.theme;
            if (theme) {
                if (theme != newTheme) {
                    chrome.storage.local.set({ theme: newTheme });
                    for (let themeName in themeMap) {
                        document.documentElement.classList.remove(themeName); // 清空其他主题
                    }
                    document.documentElement.style = '';
                    document.documentElement.classList.add(newTheme); // 设置应用的主题
                    if (Object.keys(themeMap[newTheme]).length > 0) { // 字典中有内容说明是自定义的主题
                        for (const [key, value] of Object.entries(themeMap[newTheme])) {
                            if (key != 'themeName' && key != 'introduce') {
                                document.documentElement.style.setProperty(`--${key}`, value[0]);
                            }
                        }
                    }
                    displayTables();
                    displayBVPB();
                    displayPriceDaily();
                }
            }
        });
    });
    /* 上传自定义主题 */
    document.getElementById('uploadThemeButton').addEventListener('click', function () {
        document.getElementById('uploadTheme').click();
    });
    document.getElementById('uploadTheme').onchange = function(event) {
        const file = event.target.files[0]; // 获取选中的文件
        const reader = new FileReader();
        // 成功读取后解析文件
        reader.onload = function (event) {
            try {
                const dataIn = JSON.parse(event.target.result);
                if (dataIn['themeName']) { // 检查themeName字段，成功则认为格式正确
                    const themeName = dataIn['themeName'];
                    chrome.storage.local.get(['themeMap', 'theme'], function (result) {
                        var themeMap = result.themeMap || {};
                        var theme = result.theme;
                        themeMap[themeName] = dataIn; // 以themeName的值为键存入主题字典
                        chrome.storage.local.set({ themeMap: themeMap });
                        theme = themeName; // 设置当前应用的主题为新添加的主题
                        chrome.storage.local.set({ theme: theme });
                        // 加入下拉菜单
                        const themeSelect = document.getElementById('themeSelect');
                        const oldTheme = themeSelect.querySelectorAll(`option[value="${themeName}"]`);
                        oldTheme.forEach(option => option.remove()); // 删除重名的选项 保证添加到末端
                        const newTheme = new Option(themeName, themeName, 0, 1);
                        themeSelect.add(newTheme);
                        for (const [key, value] of Object.entries(dataIn)) {
                            if (key != 'themeName' && key != 'introduce') {
                                document.documentElement.style.setProperty(`--${key}`, value[0]);
                            }
                        }
                    });
                } else {
                    window.alert('文件格式错误');
                }
            } catch (e) {
                console.error('上传自定义主题失败', e);
                window.alert('上传自定义主题失败');
            }
        };
        reader.readAsText(file);
    };
    /* 清空自定义主题 */
    document.getElementById('clearTheme').addEventListener('click', function () {
        chrome.storage.local.get(['themeMap', 'theme'], function (result) {
            var themeMap = defaultThemes;
            var theme = '默认';
            chrome.storage.local.set({ themeMap: themeMap });
            chrome.storage.local.set({ theme: theme });
            const themeSelect = document.getElementById('themeSelect');
            themeSelect.innerHTML = '';
            const theme0 = new Option('默认', '默认', 1, 1);
            themeSelect.add(theme0); // 先添加默认选项
            for (let themeName in themeMap) {
                if (themeName != '默认') {
                    const theme1 = new Option(themeName, themeName);
                    themeSelect.add(theme1); // 依次添加每个选项
                }
            }
            document.documentElement.style = '';
            document.documentElement.className = theme; // 设置应用的主题
        });
    });
    /* 下载主题模板 */
    document.getElementById('downloadThemeExample').addEventListener('click', function () {
        const jsonData = JSON.stringify(themeExample, null, 2); // 格式化 JSON
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'themeExample.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // 释放 URL 对象
    });
    /* 下载全部主题 */
    document.getElementById('downloadAllTheme').addEventListener('click', function () {
        chrome.storage.local.get(['themeMap', 'theme'], function (result) {
            var themeMap = result.themeMap || {};
            const jsonData = JSON.stringify(themeMap, null, 2); // 格式化 JSON
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'allTheme.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // 释放 URL 对象
        });
    });
});

function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示对应页面
    document.getElementById(pageId).classList.add('active');

    // 移除所有导航栏链接的活动样式
    document.querySelectorAll('#navbar a').forEach(link => {
        link.classList.remove('active');
    });

    // 为对应导航栏链接添加活动样式
    document.getElementById('nav-' + pageId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化时显示首页
    showPage('statistic');
    // 获取导航数据的元素 添加点击事件监听器
    document.getElementById('nav-statistic').addEventListener('click', function(event) {
        showPage('statistic');
    });
    document.getElementById('nav-price').addEventListener('click', function(event) {
        showPage('price');
    });
    document.getElementById('nav-priceDaily').addEventListener('click', function(event) {
        showPage('priceDaily');
    });
    document.getElementById('nav-resource').addEventListener('click', function(event) {
        showPage('resource');
    });
    document.getElementById('nav-eventShop').addEventListener('click', function(event) {
        showPage('eventShop');
    });
    document.getElementById('nav-perfect').addEventListener('click', function(event) {
        showPage('perfect');
    });
    document.getElementById('nav-contacts').addEventListener('click', function(event) {
        showPage('contacts');
    });
    document.getElementById('nav-pbOfBV').addEventListener('click', function(event) {
        showPage('pbOfBV');
    });
    document.getElementById('nav-eventArena').addEventListener('click', function(event) {
        showPage('eventArena');
    });
    document.getElementById('nav-friendQuest').addEventListener('click', function(event) {
        showPage('friendQuest');
    });
    document.getElementById('nav-wheel').addEventListener('click', function(event) {
        showPage('wheel');
    });
    document.getElementById('nav-eventQuest').addEventListener('click', function(event) {
        showPage('eventQuest');
    });
    document.getElementById('nav-setting').addEventListener('click', function(event) {
        document.getElementById('saveSucc').style.display = 'none';
        showPage('setting');
    });
    document.getElementById('nav-help').addEventListener('click', function(event) {
        showPage('help');
    });

    const currentDate = new Date();
    const dateMinus2 = new Date(currentDate);
    dateMinus2.setUTCDate(currentDate.getUTCDate() - 2);  // 每个月前两天划给上一个月
    switch ((dateMinus2.getUTCMonth() + 1) % 4) {
        case 0: 
            document.getElementById('nav-eventQuest').style.display = 'block';
            break;
        case 1:
            document.getElementById('nav-eventArena').style.display = 'block';
            break;
        case 2:
            document.getElementById('nav-friendQuest').style.display = 'block';
            break;
        case 3:
            document.getElementById('nav-wheel').style.display = 'block';
            break;
    }
});

/* 固定左侧导航栏高度 */
window.addEventListener('resize', function() {
    // 获取视口高度
    var viewportHeight = window.innerHeight;
    // 设置#navbar的最大高度
    var navbarMaxHeight = viewportHeight - 76; // 减去top偏移量76px
    // 获取#navbar元素
    var navbarElement = document.getElementById('navbar');
    // 应用最大高度（使用px单位）
    navbarElement.style.maxHeight = navbarMaxHeight + 'px';
});
// 初始加载时也应设置最大高度
window.dispatchEvent(new Event('resize'));

/* 打开页面与对应的刷新 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('statisticPage').addEventListener('click', function () {
        const pId = document.getElementById('pIdNow').innerText;
        if (pId) {
            const u = 'https://minesweeper.online/cn/statistics/' + pId;
            chrome.tabs.create({ url: u, active: true });
        } else {
            window.alert('请先设置用户ID');
        }
    });
    document.getElementById('updateStatistic').addEventListener('click', function () {
        updateStatistics();
    });
    document.getElementById('marketPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/marketplace', active: true });
    });
    document.getElementById('updateMarketPage').addEventListener('click', function () {
        updateGems();
    });
    document.getElementById('arenaPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/arena', active: true });
    });
    document.getElementById('updateAtPrice').addEventListener('click', function () {
        updateArenaTickets();
    });
    document.getElementById('playerPage').addEventListener('click', function () {
        const pId = document.getElementById('pIdNow').innerText;
        if (pId) {
            const u = 'https://minesweeper.online/cn/player/' + pId;
            chrome.tabs.create({ url: u, active: true });
        } else {
            window.alert('请先设置用户ID');
        }
    });
    document.getElementById('updatePersonalData').addEventListener('click', function () {
        updatePersonalData();
    });
    document.getElementById('eventPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/events', active: true });
    });
    document.getElementById('eventPage2').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/events', active: true });
    });
    document.getElementById('equipmentPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/equipment', active: true });
    });
    document.getElementById('equipmentPage2').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/equipment', active: true });
    });
    document.getElementById('updateEquipmentStats').addEventListener('click', function () {
        updateEquipmentStats();
    });
    document.getElementById('friendQuestPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/friend-quests', active: true });
    });
    document.getElementById('eventQuestPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/event-quests', active: true });
    });
    document.getElementById('personEcoPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/economy', active: true });
    });
    document.getElementById('updateEconomy').addEventListener('click', function () {
        updateEconomy();
    });
    document.getElementById('myGamePage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/my-games', active: true });
    });
    document.getElementById('allQuestPage').addEventListener('click', function () {
        const pId = document.getElementById('pIdNow').innerText;
        if (pId) {
            const u = 'https://minesweeper.online/cn/quests/' + pId;
            chrome.tabs.create({ url: u, active: true });
        } else {
            window.alert('请先设置用户ID');
        }
    });
    document.getElementById('github').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://github.com/kfbyhyq/Minesweeper-Online-Helper', active: true });
    });
});

/* 收起与展开 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showPeDaily').addEventListener('click', function () {
        if (document.getElementById('showPedFlag').textContent == 1) {
            document.getElementById('showPeDaily').textContent = '展开每日财产变化';
            document.getElementById('peDaily').style.display = 'none';
            document.getElementById('showPedFlag').textContent = 0;
        } else {
            document.getElementById('showPeDaily').textContent = '收起每日财产变化';
            document.getElementById('peDaily').style.display = 'table';
            document.getElementById('showPedFlag').textContent = 1;
        }
    });
    document.getElementById('showPrDaily').addEventListener('click', function () {
        if (document.getElementById('showPrdFlag').textContent == 1) {
            document.getElementById('showPrDaily').textContent = '展开每日资源变化';
            document.getElementById('prDaily').style.display = 'none';
            document.getElementById('showPrdFlag').textContent = 0;
        } else {
            document.getElementById('showPrDaily').textContent = '收起每日资源变化';
            document.getElementById('prDaily').style.display = 'table';
            document.getElementById('showPrdFlag').textContent = 1;
        }
    });
});

/* 装备拆解价 */
document.addEventListener('DOMContentLoaded', function() {
    const dpgSelectMin = document.getElementById('dpgSelectMin');
    const dpgSelectMax = document.getElementById('dpgSelectMax');
    // 下拉菜单默认值为空，选项为10%到100%
    for (let quality = 10; quality <= 100; quality++) {
        let qMin = document.createElement('option');
        qMin.value = quality;
        qMin.textContent = quality + '%';
        dpgSelectMin.appendChild(qMin);
        let qMax = document.createElement('option');
        qMax.value = quality;
        qMax.textContent = quality + '%';
        dpgSelectMax.appendChild(qMax);
    }
    // 下界改变
    dpgSelectMin.addEventListener('change', function() {
        var qMaxValue = dpgSelectMax.value;
        dpgSelectMax.innerHTML = '';
        for (let quality = dpgSelectMin.value; quality <= 100; quality++) { // 上界不能低于下界
            let qMax = document.createElement('option');
            qMax.value = quality;
            qMax.textContent = quality + '%';
            dpgSelectMax.appendChild(qMax);
        }
        if (qMaxValue <= 100) { // 如果之前上界有值，保持不变
            dpgSelectMax.value = qMaxValue;
        } else {
            dpgSelectMin.remove(0);
            dpgSelectMax.value = dpgSelectMin.value;
        }
        showDisassemblePriceGap(dpgSelectMin.value, dpgSelectMax.value);
    });
    // 上界改变
    dpgSelectMax.addEventListener('change', function() {
        var qMinValue = dpgSelectMin.value;
        dpgSelectMin.innerHTML = '';
        for (let quality = 10; quality <= dpgSelectMax.value; quality++) { // 下界不能高于上界
            let qMin = document.createElement('option');
            qMin.value = quality;
            qMin.textContent = quality + '%';
            dpgSelectMin.appendChild(qMin);
        }
        if (qMinValue > 9) {
            dpgSelectMin.value = qMinValue;
        } else {
            dpgSelectMax.remove(0);
            dpgSelectMin.value = dpgSelectMax.value;
        }
        showDisassemblePriceGap(dpgSelectMin.value, dpgSelectMax.value);
    });
    document.getElementById('showDisPriceGap').addEventListener('click', function() {
        if (document.getElementById('showDPGFlag').textContent == 1) {
            document.getElementById('showDPGFlag').textContent = 2;
            document.getElementById('dpgDiv').style.display = 'none';
            document.getElementById('showDisPriceGap').textContent = '查看拆解收益';
        } else if (document.getElementById('showDPGFlag').textContent == 2) {
            document.getElementById('showDPGFlag').textContent = 1;
            document.getElementById('dpgDiv').style.display = 'inline';
            document.getElementById('showDisPriceGap').textContent = '收起拆解收益';
        } else if (document.getElementById('showDPGFlag').textContent == 0) {
            // var qMin = document.getElementById('dpgSelectMin').value;
            // var qMax = document.getElementById('dpgSelectMax').value;
            // showDisassemblePriceGap(qMin, qMax);
            document.getElementById('showDPGFlag').textContent = 1;
            document.getElementById('dpgDiv').style.display = 'inline';
            document.getElementById('showDisPriceGap').textContent = '收起拆解收益';
        }
    });
})
// 显示分解价格主函数
function showDisassemblePriceGap(qMin, qMax) {
    qMin = Number(qMin);
    qMax = Number(qMax);
    if (qMin < 10) { qMin = 10; }
    if (qMax > 100) { qMax = 100; }
    chrome.storage.local.get('gemsPrice', function(result) {
        if (result.gemsPrice) {
            var gemsPrice = result.gemsPrice;
            var commonThreshold = 10; // 普通装备质量下界
            var commonStats = [
                [850, 1000, 1150, 1300, 1550, 1800, 2100, 2400, 2700, 3000], // 制造所需金币
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 制造所需宝石
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 制造所需场币
                [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],  // 强化所需功勋
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 升级碎片数
                [5, 6, 7, 8, 10, 12, 14, 16, 18, 20], // 拆解碎片数
            ];
            var rareThreshold = 20; // 稀有装备质量下界
            var rareStats = [
                [2000, 2000, 2500, 2500, 3000, 3000, 3500, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000],
                [3, 4, 4, 5, 5, 6, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87],
                [5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 15, 15, 20, 20, 20, 20, 25, 25, 25, 0],
                [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 25, 27, 30, 35, 40, 45]
            ];
            var uniqueThreshold = 40; // 史诗装备质量下界
            var uniqueStats = [
                [14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 
                    30000, 32000, 35000, 37000, 40000, 42000, 45000, 47000, 50000, 52000, 55000, 60000, 65000, 70000, 75000],
                [30, 34, 38, 42, 46, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 
                    100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 220, 240, 260, 280],
                [60, 68, 76, 84, 92, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 
                    200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 440, 480, 520, 560],
                [90, 94, 98, 102, 106, 110, 114, 118, 122, 126, 130, 134, 138, 142, 146, 
                    150, 154, 158, 162, 166, 170, 174, 178, 182, 186, 190, 194, 198, 202, 206],
                [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 
                    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 40, 40, 40, 50, 0],
                [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 11, 12, 13, 14,
                    15, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28, 30, 33, 36, 40]
            ];
            var legendThreshold = 70; // 传说装备质量下界
            // 0 -> 70%; 1 -> 71%; 以此类推
            var legendStats = [
                [80000, 85000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 185000, 200000, 215000, 230000, 
                    250000, 270000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000],
                [300, 325, 350, 375, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 
                    1000, 1100, 1300, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4500],
                [600, 650, 700, 750, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 
                    2000, 2200, 2600, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 9000],
                [210, 213, 216, 219, 222, 225, 228, 231, 234, 237, 240, 243, 246, 249, 252, 
                    255, 258, 261, 264, 267, 270, 273, 276, 279, 282, 285, 288, 291, 294, 297],
                [5, 5, 7, 7, 10, 10, 10, 10, 10, 10, 12, 12, 12, 12, 20, 
                    20, 40, 40, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 100, 0],
                [5, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 20, 24, 28, 32, 36, 40, 45, 50, 55, 60, 65, 70, 75, 85]
            ];
            var perfectThreshold = 100;
            var perfectStats = [1000000, 5000, 10000, 300, 100, 100];
            var disPriceGap = [
                ['种类', '黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石']
            ]
            // var qMin = document.getElementById('dpgSelectMin').value;
            // var qMax = document.getElementById('dpgSelectMax').value;
            if (qMin == qMax) {
                disPriceGap = [
                    ['种类', '黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'],
                    ['造价', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    ['拆解碎片数', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    ['拆解价', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    ['拆解收益', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
                var q = qMin;
                if (q < rareThreshold) {
                    for (let j = 1; j < disPriceGap[0].length; j++) {
                        disPriceGap[1][j] = commonStats[0][q - commonThreshold]
                            + commonStats[1][q - commonThreshold] * gemsPrice[1][j - 1]
                            + commonStats[2][q - commonThreshold] * gemsPrice[3][j - 1];
                        disPriceGap[2][j] = commonStats[5][q - commonThreshold];
                        disPriceGap[3][j] = commonStats[5][q - commonThreshold] * gemsPrice[5][0];
                        disPriceGap[4][j] = disPriceGap[3][j] - disPriceGap[1][j];
                    }
                } else if (q < uniqueThreshold) {
                    for (let j = 1; j < disPriceGap[0].length; j++) {
                        disPriceGap[1][j] = rareStats[0][q - rareThreshold]
                            + rareStats[1][q - rareThreshold] * gemsPrice[1][j - 1]
                            + rareStats[2][q - rareThreshold] * gemsPrice[3][j - 1];
                        disPriceGap[2][j] = rareStats[5][q - rareThreshold];
                        disPriceGap[3][j] = rareStats[5][q - rareThreshold] * gemsPrice[5][1];
                        disPriceGap[4][j] = disPriceGap[3][j] - disPriceGap[1][j];
                    }
                } else if (q < legendThreshold) {
                    for (let j = 1; j < disPriceGap[0].length; j++) {
                        disPriceGap[1][j] = uniqueStats[0][q - uniqueThreshold]
                            + uniqueStats[1][q - uniqueThreshold] * gemsPrice[1][j - 1]
                            + uniqueStats[2][q - uniqueThreshold] * gemsPrice[3][j - 1];
                        disPriceGap[2][j] = uniqueStats[5][q - uniqueThreshold];
                        disPriceGap[3][j] = uniqueStats[5][q - uniqueThreshold] * gemsPrice[5][2];
                        disPriceGap[4][j] = disPriceGap[3][j] - disPriceGap[1][j];
                    }
                } else if (q < perfectThreshold) {
                    for (let j = 1; j < disPriceGap[0].length; j++) {
                        disPriceGap[1][j] = legendStats[0][q - legendThreshold]
                            + legendStats[1][q - legendThreshold] * gemsPrice[1][j - 1]
                            + legendStats[2][q - legendThreshold] * gemsPrice[3][j - 1];
                        disPriceGap[2][j] = legendStats[5][q - legendThreshold];
                        disPriceGap[3][j] = legendStats[5][q - legendThreshold] * gemsPrice[7][j - 1];
                        disPriceGap[4][j] = disPriceGap[3][j] - disPriceGap[1][j];
                    }
                } else if (q == perfectThreshold) {
                    for (let j = 1; j < disPriceGap[0].length; j++) {
                        disPriceGap[1][j] = perfectStats[0]
                            + perfectStats[1] * gemsPrice[1][j - 1]
                            + perfectStats[2] * gemsPrice[3][j - 1];
                        disPriceGap[2][j] = perfectStats[5];
                        disPriceGap[3][j] = perfectStats[5] * gemsPrice[7][j - 1];
                        disPriceGap[4][j] = disPriceGap[3][j] - disPriceGap[1][j];
                    }
                }
                displayMatrix(disPriceGap, 'disPriceGap');
            } else {
                var dataPositive = [];
                var dataNegative = [];
                var di = 0;
                var dpi = [];
                var dni = [];
                for (let q = qMin; q <= qMax; q++) {
                    var dpgRow = [q + '%', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    if (q < rareThreshold) {
                        for (let j = 1; j < dpgRow.length; j++) {
                            dpgRow[j] = commonStats[5][q - commonThreshold] * gemsPrice[5][0] // gemsPrice[5][0] 稀有碎片
                                - commonStats[0][q - commonThreshold] // 造装备金币数
                                - commonStats[1][q - commonThreshold] * gemsPrice[1][j - 1] // 造装备宝石数（普通没有）
                                - commonStats[2][q - commonThreshold] * gemsPrice[3][j - 1]; // 造装备场币数（普通没有）
                            if (dpgRow[j] <= 0) {
                                dataNegative.push(dpgRow[j]);
                                dni.push(di);
                                di++;
                            } else {
                                dataPositive.push(dpgRow[j]);
                                dpi.push(di);
                                di++;
                            }
                        }
                    } else if (q < uniqueThreshold) {
                        for (let j = 1; j < dpgRow.length; j++) {
                            dpgRow[j] = rareStats[5][q - rareThreshold] * gemsPrice[5][1] // gemsPrice[5][1] 史诗碎片
                                - rareStats[0][q - rareThreshold]
                                - rareStats[1][q - rareThreshold] * gemsPrice[1][j - 1]
                                - rareStats[2][q - rareThreshold] * gemsPrice[3][j - 1];
                            if (dpgRow[j] <= 0) {
                                dataNegative.push(dpgRow[j]);
                                dni.push(di);
                                di++;
                            } else {
                                dataPositive.push(dpgRow[j]);
                                dpi.push(di);
                                di++;
                            }
                        }
                    } else if (q < legendThreshold) {
                        for (let j = 1; j < dpgRow.length; j++) {
                            dpgRow[j] = uniqueStats[5][q - uniqueThreshold] * gemsPrice[5][2] // gemsPrice[5][2] 传说碎片
                                - uniqueStats[0][q - uniqueThreshold]
                                - uniqueStats[1][q - uniqueThreshold] * gemsPrice[1][j - 1]
                                - uniqueStats[2][q - uniqueThreshold] * gemsPrice[3][j - 1];
                            if (dpgRow[j] <= 0) {
                                dataNegative.push(dpgRow[j]);
                                dni.push(di);
                                di++;
                            } else {
                                dataPositive.push(dpgRow[j]);
                                dpi.push(di);
                                di++;
                            }
                        }
                    } else if (q < perfectThreshold) {
                        for (let j = 1; j < dpgRow.length; j++) {
                            dpgRow[j] = legendStats[5][q - legendThreshold] * gemsPrice[7][j - 1] // gemsPrice[7] 完美碎片
                                - legendStats[0][q - legendThreshold]
                                - legendStats[1][q - legendThreshold] * gemsPrice[1][j - 1]
                                - legendStats[2][q - legendThreshold] * gemsPrice[3][j - 1];
                            if (dpgRow[j] <= 0) {
                                dataNegative.push(dpgRow[j]);
                                dni.push(di);
                                di++;
                            } else {
                                dataPositive.push(dpgRow[j]);
                                dpi.push(di);
                                di++;
                            }
                        }
                    } else if (q == perfectThreshold) {
                        for (let j = 1; j < dpgRow.length; j++) {
                            dpgRow[j] = perfectStats[5] * gemsPrice[7][j - 1] // gemsPrice[7] 完美碎片
                                - perfectStats[0]
                                - perfectStats[1] * gemsPrice[1][j - 1]
                                - perfectStats[2] * gemsPrice[3][j - 1];
                            if (dpgRow[j] <= 0) {
                                dataNegative.push(dpgRow[j]);
                                dni.push(di);
                                di++;
                            } else {
                                dataPositive.push(dpgRow[j]);
                                dpi.push(di);
                                di++;
                            }
                        }
                    }
                    disPriceGap.push(dpgRow);
                }
                displayMatrix(disPriceGap, 'disPriceGap');
                // var levelColorNegative = setLevelColor(dataNegative, 1, 2, 0, -Infinity, 1, '#F8696B', '#FFEB84', '#63BE7B');
                var levelColorPositive = setLevelColor(dataPositive, 1, 2, Infinity, 0);
                const dpgTable = document.getElementById('disPriceGap');
                // for (let i = 0; i < levelColorNegative.length; i++) {
                //     dpgTable.rows[1 + (dni[i] / 10) | 0].cells[dni[i] % 10 + 1].style.backgroundColor = levelColorNegative[i];
                // }
                for (let i = 0; i < levelColorPositive.length; i++) {
                    dpgTable.rows[1 + (dpi[i] / 10) | 0].cells[dpi[i] % 10 + 1].style.backgroundColor = levelColorPositive[i];
                }
            }
        } else {
            document.getElementById('noPriceNotify').style.display = 'inline';
        }
    });
}

/* 历史价格 */
document.addEventListener('DOMContentLoaded', function() {
    var pdCategory = ['', '宝石', '竞技场币', 
        '速度门票', '速度NG门票', '盲扫门票', '效率门票', '高难度门票', '随机难度门票', '硬核门票', '硬核NG门票', '耐力门票', '噩梦门票', 
        'L1门票', 'L2门票', 'L3门票', 'L4门票', 'L5门票', 'L6门票', 'L7门票', 'L8门票', '装备碎片'];
    var gemsCategory = ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'];
    var acCategory = ['金竞技场币', '铜竞技场币', '银竞技场币', '镍竞技场币', '钢竞技场币', '铁竞技场币', '钯竞技场币', '钛竞技场币', '锌竞技场币', '铂竞技场币'];
    var atCategory = ['速度', '速度NG', '盲扫', '效率', '高难度', '随机难度', '硬核', '硬核NG', '耐力', '噩梦'];
    var alCategory = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
    var partsCategory = ['稀有', '史诗', '传说', '完美T', '完美R', '完美S', '完美A', '完美O', '完美Q', '完美E', '完美G', '完美J', '完美D'];
    const pds = document.getElementById('priceDailySelect');
    const eDate = document.getElementById('editPriceDate');
    const eg = document.getElementById('editGems');
    const eac = document.getElementById('editAcs');
    const eat = document.getElementById('editAt');
    const eal = document.getElementById('editAl');
    const ept = document.getElementById('editParts');
    /* 初始化界面 */
    for (let i = 0; i < pdCategory.length; i++) {
        let op = document.createElement('option');
        op.value = i;
        op.textContent = pdCategory[i];
        pds.appendChild(op);
    }
    for (let i = 0; i < gemsCategory.length; i++) {
        let opg = document.createElement('option');
        opg.value = i;
        opg.textContent = gemsCategory[i];
        eg.appendChild(opg);
        let opac = document.createElement('option');
        opac.value = i;
        opac.textContent = acCategory[i];
        eac.appendChild(opac);
        let opat = document.createElement('option');
        opat.value = i;
        opat.textContent = atCategory[i];
        eat.appendChild(opat);
    }
    for (let i = 0; i < alCategory.length; i++) {
        let opal = document.createElement('option');
        opal.value = i;
        opal.textContent = alCategory[i];
        eal.appendChild(opal);
    }
    for (let i = 0; i < partsCategory.length; i++) {
        let op = document.createElement('option');
        op.value = i;
        op.textContent = partsCategory[i];
        ept.appendChild(op);
    }
    const currentDate = new Date();
    const newDate = currentDate.getUTCFullYear() + '-' + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + '-' + String(currentDate.getUTCDate()).padStart(2, '0');
    eDate.value = newDate;
    /* 显示 */
    // displayPriceDaily();
    /* 选择条目刷新显示 */
    pds.addEventListener('change', function() {
        displayPriceDaily();
    });
    eg.addEventListener('change', function() {
        displayPriceDaily();
    });
    eac.addEventListener('change', function() {
        displayPriceDaily();
    });
    eat.addEventListener('change', function() {
        displayPriceDaily();
    });
    eal.addEventListener('change', function() {
        displayPriceDaily();
    });
    eDate.addEventListener('change', function() {
        displayPriceDaily();
    });
    ept.addEventListener('change', function() {
        displayPriceDaily();
    });
    /* 修改单条数据 */
    document.getElementById('saveEditPrice').addEventListener('click', function () {
        const newPrice = document.getElementById('editNewPrice').value;
        if (newPrice > 0) {
            const pdc = document.getElementById('priceDailySelect').value;
            const date = document.getElementById('editPriceDate').value;
            const egv = document.getElementById('editGems').value;
            const eacv = document.getElementById('editAcs').value;
            const eatv = document.getElementById('editAt').value;
            const ealv = document.getElementById('editAl').value;
            chrome.storage.local.get(['gemsPriceMap', 'ticketPriceMap'], function (result) {
                const gpMap = result.gemsPriceMap || {};
                const tpMap = result.ticketPriceMap || {};
                try {
                    if (pdc == 1) {
                        const dateKey = date.replace(/-/g, '');
                        gpMap[dateKey][1][egv] = newPrice;
                        chrome.storage.local.set({ gemsPriceMap: gpMap });
                        displayPriceDaily();
                    } else if (pdc == 2) {
                        const dateKey = date.replace(/-/g, '');
                        gpMap[dateKey][3][eacv] = newPrice;
                        chrome.storage.local.set({ gemsPriceMap: gpMap });
                        displayPriceDaily();
                    } else if (pdc < 13) {
                        const dateKey = date.replace(/-/g, '');
                        tpMap[dateKey][pdc - 2][+ealv + 1] = newPrice;
                        chrome.storage.local.set({ ticketPriceMap: tpMap });
                        displayPriceDaily();
                    } else if (pdc < 21) {
                        const dateKey = date.replace(/-/g, '');
                        tpMap[dateKey][+eatv + 1][pdc - 12] = newPrice;
                        chrome.storage.local.set({ ticketPriceMap: tpMap });
                        displayPriceDaily();
                    }
                } catch (e) {
                    console.log(e);
                    window.alert('修改失败');
                }
            });
        } else {
            window.alert('请输入价格');
        }
    });
});

/* BVPB */
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.remove('pbOfBVNew');
    displayBVPB();
    // 等级按钮
    const levelButtons = document.querySelectorAll('.BVPBLevelButton');
    levelButtons.forEach(button => {
        button.addEventListener('click', function () {
            levelButtons.forEach(btn => { // 先移除所有按钮的activeButton类
                btn.classList.remove('activeButton');
            });
            this.classList.add('activeButton'); // 为当前点击的按钮添加activeButton类
            var match = this.id.match(/\d+$/);
            document.getElementById('pbOfBVLevel').textContent = parseInt(match[0]);
            displayBVPB();
            if (document.getElementById('pkStatus').textContent == 1) {
                displayBVPBNew();
            }
        });
    });
    // 类别按钮
    const typeButtons = document.querySelectorAll('.BVPBTypeButton');
    typeButtons.forEach(button => {
        button.addEventListener('click', function () {
            typeButtons.forEach(btn => { // 先移除所有按钮的activeButton类
                btn.classList.remove('activeButton');
            });
            this.classList.add('activeButton'); // 为当前点击的按钮添加activeButton类
            var match = this.id.match(/\d+$/);
            document.getElementById('pbOfBVType').textContent = parseInt(match[0]);
            displayBVPB();
            if (document.getElementById('pkStatus').textContent == 1) {
                displayBVPBNew();
            }
        });
    });
    const nf = document.getElementById('pbOfBV-nf');
    const isNf = document.getElementById('pbOfBVIsNf');
    isNf.textContent = 0;
    nf.addEventListener('click', function() {
        if (isNf.textContent == 0) {
            isNf.textContent = 1;
            nf.classList.add('activeButton')
            displayBVPB();
        } else {
            isNf.textContent = 0;
            nf.classList.remove('activeButton');
            displayBVPB();
        }
        if (document.getElementById('pkStatus').textContent == 1) {
            displayBVPBNew();
        }
    });
    /* 重新统计功能 */
    document.getElementById('updatePbofBV').addEventListener('click', function() {
        chrome.storage.local.get(['BVMap', 'pbOfBV', 'pbOfBVMap', 'dailyPB'], function(result) {
            const BVMap = result.BVMap || {};
            console.log('BVPB旧统计', result.pbOfBV)
            const pbOfBV = {1:{}, 2:{}, 3:{}};
            const pbOfBVMap = result.pbOfBVMap || {};
            const dailyPB = {1:{}, 2:{}, 3:{}};
            for (let level = 1; level <= 3; level++) {
                for (let id in BVMap[level]) {
                    // 和同bv的记录比较，更新BVPB
                    const bv = BVMap[level][id][2];
                    if (pbOfBV[level][bv]) {
                        pbOfBV[level][bv][0]++;
                        if (+BVMap[level][id][0] < +pbOfBV[level][bv][1]) {
                            pbOfBV[level][bv][1] = BVMap[level][id][0];
                            pbOfBV[level][bv][2] = id;
                        }
                        if (+BVMap[level][id][3] > +pbOfBV[level][bv][3]) {
                            pbOfBV[level][bv][3] = BVMap[level][id][3];
                            pbOfBV[level][bv][4] = id;
                        }
                        if (+(BVMap[level][id][4].replace('%','')) > +(pbOfBV[level][bv][5].replace('%',''))) {
                            pbOfBV[level][bv][5] = BVMap[level][id][4];
                            pbOfBV[level][bv][6] = id;
                        }
                        if (BVMap[level][id][1] == 1) { // 是盲扫
                            if (pbOfBV[level][bv][7]) {
                                pbOfBV[level][bv][7]++;
                                if (+BVMap[level][id][0] < +pbOfBV[level][bv][8]) {
                                    pbOfBV[level][bv][8] = BVMap[level][id][0];
                                    pbOfBV[level][bv][9] = id;
                                }
                                if (+BVMap[level][id][3] > +pbOfBV[level][bv][10]) {
                                    pbOfBV[level][bv][10] = BVMap[level][id][3];
                                    pbOfBV[level][bv][11] = id;
                                }
                                if (+(BVMap[level][id][4].replace('%','')) > +(pbOfBV[level][bv][12].replace('%',''))) {
                                    pbOfBV[level][bv][12] = BVMap[level][id][4];
                                    pbOfBV[level][bv][13] = id;
                                }
                            } else {
                                pbOfBV[level][bv][7] = 1;
                                pbOfBV[level][bv][8] = BVMap[level][id][0];
                                pbOfBV[level][bv][9] = id;
                                pbOfBV[level][bv][10] = BVMap[level][id][3];
                                pbOfBV[level][bv][11] = id;
                                pbOfBV[level][bv][12] = BVMap[level][id][4];
                                pbOfBV[level][bv][13] = id;
                            }
                        }
                    } else {
                        pbOfBV[level][bv] = [1, BVMap[level][id][0], id, BVMap[level][id][3], id, BVMap[level][id][4], id];
                        if (BVMap[level][id][1] == 1) {
                            pbOfBV[level][bv][7] = 1;
                            pbOfBV[level][bv][8] = BVMap[level][id][0];
                            pbOfBV[level][bv][9] = id;
                            pbOfBV[level][bv][10] = BVMap[level][id][3];
                            pbOfBV[level][bv][11] = id;
                            pbOfBV[level][bv][12] = BVMap[level][id][4];
                            pbOfBV[level][bv][13] = id;
                        }
                    }
                    // 和当日记录比较，更新dailyPB
                    const dateParts = BVMap[level][id][5].split(/[/ :]/); // 解析日期
                    const year = parseInt(dateParts[0]);
                    const month = parseInt(dateParts[1]) - 1;
                    const day = parseInt(dateParts[2]);
                    const hours = parseInt(dateParts[3]);
                    const minutes = parseInt(dateParts[4]);
                    const localDate = new Date(year, month, day, hours, minutes); // 自动使用浏览器时区
                    const utcYear = localDate.getUTCFullYear();
                    const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
                    const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
                    const dateStr = `${utcYear}-${utcMonth}-${utcDay}`; // 日期关键词
                    if (dailyPB[level][dateStr]) {
                        dailyPB[level][dateStr][0]++;
                        if (+BVMap[level][id][0] < +dailyPB[level][dateStr][1]) {
                            dailyPB[level][dateStr][1] = BVMap[level][id][0];
                            dailyPB[level][dateStr][2] = id;
                        }
                        if (+BVMap[level][id][3] > +dailyPB[level][dateStr][3]) {
                            dailyPB[level][dateStr][3] = BVMap[level][id][3];
                            dailyPB[level][dateStr][4] = id;
                        }
                        if (+(BVMap[level][id][4].replace('%','')) > +(dailyPB[level][dateStr][5].replace('%',''))) {
                            dailyPB[level][dateStr][5] = BVMap[level][id][4];
                            dailyPB[level][dateStr][6] = id;
                        }
                        if (BVMap[level][id][1] == 1) { // 是盲扫
                            if (dailyPB[level][dateStr][7]) {
                                if (+BVMap[level][id][0] < +dailyPB[level][dateStr][7]) {
                                    dailyPB[level][dateStr][7] = BVMap[level][id][0];
                                    dailyPB[level][dateStr][8] = id;
                                }
                            } else {
                                dailyPB[level][dateStr][7] = BVMap[level][id][0];
                                dailyPB[level][dateStr][8] = id;
                            }
                        }
                    } else {
                        dailyPB[level][dateStr] = [1, BVMap[level][id][0], id, BVMap[level][id][3], id, BVMap[level][id][4], id];
                        if (BVMap[level][id][1] == 1) {
                            dailyPB[level][dateStr][7] = BVMap[level][id][0];
                            dailyPB[level][dateStr][8] = id;
                        }
                    }
                }
            }

            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            pbOfBVMap[newDate] = pbOfBV;
            
            console.log('BVPB新统计', pbOfBV);
            console.log(pbOfBVMap);
            console.log('每日PB', dailyPB);

            chrome.storage.local.set({ pbOfBV: pbOfBV });
            chrome.storage.local.set({ pbOfBVMap: pbOfBVMap });
            chrome.storage.local.set({ dailyPB: dailyPB });
            setTimeout(() => {
                displayBVPB();
                displayDailyPB();
            }, 100);
        });
    });

    /* PK功能 */
    document.getElementById('downloadPbofBV').addEventListener('click', function() {
        chrome.storage.local.get(['personalData', 'pbOfBV'], function (result) {
            if (result.personalData && result.personalData[29]) {
                var downloadJson = {};
                downloadJson['userName'] = result.personalData[29][0];
                downloadJson['pbOfBV'] = result.pbOfBV;
                const jsonData = JSON.stringify(downloadJson, null, 2); // 格式化 JSON
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'BVPB_' + result.personalData[29][0] + '.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url); // 释放 URL 对象
            } else {
                window.alert('请先在“个人数据”页“刷新个人数据”提取昵称');
            }
        });
    });
    document.getElementById('uploadPbofBV').addEventListener('click', function () {
        document.getElementById('pbofBVInput').click(); // 点击button触发input
    });
    document.getElementById('pbofBVInput').onchange = function(event) {
        const file = event.target.files[0]; // 获取选中的文件
        const reader = new FileReader();
        // 成功读取后解析文件
        reader.onload = function (event) {
            try {
                const pbNew = JSON.parse(event.target.result);
                console.log(pbNew);
                chrome.storage.local.set({ pbOfBVNew: pbNew });
                document.getElementById('pkOpponent').textContent = '当前对阵账号：' + pbNew.userName;
                document.getElementById('pkStatus').textContent = 1;
                displayBVPBNew();
            } catch (e) {
                console.error('导入pb数据失败', e);
                window.alert('导入pb数据失败');
            }
        };
        reader.readAsText(file);
    }
});
/* 每日PB */
document.addEventListener('DOMContentLoaded', function() {
    displayDailyPB();
    // 等级按钮
    const levelButtons = document.querySelectorAll('.dailyPBLevelButton');
    levelButtons.forEach(button => {
        button.addEventListener('click', function () {
            levelButtons.forEach(btn => { // 先移除所有按钮的activeButton类
                btn.classList.remove('activeButton');
            });
            this.classList.add('activeButton'); // 为当前点击的按钮添加activeButton类
            var match = this.id.match(/\d+$/);
            document.getElementById('dailyPBLevel').textContent = parseInt(match[0]);
            displayDailyPB();
        });
    });
    // 类别按钮
    const typeButtons = document.querySelectorAll('.dailyPBTypeButton');
    typeButtons.forEach(button => {
        button.addEventListener('click', function () {
            typeButtons.forEach(btn => { // 先移除所有按钮的activeButton类
                btn.classList.remove('activeButton');
            });
            this.classList.add('activeButton'); // 为当前点击的按钮添加activeButton类
            var match = this.id.match(/\d+$/);
            document.getElementById('dailyPBType').textContent = parseInt(match[0]);
            displayDailyPB();
        });
    });
    // 年份按钮
    chrome.storage.local.get('dailyPB', function(result) {
        let dailyPB = result.dailyPB;
        if (dailyPB) {
            const today = new Date();
            var currentYear = today.getUTCFullYear();
            var beginYear = currentYear
            if (dailyPB[1]) {
                const date1 = Object.keys(dailyPB[1]).reduce((earliest, current) => {
                    return new Date(current) < new Date(earliest) ? current : earliest;
                });
                if (Number(date1.slice(0, 4)) < beginYear) {
                    beginYear = Number(date1.slice(0, 4));
                }
            }
            if (dailyPB[2]) {
                const date2 = Object.keys(dailyPB[2]).reduce((earliest, current) => {
                    return new Date(current) < new Date(earliest) ? current : earliest;
                });
                if (Number(date2.slice(0, 4)) < beginYear) {
                    beginYear = Number(date2.slice(0, 4));
                }
            }
            if (dailyPB[3]) {
                const date3 = Object.keys(dailyPB[3]).reduce((earliest, current) => {
                    return new Date(current) < new Date(earliest) ? current : earliest;
                });
                if (Number(date3.slice(0, 4)) < beginYear) {
                    beginYear = Number(date3.slice(0, 4));
                }
            }
            for (let year = beginYear; year <= currentYear; year++) {
                let yearButton = document.createElement('button');
                yearButton.id = `dailyPB-${year}`;
                yearButton.className = 'pbOfBVButton dailyPBYearButton';
                yearButton.textContent = `${year}`;
                document.getElementById('dailyPB-lastYear').insertAdjacentElement('afterend', yearButton);
            }
            const yearButtons = document.querySelectorAll('.dailyPBYearButton');
            yearButtons.forEach(button => {
                button.addEventListener('click', function () {
                    yearButtons.forEach(btn => { // 先移除所有按钮的activeButton类
                        btn.classList.remove('activeButton');
                    });
                    this.classList.add('activeButton'); // 为当前点击的按钮添加activeButton类
                    var match = this.id.match(/\d+$/);
                    document.getElementById('dailyPBYear').textContent = match ? parseInt(match[0]) : 0;
                    displayDailyPB();
                });
            });
        }
    })
});
function displayDailyPB() {
    // 初级1 中级2 高级3
    const level = document.getElementById('dailyPBLevel').textContent;
    // 局数0 时间1 bvs3 效率5 盲扫7
    const type = document.getElementById('dailyPBType').textContent;
    // 0为近一年
    const year = document.getElementById('dailyPBYear').textContent;
    chrome.storage.local.get('dailyPB', function(result) {
        if (result.dailyPB) {
            let dailyPB = result.dailyPB;
            if (dailyPB[level]) {
                document.getElementById('nodailyPB').style.display = 'none';
                generateDailyPBTableArea();
                // 选择日期范围
                const today = new Date(); // 当前日期，显示结束日
                if (year == 0) {
                    const endDate = new Date(today);
                    endDate.setDate(endDate.getUTCDate() + (7 - today.getUTCDay()) % 7); // 表格结束日：本周周日
                    const startDate = new Date(endDate);
                    startDate.setDate(startDate.getUTCDate() - 53  * 7 + 1); // 表格起始日：52周前的周一
                    generateDateCell(startDate, startDate, today, dailyPB[level], level, type);
                } else {
                    const startDate = new Date(year, 0, 1);
                    const firstDate = new Date(startDate);
                    firstDate.setDate(firstDate.getUTCDate() - (firstDate.getUTCDay() - 1) % 7);
                    const endDate = new Date(year, 11, 31);
                    if (endDate < today) {
                        generateDateCell(firstDate, startDate, endDate, dailyPB[level], level, type);
                    } else {
                        generateDateCell(firstDate, startDate, today, dailyPB[level], level, type);
                    }
                }
                initDailyPBTooltip();
            } else {
                document.getElementById('nodailyPB').style.display = 'block';
                // document.getElementById('dailyPBTable').innerHTML = '';
            }
        } else {
            document.getElementById('nodailyPB').style.display = 'block';
            // document.getElementById('dailyPBTable').innerHTML = '';
        }
    });

}
function generateDailyPBTableArea() { // 生成表格区域
    const dailyPBTable = document.getElementById('dailyPBTable');
    // var weekNum = 53;
    // var dayNum = 7;
    let tableHtml = '<tbody>';
    var weekDayLabel = ['一', '二', '三', '四', '五', '六', '日'];
    for (let i = 0; i < 7; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 53; j++) {
            tableHtml += '<td class="dailyPBDayCell"></td>';
        }
        tableHtml += `<td class="dailyPBLabel">${weekDayLabel[i]}</td></tr>`;
    }
    for (let j = 0; j < 53; j++) {
        tableHtml += '<td class="dailyPBLabel"></td>';
    }
    tableHtml += '<td class="dailyPBLabel">月份</td>';
    tableHtml += '</tbody>';
    dailyPBTable.innerHTML = tableHtml;
}
function generateDateCell(firstDate, startDate, endDate, data, level, type) { // 生成每日显示
    const dailyPBTable = document.getElementById('dailyPBTable');
    var dataMin = null; // 最小数据
    var dataMax = null; // 最大数据
    // 先过一遍算极值，把数据存入格子
    for (let week = 0; week < 53; week++) { // 第几周
        for (let weekday = 0; weekday < 7; weekday++) { // 周一到周日
            // 计算当前日期
            const currentDate = new Date(firstDate);
            currentDate.setDate(currentDate.getUTCDate() + week * 7 + weekday);
            if (currentDate.getUTCDate() == 1) {
                dailyPBTable.rows[7].cells[week].textContent = currentDate.getUTCMonth() + 1;
            }
            // 定位日期格子
            const cell = dailyPBTable.rows[weekday].cells[week];
            if (currentDate < startDate || currentDate > endDate) { // 日期范围以外的格子去掉底色
                cell.style.backgroundColor = 'transparent';
            } else {
                const dateStr = formatDate(currentDate); // 格式化日期
                var pbData = 0;
                if (data[[dateStr]]) {
                    if (type == 5 && Number(data[dateStr][type].replace('%', '')) >= 100) { // 只记录达到100的效率
                        pbData = Number(data[dateStr][type].replace('%', ''));
                    } else {
                        pbData = Number(data[dateStr][type] || 0);
                    }
                }
                if (pbData > 0) {
                    // 更新极值
                    if (!dataMin || pbData < dataMin) {
                        dataMin = pbData;
                    }
                    if (!dataMax || pbData > dataMax) {
                        dataMax = pbData;
                    }
                    // 设置数据属性
                    cell.setAttribute('cellDate', dateStr);
                    cell.setAttribute('cellValue', pbData);
                    if (type > 0) {
                        cell.style.cursor = 'pointer';
                        cell.onclick = function() {
                            window.open('https://minesweeper.online/cn/game/' + data[dateStr][+type + 1]);
                        }
                    }
                }
            }
        }        
    }
    // 第二遍过刷颜色
    for (let week = 0; week < 53; week++) { // 第几周
        for (let weekday = 0; weekday < 7; weekday++) { // 周一到周日
            const cell = dailyPBTable.rows[weekday].cells[week];
            if (cell.getAttribute('cellValue')) {
                cell.style.backgroundColor = getColorForDateCell(cell, dataMin, dataMax, level, type); // 设置格子颜色
            }
        }
    }
}
function getColorForDateCell(cell, dataMin, dataMax, level, type) { // 颜色选择
    // var desc = 1;
    // if (type == 1) { // 只有时间是升序，最小数据是最优数据
    //     desc = 0;
    // }
    const pbData = cell.getAttribute('cellValue');
    if (type == 0) { // 局数绿色
        if (pbData <= dataMin + (dataMax - dataMin) * 0.1) {
            return '#c6e7c0';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.3) {
            return '#9be9a8';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.5) {
            return '#40c463';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.7) {
            return '#30a14e';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.9) {
            return '#216e39';
        } else {
            return '#144d27';
        }
    } else if (type == 1) { // 时间粉色
        if (level == 3) {
            if (pbData >= 100) {
                return '#ffd6e7';
            } else if (pbData >= 80) {
                return '#ffb3d9';
            } else if (pbData >= 70) {
                return '#ff8fbf';
            } else if (pbData >= 60) {
                return '#f368a0';
            } else if (pbData >= 50) {
                return '#e64980';
            } else {
                return '#c2255c';
            }
        } else if (level == 2) {
            if (pbData >= 30) {
                return '#ffd6e7';
            } else if (pbData >= 24) {
                return '#ffb3d9';
            } else if (pbData >= 20) {
                return '#ff8fbf';
            } else if (pbData >= 16) {
                return '#f368a0';
            } else if (pbData >= 12) {
                return '#e64980';
            } else {
                return '#c2255c';
            }
        } else if (level == 1) {
            if (pbData >= 5) {
                return '#ffd6e7';
            } else if (pbData >= 3) {
                return '#ffb3d9';
            } else if (pbData >= 2) {
                return '#ff8fbf';
            } else if (pbData >= 1) {
                return '#f368a0';
            } else if (pbData >= 0.7) {
                return '#e64980';
            } else {
                return '#c2255c';
            }
        }
    } else if (type == 3) { // bvs红色
        if (pbData <= dataMin + (dataMax - dataMin) * 0.4) {
            return '#ffd4d4';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.6) {
            return '#ffaaaa';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.8) {
            return '#ff8787';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.9) {
            return '#fa5252';
        } else if (pbData <= dataMin + (dataMax - dataMin) * 0.95) {
            return '#c92a2a';
        } else {
            return '#8a1c1c';
        }
    } else if (type == 5) { // 效率橙色
        if (level == 3) {
            if (pbData <= 110) {
                return '#ffe0b5';
            } else if (pbData <= 120) {
                return '#ffc978';
            } else if (pbData <= 130) {
                return '#ffa94d';
            } else if (pbData <= 138) {
                return '#ff922b';
            } else if (pbData <= 145) {
                return '#e67700';
            } else {
                return '#b35c00';
            }
        } else {
            if (pbData <= dataMin + (dataMax - dataMin) * 0.2) {
                return '#ffe0b5';
            } else if (pbData <= dataMin + (dataMax - dataMin) * 0.4) {
                return '#ffc978';
            } else if (pbData <= dataMin + (dataMax - dataMin) * 0.6) {
                return '#ffa94d';
            } else if (pbData <= dataMin + (dataMax - dataMin) * 0.8) {
                return '#ff922b';
            } else if (pbData <= dataMin + (dataMax - dataMin) * 0.9) {
                return '#e67700';
            } else {
                return '#b35c00';
            }
        }
    } else if (type == 7) { // 盲扫蓝色
        if (level == 3) {
            if (pbData >= 130) {
                return '#d0e3ff';
            } else if (pbData >= 100) {
                return '#a5d1ff';
            } else if (pbData >= 80) {
                return '#7db8ff';
            } else if (pbData >= 70) {
                return '#3d8bfd';
            } else if (pbData >= 60) {
                return '#0a58ca';
            } else {
                return '#083d91';
            }
        } else if (level == 2) {
            if (pbData >= 40) {
                return '#d0e3ff';
            } else if (pbData >= 30) {
                return '#a5d1ff';
            } else if (pbData >= 24) {
                return '#7db8ff';
            } else if (pbData >= 18) {
                return '#3d8bfd';
            } else if (pbData >= 14) {
                return '#0a58ca';
            } else {
                return '#083d91';
            }
        } else if (level == 1) {
            if (pbData >= 5) {
                return '#d0e3ff';
            } else if (pbData >= 3) {
                return '#a5d1ff';
            } else if (pbData >= 2) {
                return '#7db8ff';
            } else if (pbData >= 1) {
                return '#3d8bfd';
            } else if (pbData >= 0.7) {
                return '#0a58ca';
            } else {
                return '#083d91';
            }
        }
    }
}
function formatDate(date) { // 将日期转为'2025-01-01'的格式
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function initDailyPBTooltip() { // 悬浮显示
    const dailyPBTooltip = document.getElementById('dailyPBTooltip');
    const cells = document.querySelectorAll('.dailyPBDayCell');
    cells.forEach(cell => {
        cell.addEventListener('mouseover', function(e) {
            const dateStr = this.getAttribute('cellDate');
            const pbData = this.getAttribute('cellValue');
            if (dateStr) {
                dailyPBTooltip.innerHTML = `${dateStr}： ${pbData}`; // 显示内容
                dailyPBTooltip.style.display = 'block';
                updateTooltipPosition(e, dailyPBTooltip); // 浮窗位置
            }
        });
        
        cell.addEventListener('mouseout', function() {
            dailyPBTooltip.style.display = 'none';
        });
        
        cell.addEventListener('mousemove', function(e) {
            updateTooltipPosition(e, dailyPBTooltip);
        });
    });
}
function updateTooltipPosition(event, dailyPBTooltip) { // 浮窗位置
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    // 确保工具提示不会超出视口
    const tooltipWidth = dailyPBTooltip.offsetWidth;
    const tooltipHeight = dailyPBTooltip.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let finalX = x;
    let finalY = y;
    if (x + tooltipWidth > windowWidth) {
        finalX = windowWidth - tooltipWidth - 10;
    }
    if (y + tooltipHeight > windowHeight) {
        finalY = windowHeight - tooltipHeight - 10;
    }
    dailyPBTooltip.style.left = `${finalX}px`;
    dailyPBTooltip.style.top = `${finalY}px`;
}

/* 收集我的游戏数据 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'sendBVDistribution') {
        let BVDistribution = request.BVDistribution;
        let level = request.level;
        console.log('收到我的游戏数据：', BVDistribution);   // 在控制台打出结果
        // document.getElementById('buttonDistributionBV').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        if (level) { // 不考虑自定义
            chrome.storage.local.get(['BVMap', 'pbOfBV', 'pbOfBVMap', 'dailyPB'], function(result) {
                const BVMap = result.BVMap || {};
                const pbOfBV = result.pbOfBV || {};
                const pbOfBVMap = result.pbOfBVMap || {};
                const dailyPB = result.dailyPB || {};
                // const BVMap = {};
                // const pbOfBV = {};
                if (!BVMap[level]) {
                    BVMap[level] = {};
                }
                if (!pbOfBV[level]) {
                    pbOfBV[level] = {};
                }
                for (let i = 1; i < BVDistribution.length; i++) {
                    if (BVDistribution[i][9]) { // 只考虑完成的对局
                        const id = BVDistribution[i][7];
                        const bv = BVDistribution[i][3];
                        if (!BVMap[level][id]) { // 过滤掉重复提取的对局
                            // 录入所有对局记录BVMap
                            BVMap[level][id] = BVDistribution[i].slice(1);
                            // 更新BVPB
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
                                if (BVDistribution[i][2] == 1) { // 是盲扫
                                    if (pbOfBV[level][bv][7]) {
                                        pbOfBV[level][bv][7]++;
                                        if (+BVDistribution[i][1] < +pbOfBV[level][bv][8]) {
                                            pbOfBV[level][bv][8] = BVDistribution[i][1];
                                            pbOfBV[level][bv][9] = id;
                                        }
                                        if (+BVDistribution[i][4] > +pbOfBV[level][bv][10]) {
                                            pbOfBV[level][bv][10] = BVDistribution[i][4];
                                            pbOfBV[level][bv][11] = id;
                                        }
                                        if (+(BVDistribution[i][5].replace('%','')) > +(pbOfBV[level][bv][12].replace('%',''))) {
                                            pbOfBV[level][bv][12] = BVDistribution[i][5];
                                            pbOfBV[level][bv][13] = id;
                                        }
                                    } else {
                                        pbOfBV[level][bv][7] = 1;
                                        pbOfBV[level][bv][8] = BVDistribution[i][1];
                                        pbOfBV[level][bv][9] = id;
                                        pbOfBV[level][bv][10] = BVDistribution[i][4];
                                        pbOfBV[level][bv][11] = id;
                                        pbOfBV[level][bv][12] = BVDistribution[i][5];
                                        pbOfBV[level][bv][13] = id;
                                    }
                                }
                            } else {
                                pbOfBV[level][bv] = [1, BVDistribution[i][1], id, BVDistribution[i][4], id, BVDistribution[i][5], id];
                                if (BVDistribution[i][2] == 1) {
                                    pbOfBV[level][bv][7] = 1;
                                    pbOfBV[level][bv][8] = BVDistribution[i][1];
                                    pbOfBV[level][bv][9] = id;
                                    pbOfBV[level][bv][10] = BVDistribution[i][4];
                                    pbOfBV[level][bv][11] = id;
                                    pbOfBV[level][bv][12] = BVDistribution[i][5];
                                    pbOfBV[level][bv][13] = id;
                                }
                            }
                            // 更新dailyPB
                            const dateParts = BVDistribution[i][6].split(/[/ :]/); // 解析日期
                            const year = parseInt(dateParts[0]);
                            const month = parseInt(dateParts[1]) - 1;
                            const day = parseInt(dateParts[2]);
                            const hours = parseInt(dateParts[3]);
                            const minutes = parseInt(dateParts[4]);
                            const localDate = new Date(year, month, day, hours, minutes); // 自动使用浏览器时区
                            const utcYear = localDate.getUTCFullYear();
                            const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
                            const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
                            const dateStr = `${utcYear}-${utcMonth}-${utcDay}`; // 日期关键词
                            if (dailyPB[level][dateStr]) {
                                dailyPB[level][dateStr][0]++;
                                if (+BVDistribution[i][1] < +dailyPB[level][dateStr][1]) {
                                    dailyPB[level][dateStr][1] = BVDistribution[i][1];
                                    dailyPB[level][dateStr][2] = id;
                                }
                                if (+BVDistribution[i][4] > +dailyPB[level][dateStr][3]) {
                                    dailyPB[level][dateStr][3] = BVDistribution[i][4];
                                    dailyPB[level][dateStr][4] = id;
                                }
                                if (+(BVDistribution[i][5].replace('%','')) > +(dailyPB[level][dateStr][5].replace('%',''))) {
                                    dailyPB[level][dateStr][5] = BVDistribution[i][5];
                                    dailyPB[level][dateStr][6] = id;
                                }
                                if (BVDistribution[i][2] == 1) { // 是盲扫
                                    if (dailyPB[level][dateStr][7]) {
                                        if (+BVDistribution[i][1] < +dailyPB[level][dateStr][7]) {
                                            dailyPB[level][dateStr][7] = BVDistribution[i][1];
                                            dailyPB[level][dateStr][8] = id;
                                        }
                                    } else {
                                        dailyPB[level][dateStr][7] = BVDistribution[i][1];
                                        dailyPB[level][dateStr][8] = id;
                                    }
                                }
                            } else {
                                dailyPB[level][dateStr] = [1, BVDistribution[i][1], id, BVDistribution[i][4], id, BVDistribution[i][5], id];
                                if (BVDistribution[i][2] == 1) {
                                    dailyPB[level][dateStr][7] = BVDistribution[i][1];
                                    dailyPB[level][dateStr][8] = id;
                                }
                            }
                        }
                    }
                }
                const currentDate = new Date();
                const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
                pbOfBVMap[newDate] = pbOfBV;

                console.log(BVMap);
                console.log(pbOfBV);
                console.log(pbOfBVMap);
                console.log(dailyPB);
                chrome.storage.local.set({ BVMap: BVMap });
                chrome.storage.local.set({ pbOfBV: pbOfBV });
                chrome.storage.local.set({ pbOfBVMap: pbOfBVMap });
                chrome.storage.local.set({ dailyPB: dailyPB });
            });
        }
    } else if (request.action === 'sendBVDistribution500') {
        let BVDistribution = request.BVDistribution;
        let level = request.level;
        console.log('收到我的游戏数据：', BVDistribution);   // 在控制台打出结果
        // document.getElementById('buttonDistributionBV500').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        if (level) { // 不考虑自定义
            chrome.storage.local.get(['BVMap', 'pbOfBV', 'pbOfBVMap'], function(result) {
                const BVMap = result.BVMap || {};
                const pbOfBV = result.pbOfBV || {};
                const pbOfBVMap = result.pbOfBVMap || {};
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
                                if (BVDistribution[i][2] == 1) { // 是盲扫
                                    if (pbOfBV[level][bv][7]) {
                                        pbOfBV[level][bv][7]++;
                                        if (+BVDistribution[i][1] < +pbOfBV[level][bv][8]) {
                                            pbOfBV[level][bv][8] = BVDistribution[i][1];
                                            pbOfBV[level][bv][9] = id;
                                        }
                                        if (+BVDistribution[i][4] > +pbOfBV[level][bv][10]) {
                                            pbOfBV[level][bv][10] = BVDistribution[i][4];
                                            pbOfBV[level][bv][11] = id;
                                        }
                                        if (+(BVDistribution[i][5].replace('%','')) > +(pbOfBV[level][bv][12].replace('%',''))) {
                                            pbOfBV[level][bv][12] = BVDistribution[i][5];
                                            pbOfBV[level][bv][13] = id;
                                        }
                                    } else {
                                        pbOfBV[level][bv][7] = 1;
                                        pbOfBV[level][bv][8] = BVDistribution[i][1];
                                        pbOfBV[level][bv][9] = id;
                                        pbOfBV[level][bv][10] = BVDistribution[i][4];
                                        pbOfBV[level][bv][11] = id;
                                        pbOfBV[level][bv][12] = BVDistribution[i][5];
                                        pbOfBV[level][bv][13] = id;
                                    }
                                }
                            } else {
                                pbOfBV[level][bv] = [1, BVDistribution[i][1], id, BVDistribution[i][4], id, BVDistribution[i][5], id];
                                if (BVDistribution[i][2] == 1) {
                                    pbOfBV[level][bv][7] = 1;
                                    pbOfBV[level][bv][8] = BVDistribution[i][1];
                                    pbOfBV[level][bv][9] = id;
                                    pbOfBV[level][bv][10] = BVDistribution[i][4];
                                    pbOfBV[level][bv][11] = id;
                                    pbOfBV[level][bv][12] = BVDistribution[i][5];
                                    pbOfBV[level][bv][13] = id;
                                }
                            }
                        }
                    }
                }
                const currentDate = new Date();
                const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
                pbOfBVMap[newDate] = pbOfBV;

                console.log(BVMap);
                console.log(pbOfBV);
                console.log(pbOfBVMap);
                chrome.storage.local.set({ BVMap: BVMap });
                chrome.storage.local.set({ pbOfBV: pbOfBV });
                chrome.storage.local.set({ pbOfBVMap: pbOfBVMap });
            });
        }
    }
});

/* 全球任务排行榜选项 */
document.addEventListener('DOMContentLoaded', function() {
    let eqtsSelect = document.getElementById('eventQuestTallySeasonSelect');
    chrome.storage.local.get(['eventQuestTallyMap', 'eventQuestRawRank'], function(result) {
        if (result.eventQuestTallyMap) {
            let seasons = Object.keys(result.eventQuestTallyMap).sort().reverse();
            for (let i = 0; i < seasons.length; i++) {
                const s1 = new Option(seasons[i], seasons[i]);
                eqtsSelect.add(s1);
            }
            if (seasons.length < 2) { // 如果只有一个月的数据，补充空选项触发切换
                const s0 = new Option('', 0);
                eqtsSelect.add(s0);
            }
        }
    });
    eqtsSelect.addEventListener('change', function() {
        if (eqtsSelect.value > 0) { // 忽略空选项
            displayEventQuestTally();
        }
    });
});

const arenaExpectTime = [
    [37.5, 90, 165, 300, 462.5, 675, 910, 1200],
    [ 37.5, 90, 165, 300, 462.5, 675, 910, 1200 ],
    [ 30, 75, 135, 220, 375, 555, 787.5, 1040 ],
    [ 15, 45, 90, 150, 225, 330, 455, 600 ],
    [ 37.5, 75, 150, 300, 450, 750, 1000, 1250 ],
    [ 55, 130, 255, 380, 505, 755, 1005, 1255 ],
    [ 30, 75, 135, 220, 375, 555, 787.5, 1040 ],
    [ 30, 75, 135, 220, 325, 450, 647.5, 900 ],
    [ 75, 275, 562.5, 1000, 1562.5, 2250, 3062.5, 4000 ],
    [ 375, 1000, 1875, 3000, 4375, 6000, 8750, 12000 ]
]
const arenaPreCoef = [4.5, 4.5, 5.1924, 9, 4.32, 4.3028, 5.1924, 6, 4.5, 4.5]; // 竞技场用时预分配系数，用于配齐默认系数为1
const tm = 10;
const lm = 8;
/* 设置页 */
document.addEventListener('DOMContentLoaded', function() {
    /* 读当前设置 */
    chrome.storage.local.get(['pId', 'configurableCoef'], function (result) {
        const pId = result.pId;
        if (pId) {
            document.getElementById('pIdNow').innerText = pId;
            document.getElementById('personalId').placeholder = pId;
        } else {
            document.getElementById('personalId').placeholder = '请设置账号';
        }
        const configurableCoef = result.configurableCoef;
        if (!configurableCoef) {
            configurableCoef = [2.5, 56.6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 56.6];
        }
        // if (configurableCoef) {
            document.getElementById('act2ep').placeholder = configurableCoef[0];
            document.getElementById('ep2mc').placeholder = configurableCoef[1];
            document.getElementById('spArenaCoef').placeholder = configurableCoef[2];
            document.getElementById('spngArenaCoef').placeholder = configurableCoef[3];
            document.getElementById('nfArenaCoef').placeholder = configurableCoef[4];
            document.getElementById('effArenaCoef').placeholder = configurableCoef[5];
            document.getElementById('hdArenaCoef').placeholder = configurableCoef[6];
            document.getElementById('rdArenaCoef').placeholder = configurableCoef[7];
            document.getElementById('hcArenaCoef').placeholder = configurableCoef[8];
            document.getElementById('hcngArenaCoef').placeholder = configurableCoef[9];
            document.getElementById('edArenaCoef').placeholder = configurableCoef[10];
            document.getElementById('nmArenaCoef').placeholder = configurableCoef[11];
            document.getElementById('hp2mc').placeholder = configurableCoef[12];
        // } else {
        //     document.getElementById('act2ep').placeholder = 2.5;
        //     document.getElementById('ep2mc').placeholder = 56.6;
        //     document.getElementById('spArenaCoef').placeholder = 1;
        //     document.getElementById('spngArenaCoef').placeholder = 1;
        //     document.getElementById('nfArenaCoef').placeholder = 1;
        //     document.getElementById('effArenaCoef').placeholder = 1;
        //     document.getElementById('hdArenaCoef').placeholder = 1;
        //     document.getElementById('rdArenaCoef').placeholder = 1;
        //     document.getElementById('hcArenaCoef').placeholder = 1;
        //     document.getElementById('hcngArenaCoef').placeholder = 1;
        //     document.getElementById('edArenaCoef').placeholder = 1;
        //     document.getElementById('nmArenaCoef').placeholder = 1;
        //     document.getElementById('hp2mc').placeholder = 56.6;
        // }
        const acsTable = document.getElementById('arenaCoefSettingTable');
        for (let t = 0; t < tm; t++) {
            for (let l = 0; l < lm; l++) {
                var time = arenaExpectTime[t][l] * configurableCoef[t + 2] * arenaPreCoef[t];
                var h = time / 3600 | 0;
                var m = (time - h * 3600) / 60 | 0;
                var s = (time - h * 3600 - m * 60) | 0;
                if (h > 100) {
                    acsTable.rows[t + 1].cells[l + 2].textContent = String(h).padStart(3, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
                } else {
                    acsTable.rows[t + 1].cells[l + 2].textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
                }
            }
        }
    });
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        document.getElementById('toggleSwitch1').checked = autoUpdate[0][0];
        document.getElementById('hourSelect1').value = autoUpdate[0][1];
        document.getElementById('minuteSelect1').value = autoUpdate[0][2];
        document.getElementById('secondSelect1').value = autoUpdate[0][3];
        document.getElementById('toggleSwitch2').checked = autoUpdate[1][0];
        document.getElementById('hourSelect2').value = autoUpdate[1][1];
        document.getElementById('minuteSelect2').value = autoUpdate[1][2];
        document.getElementById('secondSelect2').value = autoUpdate[1][3];
        document.getElementById('toggleSwitch3').checked = autoUpdate[2][0];
        document.getElementById('hourSelect3').value = autoUpdate[2][1];
        document.getElementById('minuteSelect3').value = autoUpdate[2][2];
        document.getElementById('secondSelect3').value = autoUpdate[2][3];
        document.getElementById('toggleSwitchAt').checked = autoUpdate[3][0];
    });
    /* 自动刷新下拉菜单 */
    const h1 = document.getElementById('hourSelect1');
    const m1 = document.getElementById('minuteSelect1');
    const s1 = document.getElementById('secondSelect1');
    const h2 = document.getElementById('hourSelect2');
    const m2 = document.getElementById('minuteSelect2');
    const s2 = document.getElementById('secondSelect2');
    const h3 = document.getElementById('hourSelect3');
    const m3 = document.getElementById('minuteSelect3');
    const s3 = document.getElementById('secondSelect3');
    for (let hour = 0; hour < 24; hour++) { // 生成小时选项
        let o1 = document.createElement('option');
        o1.value = hour;
        o1.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h1.appendChild(o1);
        let o2 = document.createElement('option');
        o2.value = hour;
        o2.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h2.appendChild(o2);
        let o3 = document.createElement('option');
        o3.value = hour;
        o3.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h3.appendChild(o3);
    }
    for (let min = 0; min < 60; min++) { // 生成分钟选项
        let o1 = document.createElement('option');
        o1.value = min;
        o1.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m1.appendChild(o1);
        let o2 = document.createElement('option');
        o2.value = min;
        o2.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m2.appendChild(o2);
        let o3 = document.createElement('option');
        o3.value = min;
        o3.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m3.appendChild(o3);
    }
    for (let sec = 0; sec < 60; sec++) { // 生成秒钟选项
        let o1 = document.createElement('option');
        o1.value = sec;
        o1.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s1.appendChild(o1);
        let o2 = document.createElement('option');
        o2.value = sec;
        o2.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s2.appendChild(o2);
        let o3 = document.createElement('option');
        o3.value = sec;
        o3.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s3.appendChild(o3);
    }
    /* 保存设置 */
    document.getElementById('saveSetting').addEventListener('click', function () {
        /* 刷新时间 */
        {
            var autoUpdate = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0]];
            autoUpdate[0][0] = document.getElementById('toggleSwitch1').checked;
            if (autoUpdate[0][0]) {
                dailyTaskUpdate();
            }
            autoUpdate[0][1] = h1.value;
            autoUpdate[0][2] = m1.value;
            autoUpdate[0][3] = s1.value;

            autoUpdate[1][0] = document.getElementById('toggleSwitch2').checked;
            if (autoUpdate[1][0]) {
                dailyTaskEventArena();
            }
            autoUpdate[1][1] = h2.value;
            autoUpdate[1][2] = m2.value;
            autoUpdate[1][3] = s2.value;

            autoUpdate[2][0] = document.getElementById('toggleSwitch3').checked;
            if (autoUpdate[2][0]) {
                dailyTaskFriendQuest();
            }
            autoUpdate[2][1] = h3.value;
            autoUpdate[2][2] = m3.value;
            autoUpdate[2][3] = s3.value;

            autoUpdate[3][0] = document.getElementById('toggleSwitchAt').checked;

            chrome.storage.local.set({ autoUpdate: autoUpdate });
        }
        /* uid */
        {
            const pId = document.getElementById('personalId').value;
            if (pId.trim() === '') {
                document.getElementById('saveSucc').innerText = '保存成功！'
                document.getElementById('saveSucc').style.display = 'block';
            } else if (!isNaN(pId)) {
                chrome.storage.local.set({ pId: pId });
                document.getElementById('pIdNow').innerText = pId;
                document.getElementById('personalId').placeholder = pId;
                document.getElementById('saveSucc').innerText = '保存成功！'
                document.getElementById('saveSucc').style.display = 'block';
            } else {
                document.getElementById('saveSucc').innerText = 'ID格式错误'
                document.getElementById('saveSucc').style.display = 'block';
            }
        }
        /* 可配置参数 */
        {
            var configurableCoef = [];
            if (document.getElementById('act2ep').value) {
                configurableCoef[0] = document.getElementById('act2ep').value;
            } else {
                configurableCoef[0] = document.getElementById('act2ep').placeholder;
            }
            if (document.getElementById('ep2mc').value) {
                configurableCoef[1] = document.getElementById('ep2mc').value;
            } else {
                configurableCoef[1] = document.getElementById('ep2mc').placeholder;
            }
            if (document.getElementById('hp2mc').value) {
                configurableCoef[12] = document.getElementById('hp2mc').value;
            } else {
                configurableCoef[12] = document.getElementById('hp2mc').placeholder;
            }
            if (document.getElementById('spArenaCoef').value) {
                configurableCoef[2] = document.getElementById('spArenaCoef').value;
            } else {
                configurableCoef[2] = document.getElementById('spArenaCoef').placeholder;
            }
            if (document.getElementById('spngArenaCoef').value) {
                configurableCoef[3] = document.getElementById('spngArenaCoef').value;
            } else {
                configurableCoef[3] = document.getElementById('spngArenaCoef').placeholder;
            }
            if (document.getElementById('nfArenaCoef').value) {
                configurableCoef[4] = document.getElementById('nfArenaCoef').value;
            } else {
                configurableCoef[4] = document.getElementById('nfArenaCoef').placeholder;
            }
            if (document.getElementById('effArenaCoef').value) {
                configurableCoef[5] = document.getElementById('effArenaCoef').value;
            } else {
                configurableCoef[5] = document.getElementById('effArenaCoef').placeholder;
            }
            if (document.getElementById('hdArenaCoef').value) {
                configurableCoef[6] = document.getElementById('hdArenaCoef').value;
            } else {
                configurableCoef[6] = document.getElementById('hdArenaCoef').placeholder;
            }
            if (document.getElementById('rdArenaCoef').value) {
                configurableCoef[7] = document.getElementById('rdArenaCoef').value;
            } else {
                configurableCoef[7] = document.getElementById('rdArenaCoef').placeholder;
            }
            if (document.getElementById('hcArenaCoef').value) {
                configurableCoef[8] = document.getElementById('hcArenaCoef').value;
            } else {
                configurableCoef[8] = document.getElementById('hcArenaCoef').placeholder;
            }
            if (document.getElementById('hcngArenaCoef').value) {
                configurableCoef[9] = document.getElementById('hcngArenaCoef').value;
            } else {
                configurableCoef[9] = document.getElementById('hcngArenaCoef').placeholder;
            }
            if (document.getElementById('edArenaCoef').value) {
                configurableCoef[10] = document.getElementById('edArenaCoef').value;
            } else {
                configurableCoef[10] = document.getElementById('edArenaCoef').placeholder;
            }
            if (document.getElementById('nmArenaCoef').value) {
                configurableCoef[11] = document.getElementById('nmArenaCoef').value;
            } else {
                configurableCoef[11] = document.getElementById('nmArenaCoef').placeholder;
            }
            chrome.storage.local.set({ configurableCoef: configurableCoef });
            const acsTable = document.getElementById('arenaCoefSettingTable');
            for (let t = 0; t < tm; t++) {
                for (let l = 0; l < lm; l++) {
                    var time = arenaExpectTime[t][l] * configurableCoef[t + 2] * arenaPreCoef[t];
                    var h = time / 3600 | 0;
                    var m = (time - h * 3600) / 60 | 0;
                    var s = (time - h * 3600 - m * 60) | 0;
                    if (h > 100) {
                        acsTable.rows[t + 1].cells[l + 2].textContent = String(h).padStart(3, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
                    } else {
                        acsTable.rows[t + 1].cells[l + 2].textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
                    }
                }
            }
        }
    });
    /* 备份数据 */
    document.getElementById('backupButton').addEventListener('click', function () {
        chrome.storage.local.get(null, function (result) {
            const jsonData = JSON.stringify(result, null, 2); // 格式化 JSON
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const currentDate = new Date();
            const d = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            a.download = 'WoM_helper_backup-' + d + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // 释放 URL 对象
        });
    });
    /* 恢复数据 */
    document.getElementById('restoreButton').addEventListener('click', function () {
        document.getElementById('restoreInput').click(); // 点击button触发input
    });
    document.getElementById('restoreInput').onchange = function(event) {
        const file = event.target.files[0]; // 获取选中的文件
        const reader = new FileReader();
        // 成功读取后解析文件
        reader.onload = function (event) {
            try {
                const dataIn = JSON.parse(event.target.result);
                chrome.storage.local.get(null, function(result) {
                    /* 宝石场币 */
                    let gpMap = result.gemsPriceMap || {};
                    const gpMapIn = dataIn['gemsPriceMap'];
                    if (gpMapIn) {
                        for (const key in gpMapIn) {
                            gpMap[key] = gpMapIn[key];
                        }
                        chrome.storage.local.set({ gemsPriceMap: gpMap });
                    }
                    /* 竞技场门票 */
                    let tpMap = result.ticketPriceMap || {};
                    const tpMapIn = dataIn['ticketPriceMap'];
                    if (tpMapIn) {
                        for (const key in tpMapIn) {
                            tpMap[key] = tpMapIn[key];
                        }
                        chrome.storage.local.set({ ticketPriceMap: tpMap });
                    }
                    /* 装备加成 */
                    let equipStatsMap = result.equipStatsMap || {};
                    const equipStatsMapIn = dataIn['equipStatsMap'];
                    if (equipStatsMapIn) {
                        for (const key in equipStatsMapIn) {
                            equipStatsMap[key] = equipStatsMapIn[key];
                        }
                        chrome.storage.local.set({ equipStatsMap: equipStatsMap });
                    }
                    /* 游戏数据 */
                    let stMap = result.statisticsMap || {};
                    const stMapIn = dataIn['statisticsMap'];
                    if (stMapIn) {
                        for (const key in stMapIn) {
                            stMap[key] = stMapIn[key];
                        }
                        chrome.storage.local.set({ statisticsMap: stMap });
                    }
                    /* 个人数据 */
                    let pdMap = result.personalDataMap || {};
                    const pdMapIn = dataIn['personalDataMap'];
                    if (pdMapIn) {
                        for (const key in pdMapIn) {
                            pdMap[key] = pdMapIn[key];
                        }
                        chrome.storage.local.set({ personalDataMap: pdMap });
                    }
                    /* 财产数据 */
                    let peMap = result.personalEcoMap || {};
                    const peMapIn = dataIn['personalEcoMap'];
                    if (peMapIn) {
                        for (const key in peMapIn) {
                            peMap[key] = peMapIn[key];
                        }
                        chrome.storage.local.set({ personalEcoMap: peMap });
                    }
                    /* 好友 */
                    let contactsList = result.contactsList || {};
                    const contactsListIn = dataIn['contactsList'];
                    if (contactsListIn) {
                        for (const uid in contactsListIn) {
                            if (!contactsList[uid]) {
                                contactsList[uid] = [contactsListIn[uid][0], Object.keys(contactsList).length];
                            }
                        }
                        chrome.storage.local.set({ contactsList: contactsList });
                    }
                    /* BVPB */
                    let BVMap = result.BVMap || {};
                    const BVMapIn = dataIn['BVMap'];
                    if (BVMapIn) {
                        for (let i = 1; i <= 3; i++) {
                            if (BVMapIn[i]) {
                                if (BVMap[i]) {
                                    for (const id in BVMapIn[i]) {
                                        BVMap[i][id] = BVMapIn[i][id];
                                    }
                                } else {
                                    BVMap[i] = BVMapIn[i];
                                }
                            }
                        }
                        chrome.storage.local.set({ BVMap: BVMap });
                    }
                    let pbOfBVMap = result.pbOfBVMap || {};
                    const pbOfBVMapIn = dataIn['pbOfBVMap'];
                    if (pbOfBVMapIn) {
                        for (const date in pbOfBVMapIn) {
                            pbOfBVMap[date] = pbOfBVMapIn[date];
                        }
                        chrome.storage.local.set({ pbOfBVMap: pbOfBVMap });
                    }
                    /* 活动竞技场 */
                    let eapMap = result.eaPriceMap || {};
                    const eapMapIn = dataIn['eaPriceMap'];
                    if (eapMapIn) {
                        for (const key in eapMapIn) {
                            eapMap[key] = eapMapIn[key];
                        }
                        chrome.storage.local.set({ eaPriceMap: eapMap });
                    }
                    /* 友谊任务 */
                    let fqInfo = result.friendQuestInfo || {};
                    const fqInfoIn = dataIn['friendQuestInfo'];
                    if (fqInfoIn) {
                        for (const month in fqInfoIn) {
                            if (!fqInfo[month]) {
                                fqInfo[month] = fqInfoIn[month];
                            } else {
                                for (const qsid in fqInfoIn[month].fqSend) {
                                    fqInfo[month].fqSend[qsid] = fqInfoIn[month].fqSend[qsid];
                                }
                                for (const qrid in fqInfoIn[month].fqReceive) {
                                    fqInfo[month].fqReceive[qrid] = fqInfoIn[month].fqReceive[qrid];
                                }
                                // fqInfo[month].fqSend = { ...fqInfoIn[month].fqSend, ...fqInfo[month].fqSend };
                                // fqInfo[month].fqReceive = { ...fqInfoIn[month].fqReceive, ...fqInfo[month].fqReceive };
                            }
                        }
                        chrome.storage.local.set({ friendQuestInfo: fqInfo });
                    }

                    let acMap = result.activityMap || {};
                    const acMapIn = dataIn['activityMap'];
                    if (acMapIn) {
                        for (const date in acMapIn) {
                            acMap[date] = acMapIn[date]
                        }
                        chrome.storage.local.set({ activityMap: acMap });
                    }

                    let fqDaily = result.friendQuestDaily || {};
                    const fqDailyIn = dataIn['friendQuestDaily'];
                    if (fqDailyIn) {
                        for (const date in fqDailyIn) {
                            if (!fqDaily[date]) {
                                fqDaily[date] = fqDailyIn[date];
                            } else {
                                fqDaily[date].fqSend = { ...fqDailyIn[date].fqSend, ...fqDaily[date].fqSend };
                                fqDaily[date].fqReceive = { ...fqDailyIn[date].fqReceive, ...fqDaily[date].fqReceive };
                            }
                        }
                        chrome.storage.local.set({ friendQuestDaily: fqDaily });
                    }
                    /* 全球任务 */
                    let eqtMap = result.eventQuestTallyMap || {};
                    const eqtMapIn = dataIn['eventQuestTallyMap'];
                    if (eqtMapIn) {
                        for (const month in eqtMapIn) {
                            eqtMap[month] = eqtMapIn[month]
                        }
                        chrome.storage.local.set({ eventQuestTallyMap: eqtMap });
                    }
                    let eqtRawRank = result.eventQuestRawRank || {};
                    const eqtRawRankIn = dataIn['eventQuestRawRank'];
                    if (eqtRawRankIn) {
                        for (const month in eqtRawRankIn) {
                            eqtRawRank[month] = eqtRawRankIn[month]
                        }
                        chrome.storage.local.set({ eventQuestRawRank: eqtRawRank });
                    }
                    /* 设置 */
                    let pId = result.pId;
                    const pIdIn = dataIn['pId'];
                    if (pIdIn) {
                        chrome.storage.local.set({ pId: pIdIn });
                    }
                    let autoUpdate = result.autoUpdate;
                    const autoUpdateIn = dataIn['autoUpdate'];
                    if (autoUpdateIn) {
                        chrome.storage.local.set({ autoUpdate: autoUpdateIn });
                    }
                    let configurableCoef = result.configurableCoef;
                    const configurableCoefIn = dataIn['configurableCoef'];
                    if (configurableCoefIn) {
                        chrome.storage.local.set({ configurableCoef: configurableCoefIn });
                    }
                    let advancedMode = result.advancedMode;
                    const advancedModeIn = dataIn['advancedMode'];
                    if (advancedModeIn) {
                        chrome.storage.local.set({ advancedMode: advancedModeIn });
                    }
                    /* 主题 */
                    let themeMap = result.themeMap;
                    const themeMapIn = dataIn['themeMap'];
                    if (themeMapIn) {
                        for (const theme in themeMapIn) {
                            themeMap[theme] = themeMapIn[theme]
                        }
                        chrome.storage.local.set({ themeMap: themeMap });
                    }
                    let theme = result.theme;
                    const themeIn = dataIn['theme'];
                    if (themeIn) {
                        chrome.storage.local.set({ theme: themeIn });
                    }
                });
                // location.reload();
                console.log('恢复数据成功');
            } catch (error) {
                console.error('恢复数据失败', error);
                window.alert('恢复数据失败');
            }
        };
        reader.readAsText(file); // 读取文件
    };
});

/* 帮助页 */
document.addEventListener('DOMContentLoaded', function() {
    fetch('README.md')
          .then(response => {
            if (!response.ok) {
              throw new Error(`文件加载失败: ${response.status}`);
            }
            return response.text(); // 获取文本内容
          })
          .then(markdownText => {
            // 3. 使用 marked.js 将 Markdown 转换为 HTML
            const htmlContent = marked.parse(markdownText);
            
            // 4. 将结果插入到页面中
            document.getElementById('helpMarkDown').innerHTML = htmlContent;
          })
          .catch(error => {
            // 处理错误（如文件不存在、网络问题）
            console.error('Error:', error);
            document.getElementById('helpMarkDown').innerHTML = 
              `<p style="color: red">加载失败: ${error.message}</p>`;
          });
});
 /* 每日更新数据 */
function dailyTaskUpdate() {
    const now = new Date();
    const clock = new Date();
    var tw;
    var h;
    var m;
    var s;
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        if (autoUpdate && autoUpdate[0]) {
            tw = autoUpdate[0][0];
            h = autoUpdate[0][1];
            m = autoUpdate[0][2];
            s = autoUpdate[0][3];
            clock.setHours(h, m, s, 0); // 设置更新时间
            // 如果现在时间已经过了，设置为明天的同一时间
            if (now > clock) {
                clock.setDate(now.getDate() + 1);
            }
            // 创建闹钟
            if (tw) {
                chrome.alarms.create('updateData', { when: clock.getTime() });
            }
        }
    });
}
// 设置首次调度
dailyTaskUpdate();
// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateData') {
        // document.getElementById('update').click();
        updateGems();
        updateArenaTickets();
        updateStatistics();
        updatePersonalData();
        updateEconomy();
        updateEquipmentStats();
        // 重新调度下一天的任务
        dailyTaskUpdate();
    }
});

/* 每日更新活动竞技场 */
function dailyTaskEventArena() {
    const now = new Date();
    const clock = new Date();
    var tw;
    var h;
    var m;
    var s;
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        if (autoUpdate && autoUpdate[1]) {
            tw = autoUpdate[1][0];
            h = autoUpdate[1][1];
            m = autoUpdate[1][2];
            s = autoUpdate[1][3];
            clock.setHours(h, m, s, 0); // 设置更新时间
            // 如果现在时间已经过了，设置为明天的同一时间
            if (now > clock) {
                clock.setDate(now.getDate() + 1);
            }
            // 创建闹钟
            const currentDate = new Date();
            if (tw && (currentDate.getUTCMonth() + 1) % 4 == 1 && currentDate.getUTCDate() > 3) {
                chrome.alarms.create('updateEaTask', { when: clock.getTime() });
            }
        }
    });
}
// 设置首次调度
dailyTaskEventArena();
// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateEaTask') {
        // document.getElementById('updateEa1').click();
        updateEventArenaTickets();
        // 重新调度下一天的任务
        dailyTaskEventArena();
    }
});

/* 每日更新友谊任务 */
function dailyTaskFriendQuest() {
    const now = new Date();
    const clock = new Date();
    var tw;
    var h;
    var m;
    var s;
    chrome.storage.local.get('autoUpdate', function (result) {
        const autoUpdate = result.autoUpdate;
        if (autoUpdate && autoUpdate[2]) {
            tw = autoUpdate[2][0];
            h = autoUpdate[2][1];
            m = autoUpdate[2][2];
            s = autoUpdate[2][3];
            clock.setHours(h, m, s, 0); // 设置更新时间
            // 如果现在时间已经过了，设置为明天的同一时间
            if (now > clock) {
                clock.setDate(now.getDate() + 1);
            }
            // 创建闹钟
            const currentDate = new Date();
            if (tw && (currentDate.getUTCMonth() + 1) % 4 == 2 && currentDate.getUTCDate() > 3) {
                chrome.alarms.create('updateFqTask', { when: clock.getTime() });
            }
        }
    });
} 
// 设置首次调度
dailyTaskFriendQuest();
// 监听闹钟事件
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updateFqTask') {
        // document.getElementById('updateFq').click();
        updateFriendQuestAll();
        // 重新调度下一天的任务
        dailyTaskFriendQuest();
    }
});

/* 自定义主题模板 */
const themeExample = {
    "themeName": "默认",
    "introduce": "themeName后的变量为显示在设置中的主题名，重名的可以直接覆盖；每一行[]中第一个元素为颜色，第二个元素为说明，根据说明改颜色，不要动变量名和说明",
    "headBgc": ["#70B2E2", "标题 背景色"],
    "headFc": ["#ffffff", "标题 字色"],
    "navBgc": ["#ADDFBA", "导航栏背景色"],
    "navABgc": ["#ADDFBA", "导航栏项目 背景色"],
    "navAFc": ["#333333", "导航栏项目 字色"],
    "navHvBgc": ["#D6EBB3", "导航栏项目悬停 背景色"],
    "navHvFc": ["#333333", "导航栏项目 悬停 字色"],
    "navAcBgc": ["#7AD295", "导航栏项目 激活 背景色"],
    "navAcFc": ["#ffffff", "导航栏项目 激活 字色"],
    "navEvBgc": ["#bbc3f1", "导航栏活动项 背景色"],
    "navEvFc": ["#333333", "导航栏活动项 字色"],
    "navEvHvBgc": ["#bbd9f1", "导航栏活动项 悬停 背景色"],
    "navEvHvFc": ["#333333", "导航栏活动项 悬停 字色"],
    "navEvAcBgc": ["#92a1f7", "导航栏活动项 激活 背景色"],
    "navEvAcFc": ["#ffffff", "导航栏活动项 激活 字色"],
    "navUpBgc": ["#fdda4f", "导航栏刷新/链接项 背景色"],
    "navUpFc": ["#333333", "导航栏刷新/链接项 字色"],
    "navUpHvBgc": ["#fdda4f", "导航栏刷新/链接项 悬停 背景色"],
    "navUpHvFc": ["#333333", "导航栏刷新/链接项 悬停 字色"],
    "contentBgc": ["#ffffff", "内容区域 背景色"],
    "contentFc": ["#000000", "内容区域 字色"],
    "tableFc": ["#000000", "表格 字色"],
    "tableOddRowBgc": ["#E4EEC9", "表格 奇数行 背景色"],
    "tableEvenRowBgc": ["#d4ebf9", "表格 偶数行 背景色"],
    "tableTic1ColBgc": ["#E4EEC9", "有标题的表格 标题列 背景色"],
    "tableTic1RowBgc": ["#E4EEC9", "有标题的表格 标题行 背景色"],
    "tableTicOddRowBgc": ["#a8dfff", "有标题的表格 奇数行 背景色"],
    "tableTicEvenRowBgc": ["#d4ebf9", "有标题的表格 偶数行 背景色"],
    "tableTicHvRowBgc": ["#6bc1f3", "有标题的表格 悬停行 背景色"],
    "tableExtraRowBgc": ["#ddf196", "表格 额外标题（奖杯栏）"],
    "atv1BestBgc": ["#b3eb9d", "门票价格图例 最赚"],
    "atv1MidBgc": ["#ddf196", "门票价格图例 次赚"],
    "atv1WorstBgc": ["#e4c79a", "门票价格图例 最亏"],
    "levelFirstColor": ["#63BE7B", "色阶 最优颜色"],
    "levelSecondColor": ["#FFEB84", "色阶 中间颜色"],
    "levelThirdColor": ["#F8696B", "色阶 最差颜色"],
    "buttonBgc": ["#D8F1EE", "按钮 背景色"],
    "buttonFc": ["#000000", "按钮 字色"],
    "buttonAcBgc": ["#8fc4ef", "按钮 激活 背景色"],
    "buttonAcFc": ["#000000", "按钮 激活 字色"],
    "buttonProgBgc": ["#ff9f18", "按钮 运行中 背景色"],
    "buttonSuccBgc": ["#4caf50", "按钮 提取成功 背景色"],
    "inputBgc": ["#eefff8", "输入框 背景色"],
    "inputBdc": ["#cccccc", "输入框 边框色"],
    "inputFc": ["#000000", "输入框 字色"],
    "inputPhFc": ["#757575", "输入框 默认内容 字色"],
    "inputHvBdc": ["#6bc1f3", "输入框 悬停 边框色"],
    "inputHvSdc": ["#007bff80", "输入框 悬停 阴影色"],
    "inputFcBdc": ["#6bc1f3", "输入框 聚焦 边框色"],
    "inputFcSdc": ["#007bff80", "输入框 聚焦 阴影色"],
    "sliderCircleC": ["#ffffff", "滑块 填充色"],
    "sliderOffBgc": ["#cccccc", "滑块 关闭 背景色"],
    "sliderOnBgc": ["#8cda8f", "滑块 开启 背景色"],
    "selectBgc": ["#eefff8", "下拉菜单 背景色"],
    "selectBdc": ["#cccccc", "下拉菜单 边框色"],
    "selectFc": ["#000000", "下拉菜单 字色"],
    "selectOpBgc": ["#eefff8", "下拉菜单选项 背景色"],
    "floatCopyBgc": ["#e0fbd5", "悬浮提醒 已复制 背景色"],
    "floatCopyFc": ["#000000", "悬浮提醒 已复制 字色"],
    "floatTreeBgc": ["#000000cc", "悬浮提醒 树状图 背景色"],
    "floatTreeFc": ["#ffffff", "悬浮提醒 树状图 字色"],
    "floatHeatBgc": ["#000000cc", "悬浮提醒 热点图 背景色"],
    "floatHeatFc": ["#ffffff", "悬浮提醒 热点图 字色"],
    "cellBgc": ["#ebedf0", "热点图空白格 背景色"],
    "perfectLineNotiFc": ["#db0000", "未达到完美线的高亮字色"],
    "bvpkWin": ["#5bd56b", "bvpk获胜 背景色"],
    "bvpkLose": ["#fbaa78", "bvpk失败 背景色"],
    "bvpkDraw": ["#d4ebf9", "bvpk平局 背景色"],
    "bvpkSolo": ["#a9efb4", "bvpk独占 背景色"],
    "dailyPBLabelFc": ["#000000", "每日pb标签字色"]
};
/* 预设主题 */
const defaultThemes = {
    "默认": {}, 
    "深色": {
        "themeName": "深色",
        "introduce": "",
        "headBgc": ["#24292e", "标题 背景色"],
        "headFc": ["#f6f8fa", "标题 字色"],
        "navBgc": ["#2d333b", "导航栏背景色"],
        "navABgc": ["#2d333b", "导航栏项目 背景色"],
        "navAFc": ["#adbac7", "导航栏项目 字色"],
        "navHvBgc": ["#373e47", "导航栏项目悬停 背景色"],
        "navHvFc": ["#cdd9e5", "导航栏项目 悬停 字色"],
        "navAcBgc": ["#444c56", "导航栏项目 激活 背景色"],
        "navAcFc": ["#ffffff", "导航栏项目 激活 字色"],
        "navEvBgc": ["#053275", "导航栏活动项 背景色"],
        "navEvFc": ["#ffffff", "导航栏活动项 字色"],
        "navEvHvBgc": ["#123a7b", "导航栏活动项 悬停 背景色"],
        "navEvHvFc": ["#ffffff", "导航栏活动项 悬停 字色"],
        "navEvAcBgc": ["#0c4ba3", "导航栏活动项 激活 背景色"],
        "navEvAcFc": ["#ffffff", "导航栏活动项 激活 字色"],
        "navUpBgc": ["#d19300", "导航栏刷新/链接项 背景色"],
        "navUpFc": ["#24292e", "导航栏刷新/链接项 字色"],
        "navUpHvBgc": ["#d6a62b", "导航栏刷新/链接项 悬停 背景色"],
        "navUpHvFc": ["#24292e", "导航栏刷新/链接项 悬停 字色"],
        "contentBgc": ["#1e2227", "内容区域 背景色"],
        "contentFc": ["#dae5f0", "内容区域 字色"],
        "tableFc": ["#ecf1f5", "表格 字色"],
        "tableOddRowBgc": ["#2d333b", "表格 奇数行 背景色"],
        "tableEvenRowBgc": ["#22272e", "表格 偶数行 背景色"],
        "tableTic1ColBgc": ["#373e47", "有标题的表格 标题列 背景色"],
        "tableTic1RowBgc": ["#373e47", "有标题的表格 标题行 背景色"],
        "tableTicOddRowBgc": ["#2d333b", "有标题的表格 奇数行 背景色"],
        "tableTicEvenRowBgc": ["#22272e", "有标题的表格 偶数行 背景色"],
        "tableTicHvRowBgc": ["#316dca", "有标题的表格 悬停行 背景色"],
        "tableExtraRowBgc": ["#f0b72f", "表格 额外标题（奖杯栏）"],
        "atv1BestBgc": ["#2da44e", "门票价格图例 最赚"],
        "atv1MidBgc": ["#f0b72f", "门票价格图例 次赚"],
        "atv1WorstBgc": ["#d33a2f", "门票价格图例 最亏"],
        "levelFirstColor": ["#2da44e", "色阶 最优颜色"],
        "levelSecondColor": ["#f0b72f", "色阶 中间颜色"],
        "levelThirdColor": ["#d33a2f", "色阶 最差颜色"],
        "buttonBgc": ["#373e47", "按钮 背景色"],
        "buttonFc": ["#e1e1e1", "按钮 字色"],
        "buttonAcBgc": ["#1d509d", "按钮 激活 背景色"],
        "buttonAcFc": ["#ffffff", "按钮 激活 字色"],
        "buttonProgBgc": ["#f0b72f", "按钮 运行中 背景色"],
        "buttonSuccBgc": ["#2da44e", "按钮 提取成功 背景色"],
        "inputBgc": ["#2d333b", "输入框 背景色"],
        "inputBdc": ["#444c56", "输入框 边框色"],
        "inputFc": ["#ecf1f5", "输入框 字色"],
        "inputPhFc": ["#757575", "输入框 默认内容 字色"],
        "inputHvBdc": ["#4184e4", "输入框 悬停 边框色"],
        "inputHvSdc": ["#4184e480", "输入框 悬停 阴影色"],
        "inputFcBdc": ["#4184e4", "输入框 聚焦 边框色"],
        "inputFcSdc": ["#4184e480", "输入框 聚焦 阴影色"],
        "sliderCircleC": ["#f6f8fa", "滑块 填充色"],
        "sliderOffBgc": ["#444c56", "滑块 关闭 背景色"],
        "sliderOnBgc": ["#2da44e", "滑块 开启 背景色"],
        "selectBgc": ["#2d333b", "下拉菜单 背景色"],
        "selectBdc": ["#444c56", "下拉菜单 边框色"],
        "selectFc": ["#ecf1f5", "下拉菜单 字色"],
        "selectOpBgc": ["#373e47", "下拉菜单选项 背景色"],
        "floatCopyBgc": ["#2d333b", "悬浮提醒 已复制 背景色"],
        "floatCopyFc": ["#adbac7", "悬浮提醒 已复制 字色"],
        "floatTreeBgc": ["#2d333bcc", "悬浮提醒 树状图 背景色"],
        "floatTreeFc": ["#adbac7", "悬浮提醒 树状图 字色"],
        "floatHeatBgc": ["#2d333bcc", "悬浮提醒 热点图 背景色"],
        "floatHeatFc": ["#adbac7", "悬浮提醒 热点图 字色"],
        "cellBgc": ["#2d333b", "热点图空白格 背景色"],
        "perfectLineNotiFc": ["#f85149", "未达到完美线的高亮字色"],
        "bvpkWin": ["#2da44e", "bvpk获胜 背景色"],
        "bvpkLose": ["#d33a2f", "bvpk失败 背景色"],
        "bvpkDraw": ["#444c56", "bvpk平局 背景色"],
        "bvpkSolo": ["#3fb950", "bvpk独占 背景色"],
        "dailyPBLabelFc": ["#e1d5d5", "每日pb标签字色"]
    },
    "鲜艳": {
        "themeName": "鲜艳",
        "introduce": "",
        "headBgc": ["#1ABCBD", "标题 背景色"],
        "headFc": ["#FFFFFF", "标题 字色"],
        "navBgc": ["#F4A5A1", "导航栏背景色"],
        "navABgc": ["#F4A5A1", "导航栏项目 背景色"],
        "navAFc": ["#1E293B", "导航栏项目 字色"],
        "navHvBgc": ["#ff8295", "导航栏项目悬停 背景色"],
        "navHvFc": ["#1E293B", "导航栏项目 悬停 字色"],
        "navAcBgc": ["#f85d74", "导航栏项目 激活 背景色"],
        "navAcFc": ["#FFFFFF", "导航栏项目 激活 字色"],
        "navEvBgc": ["#51d9d9", "导航栏活动项 背景色"],
        "navEvFc": ["#1E293B", "导航栏活动项 字色"],
        "navEvHvBgc": ["#1ABCBD", "导航栏活动项 悬停 背景色"],
        "navEvHvFc": ["#1E293B", "导航栏活动项 悬停 字色"],
        "navEvAcBgc": ["#1ABCBD", "导航栏活动项 激活 背景色"],
        "navEvAcFc": ["#FFFFFF", "导航栏活动项 激活 字色"],
        "navUpBgc": ["#FFE246", "导航栏刷新/链接项 背景色"],
        "navUpFc": ["#1E293B", "导航栏刷新/链接项 字色"],
        "navUpHvBgc": ["#ffea70", "导航栏刷新/链接项 悬停 背景色"],
        "navUpHvFc": ["#1E293B", "导航栏刷新/链接项 悬停 字色"],
        "contentBgc": ["#FFFFFF", "内容区域 背景色"],
        "contentFc": ["#1E293B", "内容区域 字色"],
        "tableFc": ["#081221", "表格 字色"],
        "tableOddRowBgc": ["#06b8a0", "表格 奇数行 背景色"],
        "tableEvenRowBgc": ["#e8f7f7", "表格 偶数行 背景色"],
        "tableTic1ColBgc": ["#06b8a0", "有标题的表格 标题列 背景色"],
        "tableTic1RowBgc": ["#06b8a0", "有标题的表格 标题行 背景色"],
        "tableTicOddRowBgc": ["#e8f7f7", "有标题的表格 奇数行 背景色"],
        "tableTicEvenRowBgc": ["#79D1C3", "有标题的表格 偶数行 背景色"],
        "tableTicHvRowBgc": ["#4db0c6", "有标题的表格 悬停行 背景色"],
        "tableExtraRowBgc": ["#D9F99D", "表格 额外标题（奖杯栏）"],
        "atv1BestBgc": ["#b3eb9d", "门票价格图例 最赚"],
        "atv1MidBgc": ["#ddf196", "门票价格图例 次赚"],
        "atv1WorstBgc": ["#e4c79a", "门票价格图例 最亏"],
        "levelFirstColor": ["#63BE7B", "色阶 最优颜色"],
        "levelSecondColor": ["#FFEB84", "色阶 中间颜色"],
        "levelThirdColor": ["#F8696B", "色阶 最差颜色"],
        "buttonBgc": ["#ffb5db", "按钮 背景色"],
        "buttonFc": ["#000000", "按钮 字色"],
        "buttonAcBgc": ["#f74971", "按钮 激活 背景色"],
        "buttonAcFc": ["#FFFFFF", "按钮 激活 字色"],
        "buttonProgBgc": ["#eab04a", "按钮 运行中 背景色"],
        "buttonSuccBgc": ["#1ad597", "按钮 提取成功 背景色"],
        "inputBgc": ["#ffeaef", "输入框 背景色"],
        "inputBdc": ["#CBD5E1", "输入框 边框色"],
        "inputFc": ["#1E293B", "输入框 字色"],
        "inputPhFc": ["#8e9aaa", "输入框 默认内容 字色"],
        "inputHvBdc": ["#f74971", "输入框 悬停 边框色"],
        "inputHvSdc": ["#f7497180", "输入框 悬停 阴影色"],
        "inputFcBdc": ["#f74971", "输入框 聚焦 边框色"],
        "inputFcSdc": ["#f7497180", "输入框 聚焦 阴影色"],
        "sliderCircleC": ["#FFFFFF", "滑块 填充色"],
        "sliderOffBgc": ["#CBD5E1", "滑块 关闭 背景色"],
        "sliderOnBgc": ["#26e3dd", "滑块 开启 背景色"],
        "selectBgc": ["#ffeaef", "下拉菜单 背景色"],
        "selectBdc": ["#CBD5E1", "下拉菜单 边框色"],
        "selectFc": ["#1E293B", "下拉菜单 字色"],
        "selectOpBgc": ["#EFF6FF", "下拉菜单选项 背景色"],
        "floatCopyBgc": ["#10B981", "悬浮提醒 已复制 背景色"],
        "floatCopyFc": ["#FFFFFF", "悬浮提醒 已复制 字色"],
        "floatTreeBgc": ["#1E293BCC", "悬浮提醒 树状图 背景色"],
        "floatTreeFc": ["#FFFFFF", "悬浮提醒 树状图 字色"],
        "floatHeatBgc": ["#1E293BCC", "悬浮提醒 热点图 背景色"],
        "floatHeatFc": ["#FFFFFF", "悬浮提醒 热点图 字色"],
        "cellBgc": ["#F1F5F9", "热点图空白格 背景色"],
        "perfectLineNotiFc": ["#ff0000", "未达到完美线的高亮字色"],
        "bvpkWin": ["#10B981", "bvpk获胜 背景色"],
        "bvpkLose": ["#EF4444", "bvpk失败 背景色"],
        "bvpkDraw": ["#3B82F6", "bvpk平局 背景色"],
        "bvpkSolo": ["#A3E635", "bvpk独占 背景色"],
        "dailyPBLabelFc": ["#000000", "每日pb标签字色"]
    }
};