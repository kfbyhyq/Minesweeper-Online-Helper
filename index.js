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
    document.getElementById('nav-eventQuest').addEventListener('click', function(event) {
        showPage('eventQuest');
    });
    document.getElementById('nav-setting').addEventListener('click', function(event) {
        document.getElementById('saveSucc').style.display = "none";
        showPage('setting');
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

/* 打开页面功能 */
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
    document.getElementById('marketPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/marketplace', active: true });
    });
    document.getElementById('arenaPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/arena', active: true });
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
    document.getElementById('eventPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/events', active: true });
    });
    document.getElementById('equipmentPage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/equipment', active: true });
    });
    document.getElementById('equipmentPage2').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/equipment', active: true });
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
    document.getElementById('myGamePage').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/my-games', active: true });
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
            document.getElementById('peDaily').style.display = "none";
            document.getElementById('showPedFlag').textContent = 0;
        } else {
            document.getElementById('showPeDaily').textContent = '收起每日财产变化';
            document.getElementById('peDaily').style.display = "table";
            document.getElementById('showPedFlag').textContent = 1;
        }
    });
    document.getElementById('showPrDaily').addEventListener('click', function () {
        if (document.getElementById('showPrdFlag').textContent == 1) {
            document.getElementById('showPrDaily').textContent = '展开每日资源变化';
            document.getElementById('prDaily').style.display = "none";
            document.getElementById('showPrdFlag').textContent = 0;
        } else {
            document.getElementById('showPrDaily').textContent = '收起每日资源变化';
            document.getElementById('prDaily').style.display = "table";
            document.getElementById('showPrdFlag').textContent = 1;
        }
    });
});

/* 历史价格 */
document.addEventListener('DOMContentLoaded', function() {
    var pdCategory = ['', '宝石', '竞技场币', 
        '速度门票', '速度NG门票', '盲扫门票', '效率门票', '高难度门票', '随机难度门票', '硬核门票', '硬核NG门票', '耐力门票', '噩梦门票', 
        'L1门票', 'L2门票', 'L3门票', 'L4门票', 'L5门票', 'L6门票', 'L7门票', 'L8门票'];
    var gemsCategory = ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'];
    var acCategory = ['金竞技场币', '铜竞技场币', '银竞技场币', '镍竞技场币', '钢竞技场币', '铁竞技场币', '钯竞技场币', '钛竞技场币', '锌竞技场币', '铂竞技场币'];
    var atCategory = ['速度', '速度NG', '盲扫', '效率', '高难度', '随机难度', '硬核', '硬核NG', '耐力', '噩梦'];
    var alCategory = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
    const pds = document.getElementById("priceDailySelect");
    const eDate = document.getElementById('editPriceDate');
    const eg = document.getElementById("editGems");
    const eac = document.getElementById("editAcs");
    const eat = document.getElementById("editAt");
    const eal = document.getElementById("editAl");
    /* 初始化界面 */
    for (let i = 0; i < pdCategory.length; i++) {
        let op = document.createElement("option");
        op.value = i;
        op.textContent = pdCategory[i];
        pds.appendChild(op);
    }
    for (let i = 0; i < gemsCategory.length; i++) {
        let opg = document.createElement("option");
        opg.value = i;
        opg.textContent = gemsCategory[i];
        eg.appendChild(opg);
        let opac = document.createElement("option");
        opac.value = i;
        opac.textContent = acCategory[i];
        eac.appendChild(opac);
        let opat = document.createElement("option");
        opat.value = i;
        opat.textContent = atCategory[i];
        eat.appendChild(opat);
    }
    for (let i = 0; i < alCategory.length; i++) {
        let opal = document.createElement("option");
        opal.value = i;
        opal.textContent = alCategory[i];
        eal.appendChild(opal);
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
    /* 修改单条数据 */
    document.getElementById('saveEditPrice').addEventListener('click', function () {
        const newPrice = document.getElementById('editNewPrice').value;
        if (newPrice > 0) {
            const pdc = document.getElementById("priceDailySelect").value;
            const date = document.getElementById('editPriceDate').value;
            const egv = document.getElementById("editGems").value;
            const eacv = document.getElementById("editAcs").value;
            const eatv = document.getElementById("editAt").value;
            const ealv = document.getElementById("editAl").value;
            chrome.storage.local.get(['gemsPriceMap', 'ticketPriceMap'], function (result) {
                const gpMap = result.gemsPriceMap || {};
                const tpMap = result.ticketPriceMap || {};
                try {
                    if (pdc == 0) {
                        const dateKey = date.replace(/-/g, '');
                        gpMap[dateKey][1][egv] = newPrice;
                        chrome.storage.local.set({ gemsPriceMap: gpMap });
                        displayPriceDaily();
                    } else if (pdc == 1) {
                        const dateKey = date.replace(/-/g, '');
                        gpMap[dateKey][3][eacv] = newPrice;
                        chrome.storage.local.set({ gemsPriceMap: gpMap });
                        displayPriceDaily();
                    } else if (pdc < 12) {
                        const dateKey = date.replace(/-/g, '');
                        tpMap[dateKey][pdc - 1][+ealv + 1] = newPrice;
                        chrome.storage.local.set({ ticketPriceMap: tpMap });
                        displayPriceDaily();
                    } else if (pdc < 20) {
                        const dateKey = date.replace(/-/g, '');
                        tpMap[dateKey][+eatv + 1][pdc - 11] = newPrice;
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
    displayBVPB();
    const level = document.getElementById("pbOfBVLevel");
    const type = document.getElementById("pbOfBVType");
    const isNf = document.getElementById("pbOfBVIsNf");
    const beg = document.getElementById("pbOfBV-beg");
    const int = document.getElementById("pbOfBV-int");
    const exp = document.getElementById("pbOfBV-exp");
    const wins = document.getElementById("pbOfBV-wins");
    const time = document.getElementById("pbOfBV-time");
    const bvs = document.getElementById("pbOfBV-bvs");
    const eff = document.getElementById("pbOfBV-eff");
    const nf = document.getElementById("pbOfBV-nf");
    // 默认为高级时间
    level.textContent = 3;
    exp.style.backgroundColor = '#8fc4ef';
    type.textContent = 1;
    time.style.backgroundColor = '#8fc4ef';
    isNf.textContent = 0;
    nf.style.backgroundColor = '#D8F1EE';
    beg.addEventListener('click', function() {
        level.textContent = 1;
        beg.style.backgroundColor = '#8fc4ef';
        int.style.backgroundColor = '#D8F1EE';
        exp.style.backgroundColor = '#D8F1EE';
        displayBVPB();
    });
    int.addEventListener('click', function() {
        level.textContent = 2;
        beg.style.backgroundColor = '#D8F1EE';
        int.style.backgroundColor = '#8fc4ef';
        exp.style.backgroundColor = '#D8F1EE';
        displayBVPB();
    });
    exp.addEventListener('click', function() {
        level.textContent = 3;
        beg.style.backgroundColor = '#D8F1EE';
        int.style.backgroundColor = '#D8F1EE';
        exp.style.backgroundColor = '#8fc4ef';
        displayBVPB();
    });
    wins.addEventListener('click', function() {
        type.textContent = 0;
        wins.style.backgroundColor = '#8fc4ef';
        time.style.backgroundColor = '#D8F1EE';
        bvs.style.backgroundColor = '#D8F1EE';
        eff.style.backgroundColor = '#D8F1EE';
        displayBVPB();
    });
    time.addEventListener('click', function() {
        type.textContent = 1;
        wins.style.backgroundColor = '#D8F1EE';
        time.style.backgroundColor = '#8fc4ef';
        bvs.style.backgroundColor = '#D8F1EE';
        eff.style.backgroundColor = '#D8F1EE';
        displayBVPB();
    });
    bvs.addEventListener('click', function() {
        type.textContent = 3;
        wins.style.backgroundColor = '#D8F1EE';
        time.style.backgroundColor = '#D8F1EE';
        bvs.style.backgroundColor = '#8fc4ef';
        eff.style.backgroundColor = '#D8F1EE';
        displayBVPB();
    });
    eff.addEventListener('click', function() {
        type.textContent = 5;
        wins.style.backgroundColor = '#D8F1EE';
        time.style.backgroundColor = '#D8F1EE';
        bvs.style.backgroundColor = '#D8F1EE';
        eff.style.backgroundColor = '#8fc4ef';
        displayBVPB();
    });
    nf.addEventListener('click', function() {
        if (isNf.textContent == 0) {
            isNf.textContent = 1;
            nf.style.backgroundColor = '#8fc4ef';
            displayBVPB();
        } else {
            isNf.textContent = 0;
            nf.style.backgroundColor = '#D8F1EE';
            displayBVPB();
        }
    });
    /* 重新统计功能 */
    document.getElementById("updatePbofBV").addEventListener('click', function() {
        chrome.storage.local.get(['BVMap', 'pbOfBV', 'pbOfBVMap'], function(result) {
            const BVMap = result.BVMap || {};
            console.log('旧统计', result.pbOfBV)
            const pbOfBV = {1:{}, 2:{}, 3:{}};
            const pbOfBVMap = result.pbOfBVMap || {};
            for (let level = 1; level <= 3; level++) {
                for (let id in BVMap[level]) {
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
                }
            }

            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            pbOfBVMap[newDate] = pbOfBV;
            
            console.log('新统计', pbOfBV);
            console.log(pbOfBVMap);

            chrome.storage.local.set({ pbOfBV: pbOfBV });
            chrome.storage.local.set({ pbOfBVMap: pbOfBVMap });
            setTimeout(() => {
                displayBVPB();
            }, 100);
        });
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
        if (configurableCoef) {
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
        } else {
            document.getElementById('act2ep').placeholder = 2.5;
            document.getElementById('ep2mc').placeholder = 56.6;
            document.getElementById('spArenaCoef').placeholder = 1;
            document.getElementById('spngArenaCoef').placeholder = 1;
            document.getElementById('nfArenaCoef').placeholder = 1;
            document.getElementById('effArenaCoef').placeholder = 1;
            document.getElementById('hdArenaCoef').placeholder = 1;
            document.getElementById('rdArenaCoef').placeholder = 1;
            document.getElementById('hcArenaCoef').placeholder = 1;
            document.getElementById('hcngArenaCoef').placeholder = 1;
            document.getElementById('edArenaCoef').placeholder = 1;
            document.getElementById('nmArenaCoef').placeholder = 1;
            document.getElementById('hp2mc').placeholder = 56.6;
        }
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
        document.getElementById("hourSelect1").value = autoUpdate[0][1];
        document.getElementById("minuteSelect1").value = autoUpdate[0][2];
        document.getElementById("secondSelect1").value = autoUpdate[0][3];
        document.getElementById('toggleSwitch2').checked = autoUpdate[1][0];
        document.getElementById("hourSelect2").value = autoUpdate[1][1];
        document.getElementById("minuteSelect2").value = autoUpdate[1][2];
        document.getElementById("secondSelect2").value = autoUpdate[1][3];
        document.getElementById('toggleSwitch3').checked = autoUpdate[2][0];
        document.getElementById("hourSelect3").value = autoUpdate[2][1];
        document.getElementById("minuteSelect3").value = autoUpdate[2][2];
        document.getElementById("secondSelect3").value = autoUpdate[2][3];
        document.getElementById('toggleSwitchAt').checked = autoUpdate[3][0];
    });
    /* 自动刷新下拉菜单 */
    const h1 = document.getElementById("hourSelect1");
    const m1 = document.getElementById("minuteSelect1");
    const s1 = document.getElementById("secondSelect1");
    const h2 = document.getElementById("hourSelect2");
    const m2 = document.getElementById("minuteSelect2");
    const s2 = document.getElementById("secondSelect2");
    const h3 = document.getElementById("hourSelect3");
    const m3 = document.getElementById("minuteSelect3");
    const s3 = document.getElementById("secondSelect3");
    for (let hour = 0; hour < 24; hour++) { // 生成小时选项
        let o1 = document.createElement("option");
        o1.value = hour;
        o1.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h1.appendChild(o1);
        let o2 = document.createElement("option");
        o2.value = hour;
        o2.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h2.appendChild(o2);
        let o3 = document.createElement("option");
        o3.value = hour;
        o3.textContent = String(hour).padStart(2, '0'); // 格式化小时
        h3.appendChild(o3);
    }
    for (let min = 0; min < 60; min++) { // 生成分钟选项
        let o1 = document.createElement("option");
        o1.value = min;
        o1.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m1.appendChild(o1);
        let o2 = document.createElement("option");
        o2.value = min;
        o2.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m2.appendChild(o2);
        let o3 = document.createElement("option");
        o3.value = min;
        o3.textContent = String(min).padStart(2, '0'); // 格式化分钟
        m3.appendChild(o3);
    }
    for (let sec = 0; sec < 60; sec++) { // 生成秒钟选项
        let o1 = document.createElement("option");
        o1.value = sec;
        o1.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s1.appendChild(o1);
        let o2 = document.createElement("option");
        o2.value = sec;
        o2.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s2.appendChild(o2);
        let o3 = document.createElement("option");
        o3.value = sec;
        o3.textContent = String(sec).padStart(2, '0'); // 格式化秒钟
        s3.appendChild(o3);
    }
    /* 保存设置 */
    document.getElementById('saveSetting').addEventListener('click', function () {
        var autoUpdate = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0]];
        autoUpdate[0][0]  = document.getElementById("toggleSwitch1").checked;
        if (autoUpdate[0][0]) {
            dailyTaskUpdate();
        }
        autoUpdate[0][1] = h1.value;
        autoUpdate[0][2] = m1.value;
        autoUpdate[0][3] = s1.value;

        autoUpdate[1][0]  = document.getElementById("toggleSwitch2").checked;
        if (autoUpdate[1][0]) {
            dailyTaskEventArena();
        }
        autoUpdate[1][1] = h2.value;
        autoUpdate[1][2] = m2.value;
        autoUpdate[1][3] = s2.value;

        autoUpdate[2][0]  = document.getElementById("toggleSwitch3").checked;
        if (autoUpdate[2][0]) {
            dailyTaskFriendQuest();
        }
        autoUpdate[2][1] = h3.value;
        autoUpdate[2][2] = m3.value;
        autoUpdate[2][3] = s3.value;

        autoUpdate[3][0]  = document.getElementById("toggleSwitchAt").checked;

        chrome.storage.local.set({ autoUpdate: autoUpdate });

        const pId = document.getElementById('personalId').value;
        if (pId.trim() === "") {
            document.getElementById('saveSucc').innerText = "保存成功！"
            document.getElementById('saveSucc').style.display = "block";
        } else if (!isNaN(pId)) {
            chrome.storage.local.set({ pId: pId });
            document.getElementById('pIdNow').innerText = pId;
            document.getElementById('personalId').placeholder = pId;
            document.getElementById('saveSucc').innerText = "保存成功！"
            document.getElementById('saveSucc').style.display = "block";
        } else {
            document.getElementById('saveSucc').innerText = "ID格式错误"
            document.getElementById('saveSucc').style.display = "block";
        }
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
                    const gpMap = result.gemsPriceMap || {};
                    const gpMapIn = dataIn['gemsPriceMap'];
                    for (const key in gpMapIn) {
                        gpMap[key] = gpMapIn[key];
                    }
                    chrome.storage.local.set({ gemsPriceMap: gpMap });
                    /* 竞技场门票 */
                    const tpMap = result.ticketPriceMap || {};
                    const tpMapIn = dataIn['ticketPriceMap'];
                    for (const key in tpMapIn) {
                        tpMap[key] = tpMapIn[key];
                    }
                    chrome.storage.local.set({ ticketPriceMap: tpMap });
                    /* 装备加成 */
                    const equipStatsMap = result.equipStatsMap || {};
                    const equipStatsMapIn = dataIn['equipStatsMap'];
                    for (const key in equipStatsMapIn) {
                        equipStatsMap[key] = equipStatsMapIn[key];
                    }
                    chrome.storage.local.set({ equipStatsMap: equipStatsMap });
                    /* 游戏数据 */
                    const stMap = result.statisticsMap || {};
                    const stMapIn = dataIn['statisticsMap'];
                    for (const key in stMapIn) {
                        stMap[key] = stMapIn[key];
                    }
                    chrome.storage.local.set({ statisticsMap: stMap });
                    /* 个人数据 */
                    const pdMap = result.personalDataMap || {};
                    const pdMapIn = dataIn['personalDataMap'];
                    for (const key in pdMapIn) {
                        pdMap[key] = pdMapIn[key];
                    }
                    chrome.storage.local.set({ personalDataMap: pdMap });
                    /* 财产数据 */
                    const peMap = result.personalEcoMap || {};
                    const peMapIn = dataIn['personalEcoMap'];
                    for (const key in peMapIn) {
                        peMap[key] = peMapIn[key];
                    }
                    /* 好友 */
                    const contactsList = result.contactsList || {};
                    const contactsListIn = dataIn['contactsList'];
                    for (const uid in contactsListIn) {
                        if (!contactsList[uid]) {
                            contactsList[uid] = [contactsListIn[uid][0], Object.keys(contactsList).length];
                        }
                    }
                    chrome.storage.local.set({ contactsList: contactsList });
                    /* BVPB */
                    const BVMap = result.BVMap || {};
                    const BVMapIn = dataIn['BVMap'];
                    for (let i = 1; i <= 3; i++) {
                        if (BVMap[i]) {
                            for (const id in BVMapIn[i]) {
                                BVMap[i][id] = BVMapIn[i][id];
                            }
                        } else {
                            BVMap[i] = BVMapIn[i];
                        }
                    }
                    const pbOfBVMap = result.pbOfBVMap || {};
                    const pbOfBVMapIn = dataIn['pbOfBVMap'];
                    for (const date in pbOfBVMapIn) {
                        pbOfBVMap[date] = pbOfBVMapIn[date];
                    }
                    chrome.storage.local.set({ BVMap: BVMap });
                    chrome.storage.local.set({ pbOfBVMap: pbOfBVMap });
                    /* 活动竞技场 */
                    const eapMap = result.eaPriceMap || {};
                    const eapMapIn = dataIn['eaPriceMap'];
                    for (const key in eapMapIn) {
                        eapMap[key] = eapMapIn[key];
                    }
                    chrome.storage.local.set({ eaPriceMap: eapMap });
                    /* 友谊任务 */
                    const fqInfo = result.friendQuestInfo || {};
                    const fqInfoIn = dataIn['friendQuestInfo'];
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

                    let acMap = result.activityMap || {};
                    const acMapIn = dataIn['activityMap'];
                    for (const date in acMapIn) {
                        acMap[date] = acMapIn[date]
                    }
                    chrome.storage.local.set({ activityMap: acMap });

                    let fqDaily = result.friendQuestDaily || {};
                    const fqDailyIn = dataIn['friendQuestDaily'];
                    for (const date in fqDailyIn) {
                        if (!fqDaily[date]) {
                            fqDaily[date] = fqDailyIn[date];
                        } else {
                            fqDaily[date].fqSend = { ...fqDailyIn[date].fqSend, ...fqDaily[date].fqSend };
                            fqDaily[date].fqReceive = { ...fqDailyIn[date].fqReceive, ...fqDaily[date].fqReceive };
                        }
                    }
                    chrome.storage.local.set({ friendQuestDaily: fqDaily });
                    /* 设置 */
                    const pId = result.pId;
                    if (pId) {
                        chrome.storage.local.set({ pId: pId });
                    }
                    const autoUpdate = result.autoUpdate;
                    if (autoUpdate) {
                        chrome.storage.local.set({ autoUpdate: autoUpdate });
                    }
                    const configurableCoef = result.configurableCoef;
                    if (configurableCoef) {
                        chrome.storage.local.set({ configurableCoef: configurableCoef });
                    }
                    const advancedMode = result.advancedMode;
                    if (advancedMode) {
                        chrome.storage.local.set({ advancedMode: advancedMode });
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